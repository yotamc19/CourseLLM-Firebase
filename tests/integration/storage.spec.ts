/**
 * Firebase Storage Authorization Tests
 *
 * Tests role-based access control for Firebase Storage.
 * Verifies that only teachers and admins can upload files.
 *
 * To run with emulator (default for tests):
 *   firebase emulators:start --only storage,auth
 *   npm run test:storage
 */

import { test, expect } from '@playwright/test';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithCustomToken, signOut } from 'firebase/auth';
import { getStorage, connectStorageEmulator, ref, uploadBytes, deleteObject, getBytes } from 'firebase/storage';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Read the project ID from .firebaserc to match what the emulator uses
function getProjectIdFromFirebaserc(): string {
  try {
    const firebasercPath = path.resolve(__dirname, '../../.firebaserc');
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, 'utf-8'));
    return firebaserc.projects?.default || 'demo-project';
  } catch {
    return process.env.FIREBASE_PROJECT_ID || 'demo-project';
  }
}

const projectId = getProjectIdFromFirebaserc();

const firebaseConfig = {
  apiKey: "test-api-key",
  projectId: projectId,
  appId: "test-app-id",
  storageBucket: `${projectId}.firebasestorage.app`,
};

test.describe('Firebase Storage Authorization', () => {
  let app: any;
  let storage: any;
  let auth: any;

  test.beforeAll(async () => {
    // Set emulator hosts for Admin SDK
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

    // Initialize Client App
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    storage = getStorage(app);
    auth = getAuth(app);

    // Connect Client SDK to emulators
    try {
      connectStorageEmulator(storage, '127.0.0.1', 9199);
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    } catch (e: any) {
      if (!e.message?.includes('already been initialized')) {
        console.warn('Emulator connection warning:', e.message);
      }
    }

    // Initialize Admin SDK (if not already initialized)
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
    }

    console.log('Storage RBAC tests initialized.');
  });

  /**
   * Helper to sign in as a user with a specific role
   */
  async function signInAsRole(role: string) {
    const uid = `test-${role}-${Date.now()}`;
    // Create custom token with claims using Admin SDK
    const token = await admin.auth().createCustomToken(uid, { role });
    // Sign in Client SDK
    await signInWithCustomToken(auth, token);
    return uid;
  }

  async function createTestFileBlob(content: string = 'Test content') {
    const bytes = new TextEncoder().encode(content);
    return new Blob([bytes], { type: 'text/plain' });
  }

  test('Teacher should be able to upload, update, and delete files', async () => {
    await signInAsRole('teacher');

    const courseId = `course-teacher-${Date.now()}`;
    const fileName = 'syllabus.txt';
    const storageRef = ref(storage, `courses/${courseId}/materials/${fileName}`);
    let blob = await createTestFileBlob();

    // Upload
    let uploadResult = await uploadBytes(storageRef, blob);
    expect(uploadResult).toBeDefined();
    expect(uploadResult.metadata.name).toBe(fileName);

    // Update (uploading a new version)
    blob = await createTestFileBlob('Updated content');
    uploadResult = await uploadBytes(storageRef, blob);
    expect(uploadResult).toBeDefined();

    // Delete
    await deleteObject(storageRef);
    console.log(`Deleted file: ${storageRef}`);
    // Verify deletion (attempt to upload again, it should be successful as previous one is deleted)
    await expect(getBytes(storageRef)).rejects.toThrow(/not-found/);
  });

  test('Admin should be able to upload, update, and delete files', async () => {
    await signInAsRole('admin');

    const courseId = `course-admin-${Date.now()}`;
    const fileName = 'admin-doc.txt';
    const storageRef = ref(storage, `courses/${courseId}/materials/${fileName}`);
    let blob = await createTestFileBlob();

    // Upload
    let uploadResult = await uploadBytes(storageRef, blob);
    expect(uploadResult).toBeDefined();

    // Update
    blob = await createTestFileBlob('Admin updated content');
    uploadResult = await uploadBytes(storageRef, blob);
    expect(uploadResult).toBeDefined();

    // Delete
    await deleteObject(storageRef);
    // Verify deletion
    await expect(getBytes(storageRef)).rejects.toThrow(/not-found/);
  });

  test('Student should NOT be able to upload or delete files', async () => {
    await signInAsRole('student');

    const courseId = `course-student-${Date.now()}`;
    const fileName = 'homework.txt';
    const storageRef = ref(storage, `courses/${courseId}/materials/${fileName}`);
    const blob = await createTestFileBlob();

    // 1. Verify Upload Fail
    try {
      await uploadBytes(storageRef, blob);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Firebase errors may have code in different places
      const errorCode = error.code || error.message || String(error);
      expect(errorCode).toMatch(/unauthorized|permission|denied/i);
    }

    // 2. Verify Delete Fail
    // First, upload a file as Admin so we have something to try deleting
    await signInAsRole('admin');
    const adminFileRef = ref(storage, `courses/${courseId}/materials/admin-file.txt`);
    await uploadBytes(adminFileRef, blob);

    // Switch back to Student
    await signInAsRole('student');
    try {
      await deleteObject(adminFileRef);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Firebase errors may have code in different places
      const errorCode = error.code || error.message || String(error);
      expect(errorCode).toMatch(/unauthorized|permission|denied/i);
    }

    // Cleanup: Delete as Admin
    await signInAsRole('admin');
    await deleteObject(adminFileRef);
  });

  test('Unauthenticated user should NOT be able to upload or delete files', async () => {
    await signOut(auth);

    const courseId = `course-anon-${Date.now()}`;
    const fileName = 'hack.txt';
    const storageRef = ref(storage, `courses/${courseId}/materials/${fileName}`);
    const blob = await createTestFileBlob();

    // 1. Verify Upload Fail
    try {
      await uploadBytes(storageRef, blob);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toContain('unauthorized');
    }

    // 2. Verify Delete Fail
    // First, upload a file as Admin
    await signInAsRole('admin');
    const adminFileRef = ref(storage, `courses/${courseId}/materials/admin-file-anon.txt`);
    await uploadBytes(adminFileRef, blob);

    // Sign out again
    await signOut(auth);
    try {
      await deleteObject(adminFileRef);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toContain('unauthorized');
    }

    // Cleanup: Delete as Admin
    await signInAsRole('admin');
    await deleteObject(adminFileRef);
  });
});