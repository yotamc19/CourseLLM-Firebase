# Getting Started with CourseLLM-Firebase Development

This document guides you through setting up and running the CourseLLM-Firebase application locally.

## Prerequisites

*   Node.js (LTS version recommended)
*   npm (or pnpm, as this project uses pnpm workspaces)
*   Firebase CLI (install with `npm install -g firebase-tools`)
*   Java Development Kit (JDK) version 11 or higher (required for Firebase Emulators)

## 1. Clone the Repository

If you haven't already, clone the CourseLLM-Firebase repository:

```bash
git clone [repository-url]
cd CourseLLM-Firebase
```

## 2. Install Dependencies

This project uses `pnpm` workspaces. Ensure `pnpm` is installed globally (`npm install -g pnpm`).

```bash
# Install dependencies for the root project and all workspaces
pnpm install
```

This will install dependencies for the main Next.js app and the `functions` Firebase project. It will also automatically generate the Data Connect SDKs.

## 3. Firebase Project Setup

### a. Link to your Firebase Project

Make sure your local environment is linked to your Firebase project. Replace `your-project-id` with your actual Firebase Project ID.

```bash
firebase use --add your-project-id
```

### b. Configure Environment Variables

Create a `.env.local` file in the root directory by copying `.env.local.example`.

```bash
cp .env.local.example .env.local
```

Then, open `.env.local` and fill in your Firebase web app configuration. These details can be found in your Firebase Console under **Project Settings > General > Your apps**.

**Crucially, ensure the `FIREBASE_PROJECT_ID` in `.env.local` matches your Firebase Project ID.**
For local development with emulators, also ensure the emulator host variables are correctly set (they should be by default in `.env.local.example`).


### c. Firebase Admin SDK Credentials (for server-side/functions)

For local testing and functions that use the Firebase Admin SDK, you need service account credentials.

1.  Go to your Firebase Console: **Project Settings > Service accounts**.
2.  Click "Generate new private key" and download the JSON file.
3.  Place this JSON file in a secure location (e.g., `./secrets/firebase-admin.json` - **DO NOT COMMIT THIS FILE TO GIT**).
4.  Update your `.env.local` with the path to this file:

    ```ini
    FIREBASE_SERVICE_ACCOUNT_JSON=./secrets/firebase-admin.json
    ```

    Alternatively, you can paste the JSON content directly as an environment variable (encoded) if you prefer.

## 4. Start Firebase Emulators

The project relies heavily on Firebase Emulators for local development.

```bash
firebase emulators:start
```

This command will start emulators for Authentication, Firestore, Storage, Functions, and Data Connect. Ensure all necessary emulators start without errors. You can access the Emulator UI at `http://localhost:4000`.

## 5. Run the Next.js Frontend

In a separate terminal, start the Next.js development server:

```bash
pnpm run dev
# or pnpm dev
```

The frontend application should now be accessible at `http://localhost:9002`.

## 6. Access the Application

*   **Teacher Dashboard:** `http://localhost:9002/teacher`
*   **Student Dashboard:** `http://localhost:9002/student`

You can use Google Sign-In or test users created via the Firebase Authentication Emulator to log in.

## Troubleshooting

*   **Emulator Issues:** Check the terminal where `firebase emulators:start` is running for error messages.
*   **"Failed to load function definition" / Timeout:** Ensure `getDataConnect` initialization is not blocking at the top level of your Cloud Functions. It should be inside the function handler. Also, verify `firebase-admin` and `@dataconnect/admin-generated` dependencies are correctly installed and compatible.
*   **File Uploads / Functions Not Triggering:** Double-check that the `bucket` name in your Cloud Function triggers (e.g., `onObjectFinalized({ bucket: "your-bucket-name" })`) matches your `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` from `.env.local`.
*   **Missing Dependencies:** If you encounter module not found errors, try running `pnpm install` again.
