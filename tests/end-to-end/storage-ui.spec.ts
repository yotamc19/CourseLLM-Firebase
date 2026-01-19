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

// IMPORTANT: Set emulator env vars BEFORE importing firebase-admin
// This ensures Admin SDK connects to emulators, not production
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

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
    // Initialize Admin SDK (env vars already set at module level)
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
    }

    // Create unique IDs
    testCourseId = `test-course-${Date.now()}`;
    testTeacherUid = `test-teacher-uid`; // Will be replaced after sign in
  });

  // Clear browser state before each test to avoid sign-in flakiness
  test.beforeEach(async ({ page, context }) => {
    // Clear all cookies to ensure clean state
    await context.clearCookies();

    // Navigate and clear all storage (properly awaited)
    await page.goto(BASE_URL);
    await page.evaluate(async () => {
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB for Firebase Auth - must await each deletion
      if (window.indexedDB && typeof indexedDB.databases === 'function') {
        try {
          const dbs = await indexedDB.databases();
          await Promise.all(
            dbs.map(db => {
              return new Promise<void>((resolve, reject) => {
                if (!db.name) {
                  resolve();
                  return;
                }
                const request = indexedDB.deleteDatabase(db.name);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
                request.onblocked = () => {
                  // Force close and retry
                  console.warn(`IndexedDB ${db.name} blocked, forcing close`);
                  resolve();
                };
              });
            })
          );
        } catch (e) {
          console.warn('Failed to clear IndexedDB:', e);
        }
      }
    });

    // Reload the page to ensure Firebase Auth picks up the cleared state
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Force sign out via Firebase Auth if there's a lingering session
    await page.evaluate(async () => {
      // @ts-ignore
      const firebaseAuth = window.__FIREBASE_AUTH__;
      if (firebaseAuth && firebaseAuth.currentUser) {
        try {
          await firebaseAuth.signOut();
        } catch (e) {
          console.warn('Sign out failed:', e);
        }
      }
    });

  });

  /**
   * Sign in using custom token authentication.
   * Uses Admin SDK (already connected to emulators) to create tokens directly.
   */
  async function signInWithEmulator(page: Page): Promise<string> {
    const uid = `test-teacher-${Date.now()}`;

    // Create custom token using Admin SDK (already connected to emulators)
    const token = await admin.auth().createCustomToken(uid, { role: 'teacher' });

    // Navigate to a page where Firebase is initialized
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('domcontentloaded');

    // Sign in with the custom token in the browser
    const signInResult = await page.evaluate(async (customToken: string) => {
      // @ts-ignore - exposed by firebase.ts for testing
      const auth = window.__FIREBASE_AUTH__;
      // @ts-ignore - exposed by firebase.ts for testing
      const signInWithCustomToken = window.__FIREBASE_SIGN_IN_WITH_CUSTOM_TOKEN__;

      if (!auth) {
        return { success: false, error: 'Firebase Auth not available on window' };
      }
      if (!signInWithCustomToken) {
        return { success: false, error: 'signInWithCustomToken not available on window' };
      }

      try {
        const credential = await signInWithCustomToken(auth, customToken);
        return { success: true, uid: credential.user.uid };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }, token);

    if (!signInResult.success) {
      throw new Error(`Custom token sign-in failed: ${signInResult.error}`);
    }

    testTeacherUid = signInResult.uid || uid;

    // Set custom claims via Admin SDK
    try {
      await admin.auth().setCustomUserClaims(testTeacherUid, { role: 'teacher' });
    } catch {
      // Claims may not be settable in emulator - continue anyway
    }

    // Force token refresh to pick up claims
    await page.evaluate(async () => {
      // @ts-ignore
      const auth = window.__FIREBASE_AUTH__;
      if (auth?.currentUser) {
        await auth.currentUser.getIdToken(true);
      }
    });

    // Reload to trigger auth state listener and redirect (use domcontentloaded instead of networkidle to avoid timeout)
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Wait for redirect to onboarding/student/teacher
    try {
      await page.waitForURL(/\/(onboarding|student|teacher)/, { timeout: 10000 });
    } catch {
      // If no redirect happened, that's OK - we'll handle navigation in the test
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

    // If already on teacher page, ensure test course exists and we're done
    if (url.includes('/teacher')) {
      await setupTestCourse(testTeacherUid);
      return;
    }

    // If on student page, setup as teacher and navigate
    if (url.includes('/student')) {
      await setupTestCourse(testTeacherUid);
      await page.goto(`${BASE_URL}/teacher`);
      await page.waitForURL('**/teacher**', { timeout: 10000 });
      return;
    }

    // Check URL for onboarding
    if (!url.includes('/onboarding')) {
      await setupTestCourse(testTeacherUid);
      await page.goto(`${BASE_URL}/teacher`);
      await page.waitForURL('**/teacher**', { timeout: 10000 });
      return;
    }

    // On onboarding page, complete the flow
    const teacherButton = page.locator('button:has-text("Teacher")');
    await teacherButton.waitFor({ state: 'visible', timeout: 5000 });
    await teacherButton.click();

    // Wait for department field to be visible (indicates UI updated after role selection)
    const departmentInput = page.locator('input[placeholder="e.g. Computer Science"]');
    await departmentInput.waitFor({ state: 'visible', timeout: 5000 });
    await departmentInput.fill('Test Department');

    // Fill in a course and click Add
    const courseInput = page.locator('input[placeholder="Add a course and press Enter"]');
    await courseInput.fill('Test Course');
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();

    // Wait for Save and Continue button to be enabled (indicates course was added)
    const saveButton = page.locator('button:has-text("Save and Continue")');
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();

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
      // Try to set custom claims via Admin SDK
      // This may fail if the emulator user hasn't synced yet - that's OK,
      // the app should handle role via Firestore profile during onboarding
      try {
        await admin.auth().setCustomUserClaims(uid, { role: 'teacher' });
      } catch {
        // Claims may not be settable - role will be determined from Firestore profile
      }

      // Force token refresh to pick up the new claims (if they were set)
      await page.evaluate(async () => {
        // @ts-ignore - exposed by firebase.ts for testing
        const firebaseAuth = window.__FIREBASE_AUTH__;
        if (firebaseAuth && firebaseAuth.currentUser) {
          try {
            await firebaseAuth.currentUser.getIdToken(true);
          } catch {
            // Ignore refresh errors
          }
        }
      });
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

    // Navigate to courses page to see the course list
    await page.goto(`${BASE_URL}/teacher/courses`);
    await page.waitForLoadState('domcontentloaded');

    // Click "Manage" on the first course (use button selector to avoid matching heading text)
    const manageButton = page.locator('button:has-text("Manage")').first();
    await manageButton.waitFor({ timeout: 10000 });
    await manageButton.click();
    await page.waitForURL('**/teacher/courses/**', { timeout: 10000 });

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
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

    // Cleanup local file
    fs.unlinkSync(testFilePath);
  });

  test('Teacher can delete a file through the UI', async ({ page }) => {
    test.setTimeout(90000);

    const uid = await signInWithEmulator(page);

    // Verify sign-in succeeded by checking we're not on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || !uid || uid === 'test-teacher-uid') {
      throw new Error(`Sign-in failed. URL: ${currentUrl}, UID: ${uid}`);
    }

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);

    // Verify we made it to a teacher page
    const urlAfterOnboarding = page.url();
    if (!urlAfterOnboarding.includes('/teacher')) {
      throw new Error(`Failed to reach teacher page. URL: ${urlAfterOnboarding}`);
    }

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');

    // Click on Course Materials tab
    const materialsTab = page.locator('[role="tab"]:has-text("Materials"), button:has-text("Course Materials")');
    if (await materialsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await materialsTab.click();
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

    // Track console errors for permission issues
    let hasPermissionError = false;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('unauthorized') || text.includes('permission') || text.includes('403')) {
          hasPermissionError = true;
        }
      }
    });

    // Click upload
    await uploadButton.click();

    // Wait for upload to complete by checking for the file in the materials list
    const fileTitle = testFileName.replace('.txt', '');

    // The material should appear as a span with the EXACT title (without extension)
    // Use exact text match to avoid matching old files from previous test runs
    const materialTitle = page.locator(`span.font-medium`).filter({ hasText: new RegExp(`^${fileTitle}$`) }).first();

    try {
      await materialTitle.waitFor({ timeout: 30000 });
    } catch (e) {
      if (hasPermissionError) {
        throw new Error('Upload failed due to storage permissions - user custom claims not set. Ensure firebase.ts uses demo-project in development mode.');
      }
      throw e;
    }

    // Find the delete button in the same row as the title
    // The material row has classes "flex items-center gap-4 p-2 border rounded-lg"
    const materialRow = page.locator(`div.flex.items-center.gap-4.p-2.border.rounded-lg`).filter({ has: materialTitle });

    // The delete button should be the button inside the row (there's only one button per material row)
    const deleteButton = materialRow.locator('button');
    await deleteButton.waitFor({ timeout: 5000 });

    // Click delete
    await deleteButton.click();

    // Wait for material to disappear (indicating delete completed)
    await expect(materialTitle).not.toBeVisible({ timeout: 20000 });

    fs.unlinkSync(testFilePath);
  });

  test('Upload button is disabled without file selected', async ({ page }) => {
    test.setTimeout(60000);

    await signInWithEmulator(page);

    // Complete onboarding if needed and ensure we're on teacher dashboard
    await completeOnboarding(page);

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');

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

    // Navigate directly to a mock course management page (cs101)
    await page.goto(`${BASE_URL}/teacher/courses/cs101`);
    await page.waitForLoadState('domcontentloaded');

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
