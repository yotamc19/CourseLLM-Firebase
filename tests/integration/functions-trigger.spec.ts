// IMPORTANT: Set emulator env vars BEFORE importing firebase-admin
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

import { test, expect } from '@playwright/test';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithCustomToken } from 'firebase/auth';
import { getStorage, connectStorageEmulator, ref, uploadBytes, deleteObject } from 'firebase/storage';
import * as admin from 'firebase-admin';
import * as http from 'http';
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

// These tests require Firebase Functions emulator to be running with functions deployed
// Run: cd functions && npm run build && cd .. && firebase emulators:start

// Helper to check if the Functions emulator has the required functions loaded
async function areFunctionsLoaded(): Promise<{ running: boolean; hasOnFileUpload: boolean; hasOnFileDeleted: boolean }> {
  try {
    // Query the Functions emulator's backend info endpoint
    const response = await fetch(`http://127.0.0.1:4400/emulators`, { method: 'GET' });
    if (!response.ok) {
      return { running: false, hasOnFileUpload: false, hasOnFileDeleted: false };
    }

    // Check if functions emulator is in the list
    const data = await response.json();
    const functionsEmulator = data?.functions;
    if (!functionsEmulator) {
      return { running: false, hasOnFileUpload: false, hasOnFileDeleted: false };
    }

    // Query the functions list from the emulator hub
    // The functions emulator exposes function info at its port
    try {
      const functionsResponse = await fetch(`http://127.0.0.1:5001/demo-project/us-central1`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const text = await functionsResponse.text();
      // Check if our functions are mentioned in any response
      const hasOnFileUpload = text.includes('onFileUpload') || text.includes('onObjectFinalized');
      const hasOnFileDeleted = text.includes('onFileDeleted') || text.includes('onObjectDeleted');

      // If we got any response from functions port, emulator is running
      // But we need to check if functions are actually built
      const libExists = fs.existsSync(path.resolve(__dirname, '../../functions/lib/index.js'));

      return {
        running: true,
        hasOnFileUpload: libExists,
        hasOnFileDeleted: libExists
      };
    } catch {
      // Functions emulator port didn't respond properly
      const libExists = fs.existsSync(path.resolve(__dirname, '../../functions/lib/index.js'));
      return { running: true, hasOnFileUpload: libExists, hasOnFileDeleted: libExists };
    }
  } catch {
    return { running: false, hasOnFileUpload: false, hasOnFileDeleted: false };
  }
}

test.describe('Firebase Functions Triggers', () => {
  let app: any;
  let storage: any;
  let auth: any;
  let server: http.Server;

  test.beforeAll(async () => {
    // Initialize Client App (emulator env vars already set at module level)
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

    // Initialize Admin SDK
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
    }
  });

  test.afterEach(async () => {
      if (server) {
          server.close();
      }
  });

  async function signInAsTeacher() {
    const uid = `test-teacher-${Date.now()}`;
    const token = await admin.auth().createCustomToken(uid, { role: 'teacher' });
    await signInWithCustomToken(auth, token);
    return uid;
  }

  async function createTestFileBlob(content: string = 'Test content') {
    const bytes = new TextEncoder().encode(content);
    return new Blob([bytes], { type: 'text/plain' });
  }

  test('onFileUpload should send POST request to conversion service', async () => {
    test.setTimeout(30000); // Increase timeout for function trigger

    // Check if Functions emulator is running AND functions are built
    const status = await areFunctionsLoaded();
    if (!status.running) {
      throw new Error('Functions emulator not running. Run: firebase emulators:start');
    }
    if (!status.hasOnFileUpload) {
      throw new Error('Functions not built. Run: cd functions && npm run build');
    }

    // Generate unique courseId first so we can filter webhooks by it
    const courseId = `course-func-${Date.now()}`;
    const fileName = 'lecture.pdf';

    // 1. Start Mock Server that filters for OUR specific file
    let requestReceivedPromiseResolve: (value: any) => void;
    const requestReceivedPromise = new Promise<any>((resolve) => {
        requestReceivedPromiseResolve = resolve;
    });

    server = http.createServer((req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (req.method === 'POST' && req.url === '/convert') {
                const parsedBody = JSON.parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: 'job-mock-1', status: 'queued' }));

                // Only resolve if this is OUR test's file (filter by courseId)
                if (parsedBody.source_path && parsedBody.source_path.includes(courseId)) {
                    requestReceivedPromiseResolve(parsedBody);
                }
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    });

    await new Promise<void>((resolve) => server.listen(8000, resolve));

    // 2. Upload File
    await signInAsTeacher();
    // Path must match regex: ^courses\/([^\/]+)\/materials\/([^\/]+)\.([a-zA-Z0-9]+)$
    const storageRef = ref(storage, `courses/${courseId}/materials/${fileName}`);
    const blob = await createTestFileBlob('Mock PDF Content');

    await uploadBytes(storageRef, blob);

    try {
        // 3. Wait for Trigger
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for webhook')), 15000));

        const requestBody = await Promise.race([requestReceivedPromise, timeoutPromise]);

        // 4. Validate
        expect(requestBody).toHaveProperty('source_path');
        expect(requestBody.source_path).toContain(`courses/${courseId}/materials/${fileName}`);
        // Check for gs:// prefix and bucket
        expect(requestBody.source_path).toMatch(/^gs:\/\/[^\/]+\/courses\/.*$/);
    } finally {
        // Cleanup: Delete the uploaded file
        await deleteObject(storageRef).catch(() => {});
    }
  });

  test('onFileDeleted should delete corresponding .md file', async () => {
    test.setTimeout(15000);

    // Check if Functions emulator is running AND functions are built
    const status = await areFunctionsLoaded();
    if (!status.running) {
      throw new Error('Functions emulator not running. Run: firebase emulators:start');
    }
    if (!status.hasOnFileDeleted) {
      throw new Error('Functions not built. Run: cd functions && npm run build');
    }

    await signInAsTeacher();
    const courseId = `course-del-${Date.now()}`;
    const baseName = 'document';
    const originalFileName = `${baseName}.pdf`;
    const mdFileName = `${baseName}.md`;
    
    // Paths
    const originalRef = ref(storage, `courses/${courseId}/materials/${originalFileName}`);
    const mdRef = ref(storage, `courses/${courseId}/materials/${mdFileName}`);

    // 1. Upload both files
    await uploadBytes(originalRef, await createTestFileBlob('Original content'));
    await uploadBytes(mdRef, await createTestFileBlob('Markdown content'));

    // Verify both exist (sanity check)
    // We can assume they exist if uploadBytes succeeded, but let's be sure
    // Using admin SDK to check existence quickly without worrying about download permissions logic
    const bucket = admin.storage().bucket(firebaseConfig.storageBucket);
    const originalFile = bucket.file(`courses/${courseId}/materials/${originalFileName}`);
    const mdFile = bucket.file(`courses/${courseId}/materials/${mdFileName}`);

    expect((await originalFile.exists())[0]).toBe(true);
    expect((await mdFile.exists())[0]).toBe(true);

    // 2. Delete the original file
    await deleteObject(originalRef);

    // 3. Wait for the .md file to be deleted (async trigger)
    
    // Poll for deletion
    let deleted = false;
    for (let i = 0; i < 20; i++) { // Try for 10 seconds (20 * 500ms)
        const [exists] = await mdFile.exists();
        if (!exists) {
            deleted = true;
            break;
        }
        await new Promise(r => setTimeout(r, 500));
    }

    expect(deleted).toBe(true);
  });
});
