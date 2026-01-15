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

const firebaseConfig = {
  projectId: "coursellm-firebase",
};

test.describe('Storage UI End-to-End Tests', () => {
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
   */
  async function signInWithEmulator(page: Page): Promise<string> {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Click "Sign in with Google" button
    const signInButton = page.locator('button:has-text("Sign in with Google")');
    await expect(signInButton).toBeVisible();

    // The emulator will show a popup - wait for it
    const popupPromise = page.waitForEvent('popup');
    await signInButton.click();

    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');

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

    // Wait for redirect after successful sign in
    await page.waitForTimeout(3000);

    // Get the UID by listing all users in the emulator and finding the most recent
    try {
      const listResult = await admin.auth().listUsers(100);
      if (listResult.users.length > 0) {
        // Sort by creation time (most recent first) and get the first one
        const sortedUsers = listResult.users.sort((a, b) => {
          const aTime = new Date(a.metadata.creationTime || 0).getTime();
          const bTime = new Date(b.metadata.creationTime || 0).getTime();
          return bTime - aTime;
        });
        const recentUser = sortedUsers[0];
        testTeacherUid = recentUser.uid;

        // Set custom claims for the teacher role using Admin SDK
        await admin.auth().setCustomUserClaims(testTeacherUid, { role: 'teacher' });
        console.log(`Set teacher role for user: ${testTeacherUid}`);

        // Force token refresh in the browser - page.reload() isn't enough
        // We need to call getIdToken(true) to force Firebase to fetch fresh claims
        // First reload to ensure the app picks up any changes
        await page.reload();
        await page.waitForTimeout(2000);

        // Now force token refresh via window.__FIREBASE_AUTH__ (exposed by firebase.ts)
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

        // Reload again to ensure the app uses the new token
        if (refreshed === 'success') {
          await page.reload();
          await page.waitForTimeout(1000);
        }
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
   * Complete the onboarding flow as a teacher
   */
  async function completeOnboarding(page: Page): Promise<void> {
    // Wait for page to settle
    await page.waitForTimeout(200);

    const url = page.url();
    console.log('Current URL:', url);

    // Check URL for onboarding
    if (!url.includes('/onboarding')) {
      console.log('Not on onboarding page, skipping');
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

    await page.waitForTimeout(2000);
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

    // Complete onboarding if needed
    await completeOnboarding(page);

    // After onboarding, we should be redirected to teacher dashboard
    await page.waitForURL('**/teacher**', { timeout: 30000 });
    await page.waitForTimeout(2000);

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

    // Complete onboarding if needed
    await completeOnboarding(page);

    // After onboarding, wait for redirect to teacher dashboard
    await page.waitForURL('**/teacher**', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Navigate to courses page
    await page.goto(`${BASE_URL}/teacher/courses`);
    await page.waitForTimeout(2000);

    // Click "Manage" on the first course (use button selector to avoid matching heading text)
    const manageButton = page.locator('button:has-text("Manage")').first();
    await manageButton.waitFor({ timeout: 10000 });
    await manageButton.click();
    await page.waitForURL('**/teacher/courses/**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
      await page.waitForTimeout(1000);
    }

    // Upload a file first
    const testFileName = `test-delete-${Date.now()}.txt`;
    const testFilePath = createTestFile(testFileName, 'File to be deleted.');

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(testFilePath);

    const uploadButton = page.locator('button:has-text("Upload")').first();
    await uploadButton.click();

    // Wait for upload to complete and verify file appears
    const fileTitle = testFileName.replace('.txt', '');
    await expect(page.locator(`text=${fileTitle}`).first()).toBeVisible({ timeout: 15000 });
    console.log('File uploaded for deletion test:', fileTitle);

    // Find the delete button for the uploaded file
    // Each material row has a span.font-medium with the title and a sibling button for delete
    // We locate the title span and then find the delete button in the same row
    const titleSpan = page.locator(`span.font-medium:has-text("${fileTitle}")`).first();
    await titleSpan.waitFor({ timeout: 10000 });
    // Navigate up to the row (flex items-center gap-4) and find the button
    const deleteButton = page.locator(`div.flex.items-center:has(span.font-medium:has-text("${fileTitle}")) button`).first();
    await deleteButton.waitFor({ timeout: 5000 });
    await deleteButton.click();
    console.log('Clicked delete button');

    // Wait for deletion and verify file is removed from the list
    await expect(page.locator(`text=${fileTitle}`).first()).not.toBeVisible({ timeout: 15000 });
    console.log('File deleted successfully:', fileTitle);

    fs.unlinkSync(testFilePath);
  });

  test('Upload button is disabled without file selected', async ({ page }) => {
    test.setTimeout(60000);

    await signInWithEmulator(page);

    // Complete onboarding if needed
    await completeOnboarding(page);

    // After onboarding, wait for redirect to teacher dashboard
    await page.waitForURL('**/teacher**', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Navigate to courses page
    await page.goto(`${BASE_URL}/teacher/courses`);
    await page.waitForTimeout(2000);

    // Click "Manage" on the first course (use button selector to avoid matching heading text)
    const manageButton = page.locator('button:has-text("Manage")').first();
    await manageButton.waitFor({ timeout: 10000 });
    await manageButton.click();
    await page.waitForURL('**/teacher/courses/**', { timeout: 10000 });
    await page.waitForTimeout(1000);

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

    // Complete onboarding if needed
    await completeOnboarding(page);

    // After onboarding, wait for redirect to teacher dashboard
    await page.waitForURL('**/teacher**', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Navigate to courses page
    await page.goto(`${BASE_URL}/teacher/courses`);
    await page.waitForTimeout(2000);

    // Click "Manage" on the first course (use button selector to avoid matching heading text)
    const manageButton = page.locator('button:has-text("Manage")').first();
    await manageButton.waitFor({ timeout: 10000 });
    await manageButton.click();
    await page.waitForURL('**/teacher/courses/**', { timeout: 10000 });
    await page.waitForTimeout(1000);

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
