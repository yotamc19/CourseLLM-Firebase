/**
 * Firebase Storage UI End-to-End Tests
 *
 * True E2E tests that test file upload and delete through the browser UI.
 * Uses the Firebase Auth emulator to sign in with a test Google account.
 *
 * Prerequisites:
 *   1. Firebase emulators running: firebase emulators:start
 *   2. Next.js dev server running: npm run dev
 *
 * To run:
 *   npx playwright test --config=tests/playwright.config.ts storage-ui.spec.ts --headed
 */

import { test, expect, Page } from '@playwright/test';
import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:9002';

// Read the project ID from .firebaserc to match what the emulator uses
function getProjectIdFromFirebaserc(): string {
  try {
    const firebasercPath = path.resolve(__dirname, '../../.firebaserc');
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, 'utf-8'));
    return firebaserc.projects?.default || 'demo-project';
  } catch {
    // Fallback for CI or if .firebaserc doesn't exist
    return process.env.FIREBASE_PROJECT_ID || 'demo-project';
  }
}

const firebaseConfig = {
  projectId: getProjectIdFromFirebaserc(),
};

test.describe('Storage UI End-to-End Tests', () => {
  // Run these tests serially to avoid emulator state conflicts
  test.describe.configure({ mode: 'serial' });

  let testCourseId: string;
  let testTeacherUid: string;

  test.beforeAll(async () => {
    // Set emulator hosts
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

    // Initialize Admin SDK
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
    }

    // Create unique IDs
    testCourseId = `test-course-${Date.now()}`;
    testTeacherUid = `test-teacher-uid`; // Will be replaced after sign in
  });

  /**
   * Sign in using the emulator's "Add new account" flow
   * Includes retry logic for flaky popup-based auth
   */
  async function signInWithEmulator(page: Page, retryCount = 0): Promise<string> {
    const MAX_RETRIES = 2;

    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Click "Sign in with Google" button
    const signInButton = page.locator('button:has-text("Sign in with Google")');
    await expect(signInButton).toBeVisible();

    // The emulator will show a popup - wait for it
    const popupPromise = page.waitForEvent('popup');
    await signInButton.click();

    let popup;
    try {
      popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
    } catch (e) {
      console.log('Failed to get popup, retrying...');
      if (retryCount < MAX_RETRIES) {
        return signInWithEmulator(page, retryCount + 1);
      }
      throw e;
    }

    try {
      // In the emulator popup, click "Add new account"
      const addAccountButton = popup.getByText('Add new account');
      await addAccountButton.waitFor({ timeout: 10000 });
      await addAccountButton.click();

      // Auto-generate user - click the "Auto-generate user information" or just submit
      // The emulator should have an auto-generate option or we fill in manually
      const autoGenerateButton = popup.getByText('Auto-generate user information');
      if (await autoGenerateButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await autoGenerateButton.click();
      }

      // Click "Sign in" or "Sign in with Google" in the popup
      const signInPopupButton = popup.locator('button:has-text("Sign in")').first();
      await signInPopupButton.waitFor({ timeout: 5000 });
      await signInPopupButton.click();

      // Wait for popup to close and redirect to happen
      await popup.waitForEvent('close', { timeout: 10000 }).catch(() => {});
    } catch (e) {
      console.log('Popup interaction failed:', e);
      // Try to close popup if still open
      if (!popup.isClosed()) {
        await popup.close().catch(() => {});
      }
      if (retryCount < MAX_RETRIES) {
        return signInWithEmulator(page, retryCount + 1);
      }
      throw e;
    }

    // Wait for redirect after successful sign in - should go to /onboarding or /student or /teacher
    try {
      await page.waitForURL(/\/(onboarding|student|teacher)/, { timeout: 10000 });
      console.log('Sign in redirect complete:', page.url());
    } catch {
      console.log('Sign in redirect timeout, current URL:', page.url());
      // If still on login page, try again
      if (page.url().includes('/login')) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying sign-in (attempt ${retryCount + 2})...`);
          return signInWithEmulator(page, retryCount + 1);
        }
        // Last resort - reload and wait
        await page.reload();
        await page.waitForTimeout(3000);
      }
    }

    // Get the UID directly from the browser's current user
    try {
      // First, get the UID from the browser
      const browserUid = await page.evaluate(async () => {
        // @ts-ignore - exposed by firebase.ts for testing
        const firebaseAuth = window.__FIREBASE_AUTH__;
        if (firebaseAuth && firebaseAuth.currentUser) {
          return firebaseAuth.currentUser.uid;
        }
        return null;
      });

      if (browserUid) {
        testTeacherUid = browserUid;
        console.log(`Got UID from browser: ${testTeacherUid}`);

        // Set custom claims for the teacher role using Admin SDK
        await admin.auth().setCustomUserClaims(testTeacherUid, { role: 'teacher' });
        console.log(`Set teacher role for user: ${testTeacherUid}`);

        // Force token refresh in the browser
        const refreshed = await page.evaluate(async () => {
          // @ts-ignore - exposed by firebase.ts for testing
          const firebaseAuth = window.__FIREBASE_AUTH__;
          if (firebaseAuth && firebaseAuth.currentUser) {
            try {
              await firebaseAuth.currentUser.getIdToken(true);
              return 'success';
            } catch (e: any) {
              return `error: ${e.message}`;
            }
          }
          return 'no-user';
        });
        console.log('Token refresh result:', refreshed);

        // Reload to ensure the app uses the new token with claims
        if (refreshed === 'success') {
          await page.reload();
          await page.waitForTimeout(1000);
        }
      } else {
        console.warn('No user found in browser after sign-in');
      }
    } catch (e) {
      console.warn('Could not set custom claims:', e);
    }

    return testTeacherUid;
  }

  /**
   * Create test course in Firestore for the signed-in user
   */
  async function setupTestCourse(uid: string): Promise<void> {
    const db = admin.firestore();

    // Create/update user profile as teacher
    await db.doc(`users/${uid}`).set({
      uid,
      email: `${uid}@example.test`,
      displayName: 'Test Teacher',
      role: 'teacher',
      department: 'Test Department',
      courses: [testCourseId],
      profileComplete: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create test course
    await db.doc(`courses/${testCourseId}`).set({
      id: testCourseId,
      title: 'Test Course for E2E',
      description: 'A test course for storage UI tests',
      teacherId: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  /**
   * Complete the onboarding flow as a teacher and ensure we end up on teacher dashboard
   */
  async function completeOnboarding(page: Page): Promise<void> {
    // Wait for navigation to settle after sign-in
    // The app may redirect to /onboarding, /student, or /teacher
    try {
      await page.waitForURL(/\/(onboarding|student|teacher)/, { timeout: 10000 });
    } catch {
      // If timeout, check current URL anyway
    }

    const url = page.url();
    console.log('Current URL:', url);

    // If already on teacher page, ensure test course exists and we're done
    if (url.includes('/teacher')) {
      console.log('Already on teacher page, ensuring test course exists');
      await setupTestCourse(testTeacherUid);
      return;
    }

    // If on student page, setup as teacher and navigate
    if (url.includes('/student')) {
      console.log('On student page, setting up as teacher and navigating');
      await setupTestCourse(testTeacherUid);
      await page.goto(`${BASE_URL}/teacher`);
      await page.waitForURL('**/teacher**', { timeout: 10000 });
      return;
    }

    // Check URL for onboarding
    if (!url.includes('/onboarding')) {
      console.log('Not on onboarding page, setting up test course and navigating to teacher');
      await setupTestCourse(testTeacherUid);
      await page.goto(`${BASE_URL}/teacher`);
      await page.waitForURL('**/teacher**', { timeout: 10000 });
      return;
    }

    console.log('On onboarding page, completing flow...');

    // Wait for the Teacher button to be visible and click immediately
    const teacherButton = page.locator('button:has-text("Teacher")');
    await teacherButton.waitFor({ state: 'visible', timeout: 5000 });
    await teacherButton.evaluate((btn) => (btn as HTMLButtonElement).click());
    console.log('Clicked Teacher button');

    // Wait for UI to update - minimal delay
    await page.waitForTimeout(100);

    // Fill in Department field
    await page.fill('input[placeholder="e.g. Computer Science"]', 'Test Department');
    console.log('Filled department');

    // Fill in a course and click Add
    await page.fill('input[placeholder="Add a course and press Enter"]', 'Test Course');
    const addButton = page.locator('button:has-text("Add")');
    await addButton.evaluate((btn) => (btn as HTMLButtonElement).click());
    console.log('Added course');

    // Wait a bit for course to be added - minimal delay
    await page.waitForTimeout(100);

    // Click "Save and Continue"
    const saveButton = page.locator('button:has-text("Save and Continue")');
    await saveButton.evaluate((btn) => (btn as HTMLButtonElement).click());
    console.log('Clicked Save and Continue');

    // Wait for redirect to teacher dashboard
    await page.waitForURL('**/teacher**', { timeout: 15000 });

    // Get the current user UID and ensure they have teacher claims
    const uid = await page.evaluate(async () => {
      // @ts-ignore - exposed by firebase.ts for testing
      const firebaseAuth = window.__FIREBASE_AUTH__;
      if (firebaseAuth && firebaseAuth.currentUser) {
        return firebaseAuth.currentUser.uid;
      }
      return null;
    });

    if (uid) {
      // Set custom claims via Admin SDK (in case they weren't set during sign-in)
      await admin.auth().setCustomUserClaims(uid, { role: 'teacher' });
      console.log(`Set teacher claims for user: ${uid}`);

      // Force token refresh to pick up the new claims
      const refreshResult = await page.evaluate(async () => {
        // @ts-ignore - exposed by firebase.ts for testing
        const firebaseAuth = window.__FIREBASE_AUTH__;
        if (firebaseAuth && firebaseAuth.currentUser) {
          try {
            await firebaseAuth.currentUser.getIdToken(true);
            const idTokenResult = await firebaseAuth.currentUser.getIdTokenResult();
            return {
              status: 'success',
              claims: idTokenResult.claims,
              uid: firebaseAuth.currentUser.uid
            };
          } catch (e: any) {
            return { status: 'error', message: e.message };
          }
        }
        return { status: 'no-user' };
      });
      console.log('Token refresh after onboarding:', JSON.stringify(refreshResult));
    }
  }

  /**
   * Helper to create a test file
   */
  function createTestFile(filename: string, content: string): string {
    const testFilesDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
    const filePath = path.join(testFilesDir, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  test('Teacher can upload a file through the UI', async ({ page }) => {
    test.setTimeout(90000);

    // Sign in using emulator
    await signInWithEmulator(page);

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);
    await page.waitForTimeout(1000);

    console.log('On teacher dashboard:', page.url());

    // Navigate to courses page to see the course list
    await page.goto(`${BASE_URL}/teacher/courses`);
    await page.waitForTimeout(2000);

    console.log('On courses page:', page.url());

    // Click "Manage" on the first course (use button selector to avoid matching heading text)
    const manageButton = page.locator('button:has-text("Manage")').first();
    await manageButton.waitFor({ timeout: 10000 });
    await manageButton.click();
    await page.waitForURL('**/teacher/courses/**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('On course management page:', page.url());

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
      await page.waitForTimeout(1000);
    }

    // Create and upload test file
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testFilePath = createTestFile(testFileName, 'Test content for E2E upload.');

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(testFilePath);

    // Verify file selected
    await expect(page.locator(`text=${testFileName}`)).toBeVisible({ timeout: 5000 });

    // Click Upload
    const uploadButton = page.locator('button:has-text("Upload")').first();
    await expect(uploadButton).toBeEnabled();
    await uploadButton.click();

    // Wait for upload to complete and verify file appears in materials list
    // The file should appear in the list after successful upload
    const fileTitle = testFileName.replace('.txt', ''); // Title is filename without extension
    await expect(page.locator(`text=${fileTitle}`).first()).toBeVisible({ timeout: 15000 });
    console.log('File uploaded successfully:', fileTitle);

    // Cleanup local file
    fs.unlinkSync(testFilePath);
  });

  test('Teacher can delete a file through the UI', async ({ page }) => {
    test.setTimeout(90000);

    await signInWithEmulator(page);

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);
    await page.waitForTimeout(1000);

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
      await page.waitForTimeout(1000);
    }

    // Upload a file first - use a unique filename
    const testFileName = `test-delete-${Date.now()}.txt`;
    const testFilePath = createTestFile(testFileName, 'File to be deleted.');

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(testFilePath);

    // Wait for file to be selected
    await expect(page.locator(`text=Selected: ${testFileName}`)).toBeVisible({ timeout: 5000 });

    const uploadButton = page.locator('button:has-text("Upload")').first();
    await expect(uploadButton).toBeEnabled({ timeout: 5000 });

    // Set up listener for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });

    // Click upload and watch for loading state
    console.log('Clicking upload button...');
    await uploadButton.click();

    // Wait for the button to show loading state
    const buttonText = await uploadButton.textContent();
    console.log('Button text after click:', buttonText);

    // Wait a bit for the upload to process
    await page.waitForTimeout(5000);

    // Check the button state again
    const buttonTextAfter = await uploadButton.textContent();
    console.log('Button text after waiting:', buttonTextAfter);

    // Wait for upload to complete by checking for the file in the materials list
    const fileTitle = testFileName.replace('.txt', '');

    // The material should appear as a span with the EXACT title (without extension)
    // Use exact text match to avoid matching old files from previous test runs
    const materialTitle = page.locator(`span.font-medium`).filter({ hasText: new RegExp(`^${fileTitle}$`) }).first();

    try {
      await materialTitle.waitFor({ timeout: 30000 });
      console.log('File uploaded for deletion test:', fileTitle);
    } catch (e) {
      // If upload didn't work, take a screenshot and log what's on the page
      console.log('Upload may have failed. Materials on page:');
      const materials = await page.locator('span.font-medium').allTextContents();
      console.log('Found materials:', materials);
      throw e;
    }

    // Find the delete button in the same row as the title
    // The material row has classes "flex items-center gap-4 p-2 border rounded-lg"
    const materialRow = page.locator(`div.flex.items-center.gap-4.p-2.border.rounded-lg`).filter({ has: materialTitle });

    // Log how many rows match
    const rowCount = await materialRow.count();
    console.log('Found material rows matching:', rowCount);

    // The delete button should be the button inside the row (there's only one button per material row)
    const deleteButton = materialRow.locator('button');
    await deleteButton.waitFor({ timeout: 5000 });
    console.log('Delete button found');

    // Log any console messages during delete
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Click delete
    console.log('Clicking delete button...');
    await deleteButton.click();
    console.log('Clicked delete button');

    // Wait for a toast notification - should appear within 5 seconds
    const toastLocator = page.locator('[data-sonner-toast], [role="status"], [role="alert"]').first();
    try {
      await toastLocator.waitFor({ timeout: 10000 });
      const toastText = await toastLocator.textContent();
      console.log('Toast message:', toastText);
    } catch {
      console.log('No toast appeared');
    }

    // Wait a bit for the delete operation to complete and UI to update
    await page.waitForTimeout(2000);

    // Log console messages
    if (consoleMessages.length > 0) {
      console.log('Console messages during delete:', consoleMessages.slice(-10).join('\n'));
    }

    // Check if the material is still visible
    const stillVisible = await materialTitle.isVisible();
    console.log('Material still visible after delete:', stillVisible);

    // Wait for deletion - the material should be removed from the list
    await expect(materialTitle).not.toBeVisible({ timeout: 20000 });
    console.log('File deleted successfully:', fileTitle);

    fs.unlinkSync(testFilePath);
  });

  test('Upload button is disabled without file selected', async ({ page }) => {
    test.setTimeout(60000);

    await signInWithEmulator(page);

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);
    await page.waitForTimeout(1000);

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
    }

    const uploadButton = page.locator('button:has-text("Upload")').first();
    await expect(uploadButton).toBeDisabled({ timeout: 10000 });
  });

  test('File input accepts correct file types', async ({ page }) => {
    test.setTimeout(60000);

    await signInWithEmulator(page);

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);
    await page.waitForTimeout(1000);

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
    }

    const fileInput = page.locator('input[type="file"]');
    const acceptAttr = await fileInput.getAttribute('accept');

    expect(acceptAttr).toContain('.pdf');
    expect(acceptAttr).toContain('.ppt');
    expect(acceptAttr).toContain('.doc');
    expect(acceptAttr).toContain('.md');
    expect(acceptAttr).toContain('.txt');
  });

  test.afterAll(async () => {
    try {
      const db = admin.firestore();
      await db.doc(`courses/${testCourseId}`).delete().catch(() => {});
      await db.doc(`users/${testTeacherUid}`).delete().catch(() => {});

      const testFilesDir = path.join(__dirname, 'test-files');
      if (fs.existsSync(testFilesDir)) {
        fs.rmSync(testFilesDir, { recursive: true });
      }
    } catch (e) {
      console.warn('Cleanup warning:', e);
    }
  });
});
