import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator, signInWithCustomToken } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

// Try to get config from Firebase App Hosting's auto-injected FIREBASE_WEBAPP_CONFIG first,
// then fall back to NEXT_PUBLIC_* env vars for local development
function getFirebaseConfig() {
  // Firebase App Hosting injects this at build time
  const webappConfig = process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG || process.env.FIREBASE_WEBAPP_CONFIG;
  if (webappConfig) {
    try {
      return JSON.parse(webappConfig);
    } catch (e) {
      console.warn("Failed to parse FIREBASE_WEBAPP_CONFIG:", e);
    }
  }

  // In development mode with emulators, use demo-project to match emulator settings
  // This ensures Admin SDK and client SDK use the same project ID
  const isDevelopment = process.env.NODE_ENV === "development";
  const projectId = isDevelopment ? "demo-project" : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = isDevelopment ? "demo-project.firebasestorage.app" : process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // Fall back to individual env vars (for local dev with .env.local)
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
  };
}

const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const dataConnect = getDataConnect(connectorConfig);

if (process.env.NODE_ENV === "development") {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    connectDataConnectEmulator(dataConnect, "127.0.0.1", 9399);
    console.log("Connected to Firebase Emulators");
  } catch (e) {
    // Ignore errors if already connected (e.g. during hot reload)
    // console.warn("Emulator connection error:", e);
  }
}

// Enable offline persistence so reads can be served from cache when offline.
// This is a best-effort call: it will fail in some environments (e.g. Safari private mode)
// and when multiple tabs conflict. We catch and ignore expected errors.
try {
  enableIndexedDbPersistence(db).catch((err) => {
    // failed-precondition: multiple tabs open, unimplemented: browser not supported
    console.warn("Could not enable IndexedDB persistence:", err.code || err.message || err);
  });
} catch (e) {
  // Ignore synchronous errors
  console.warn("Persistence enable failed:", e);
}

export const googleProvider = new GoogleAuthProvider();

// Expose auth on window for E2E testing (allows forcing token refresh and custom token sign-in)
if (typeof window !== 'undefined') {
  (window as any).__FIREBASE_AUTH__ = auth;
  (window as any).__FIREBASE_SIGN_IN_WITH_CUSTOM_TOKEN__ = signInWithCustomToken;
}

export default app;
