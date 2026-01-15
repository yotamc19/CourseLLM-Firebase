# File Upload Implementation Details

This document outlines the technical implementation of the file upload feature for course materials.

## Client-Side Implementation (`src/app/teacher/courses/[courseId]/_components/course-management-client.tsx`)

The `CourseManagementClient` component handles the user interface and interaction for uploading and managing course materials.

### `handleUpload` Function Workflow

1.  **File Selection and Validation**:
    *   `handleFileChange`: Captures the selected file from the input.
    *   `createMaterialRecord` (server action) performs further validation on file type and size.
2.  **Duplicate File Handling (Overwrite Logic)**:
    *   Before initiating the upload, the system checks if a material with the same `storagePath` 
    *   already exists in the current `course.materials` state, and if so:
        *   Remove the old file from Firebase Storage.
        *   Delete the corresponding record from Data Connect.
3.  **Data Connect Record Creation**:
    *   `createMaterialRecord` (a server action from `../actions.ts`) is called FIRST. 
    *   This action creates a `SourceDocument` record in Data Connect with an initial `status` of `UPLOADING`.
    *   This is crucial to prevent race conditions with the Cloud Function trigger which updates the `SourceDocument` status to `UPLOADED`.
4.  **Firebase Storage Upload**:
    *   If the Data Connect record is successfully created, the `selectedFile` is uploaded to Firebase Storage.

### Document Status Polling

*   A `useEffect` hook implements a polling mechanism that calls `getCourseDocuments` (a server action) every 5 seconds.
*   This continuously fetches the latest document statuses from Data Connect.
*   The local `course.materials` state is updated if any material's status has changed (e.g., from `UPLOADING` to `UPLOADED` by the Cloud Function). This ensures the UI reflects real-time processing progress.

## Server-Side Implementation (`functions/src/index.ts`)

The Firebase Cloud Function `onFileUpload` plays a critical role in post-upload processing and status updates.

### `onFileUpload` Function Workflow

1.  **Trigger Configuration**:
    *   Triggered by `onObjectFinalized` (file uploading) event in Firebase Storage.
    *   Configured to listen to the bucket: `"cs-chatbots.firebasestorage.app"`, matching the frontend's upload target.
    *   It should match the `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`.
3.  **Data Connect Initialization**:
    *   `getDataConnect(connectorConfig)`: Initializes the Data Connect client. This is now done inside the function handler to prevent blocking during function deployment/startup. The `connectorConfig` is imported directly from `@dataconnect/admin-generated` for robustness.
4.  **Path Parsing and Filtering**:
    *   `parseStoragePath(filePath)` (helper function): Extracts `courseId`, `fileName`, and `fileExtension` from the `filePath`.
    *   If the `filePath` does not match the expected `courses/{courseId}/materials/{fileName}.{ext}` pattern, the function logs and exits, ignoring irrelevant file uploads.
5.  **Update Document Status in Data Connect**:
    *   `updateDocumentStatusToUploaded(dataConnect, filePath)` (helper function):
        *   Queries Data Connect for the `SourceDocument` using its `storagePath`.
        *   If found, updates the `status` field of the `SourceDocument` to `UPLOADED`. This is critical for marking the metadata record as having a successfully stored file.
        *   Logs any errors during this Data Connect operation.
6.  **External Conversion Service Integration**:
    *   Constructs a `gcsPath` (Google Cloud Storage path) for the uploaded file.
    *   Sends a POST request to `${FILE_CONVERSION_SERVICE_BASE_URL}/convert` with the `source_path`. This is where the file content is sent for external processing (e.g., PDF to Markdown conversion).
    *   Logs the response from the conversion service.

### `onFileDeleted` Function Workflow

*   Triggered when a file is deleted from Firebase Storage.
*   **Path Validation**: Uses `parseStoragePath` to ensure it's a course material file.
*   **MD File Cleanup**: If the deleted file is not an `.md` file itself, it attempts to find and delete a corresponding `.md` file (e.g., `document.pdf` deleted -> `document.md` deleted). This is to clean up processed content.

## Data Model Updates

*   `src/lib/types.ts`: The `Material` type now includes a `status` field (`'UPLOADING' | 'UPLOADED' | ...`).
*   `dataconnect/example/queries.gql`: Added `GetSourceDocumentByStoragePath` query to allow fetching a `SourceDocument` by its unique `storagePath`.

## Page Load Integration (`src/app/teacher/courses/[courseId]/page.tsx`)

*   The server component now fetches real `SourceDocument` data from Data Connect using `getCourseDocuments`.
*   This real data is merged with mock data to ensure uploaded files persist and are displayed after page refreshes. Each `SourceDocument` is mapped to the `Material` type for display.

