# File Upload Product Requirements Document (PRD)

## 1. Introduction

This document outlines the requirements for the CourseLLM-Firebase platform's File Upload feature.

## 2. Goals

*   To empower teachers to easily upload various types of course materials (documents, presentations) to their courses.
*   To ensure that uploaded materials are stored persistently and are accessible for both review by teachers and processing by AI systems.
*   To provide clear feedback to teachers on the status of their uploaded files.
*   To lay the groundwork for AI-powered features (Socratic Chat, Personalized Assessments) to leverage the content of uploaded materials.

## 3. User Stories

### Teacher
*   As a teacher, I want to upload PDF, PPT, DOC, and MD files as course materials so the system can process them.
*   As a teacher, I want to see a list of all materials uploaded for a specific course.
*   As a teacher, I want to see the processing status of my uploaded files (e.g., UPLOADING, UPLOADED, ANALYZED) so I know when they are ready.
*   As a teacher, if I upload a file with the same name as an existing material, I want the new file to replace the old one, ensuring I always have the latest version.
*   As a teacher, I want to be able to delete uploaded materials and have them removed from both storage and the course listing.

## 4. Functional Requirements

*   **FU.1 - File Type Support:** The system MUST support uploading files of types PDF, PPT (and PPTX), DOC (and DOCX), MD (Markdown), and TXT.
*   **FU.2 - File Size Limit:** The system MUST enforce a maximum file size limit of 10MB per file.
*   **FU.3 - Material Persistence:** Uploaded material metadata MUST be stored in the Data Connect database and persisted across user sessions.
*   **FU.4 - File Storage:** The actual uploaded files MUST be stored in Firebase Storage.
*   **FU.5 - Status Tracking:** The system MUST track and display the processing status of each uploaded material (e.g., UPLOADING, UPLOADED, CONVERTING, ANALYZING, ANALYZED, ERROR).
*   **FU.6 - Duplicate Handling:** If a teacher uploads a file with a `storagePath` (course ID + filename) identical to an existing material, the new upload MUST overwrite the existing material (deleting the old file and its record, then creating a new record for the new upload).
*   **FU.7 - Deletion:** Teachers MUST be able to delete materials, which results in the removal of both the Data Connect record and the corresponding file(s) from Firebase Storage.
*   **FU.8 - Conversion Integration:** The system MUST integrate with an external service (via a Cloud Function trigger) to send uploaded files for content conversion/processing.
*   **FU.9 - UI Integration:** Uploaded materials MUST be visible in the teacher's course management interface and persist after page refreshes.

## 5. Non-Functional Requirements

*   **NFR.1 - Performance:** File uploads and status updates should be responsive within reasonable network conditions.
*   **NFR.2 - Security:** File uploads and deletions MUST adhere to Firebase security rules for storage and Data Connect.
*   **NFR.3 - Scalability:** The upload and processing pipeline should be scalable to handle multiple concurrent uploads.
*   **NFR.4 - User Experience:** The upload process should provide clear visual feedback (loading indicators, toasts).

## 6. Security Considerations

**IMPORTANT NOTICE- Data Connect Access Control**: While Firebase Storage rules (not covered in this document) secure the files, the current Data Connect operations (creating, updating, deleting `SourceDocument` records) do not explicitly integrate with Firebase Authentication or custom security rules beyond basic `@auth(level: PUBLIC)` in `dataconnect/example/mutations.gql`. This means any authenticated user could potentially manipulate `SourceDocument` records.

## 6. Open Questions / Future Work
*   **Future Work**: Implement access control for Data Connect operations based on user roles (e.g., only teachers for their courses).
*   **Bulk Upload:** Support for uploading multiple files simultaneously.
*   **Version Control:** Ability to keep multiple versions of a material.
*   **File Previews:** Displaying previews of uploaded documents in the UI.
