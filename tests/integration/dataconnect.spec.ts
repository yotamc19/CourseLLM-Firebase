/**
 * Data Connect Integration Tests
 * 
 * Tests all CRUD operations for User, Course, and SourceDocument.
 * 
 * NOTE: After updating GraphQL files, regenerate Data Connect types:
 *   firebase dataconnect:sdk:generate
 * Or restart the emulator to auto-regenerate.
 */

import { test, expect } from '@playwright/test';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { 
  connectorConfig, 
  // User operations
  insertUser,
  updateUser,
  deleteUser,
  listUsers,
  getUser,
  // Course operations
  insertCourse,
  updateCourse,
  upsertCourse,
  deleteCourse,
  listCourses,
  getCourse,
  // SourceDocument operations
  createSourceDocument,
  updateSourceDocument,
  updateDocumentStatus,
  deleteSourceDocument,
  listSourceDocuments,
  listCourseDocuments,
  getSourceDocument,
  DocumentStatus 
} from '@dataconnect/generated';

const firebaseConfig = {
  apiKey: "test-api-key",
  projectId: "coursellm-firebase", 
  appId: "test-app-id",
};

test.describe('Data Connect Integration', () => {
  let app: any;
  let dc: any;

  test.beforeAll(async () => {
    // Check if app already initialized (hot reload or parallel tests)
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    dc = getDataConnect(connectorConfig);
    // Connect to emulator - ensure your emulator is running on this port
    // Start with: firebase emulators:start --only dataconnect
    connectDataConnectEmulator(dc, '127.0.0.1', 9399);
  });

  // ========== USER TESTS ==========
  test('should insert, get, update, and delete a user with UUID', async () => {
    const username = `testuser-${Date.now()}`;

    // Insert - ID is auto-generated as UUID
    const insertResult = await insertUser(dc, { username });
    expect(insertResult.data.user_insert).toBeDefined();
    const userId = (insertResult.data.user_insert as any).id;
    expect(userId).toBeTruthy();

    // Get by ID
    const getUserResult = await getUser(dc, { id: userId });
    expect(getUserResult.data.user).toBeDefined();
    expect(getUserResult.data.user?.id).toBe(userId);
    expect(getUserResult.data.user?.username).toBe(username);

    // List all users
    const listResult = await listUsers(dc);
    expect(listResult.data.users).toBeDefined();
    const foundUser = listResult.data.users.find((u: any) => u.id === userId);
    expect(foundUser).toBeDefined();
    expect(foundUser?.username).toBe(username);

    // Update
    const newUsername = `updated-${Date.now()}`;
    const updateResult = await updateUser(dc, { id: userId, username: newUsername });
    expect(updateResult.data.user_update).toBeDefined();

    // Verify update
    const updatedUserResult = await getUser(dc, { id: userId });
    expect(updatedUserResult.data.user?.username).toBe(newUsername);

    // Delete
    const deleteResult = await deleteUser(dc, { id: userId });
    expect(deleteResult.data.user_delete).toBeDefined();

    // Verify deletion
    const deletedUserResult = await getUser(dc, { id: userId });
    expect(deletedUserResult.data.user).toBeNull();
  });

  // ========== COURSE TESTS ==========
  test('should insert, get, update, upsert, and delete a course', async () => {
    const courseId = `course-${Date.now()}`;
    const title = 'Test Course';
    const description = 'A test course description';

    // Insert
    const insertResult = await insertCourse(dc, {
      id: courseId,
      title,
      description
    });
    expect(insertResult.data.course_insert).toBeDefined();

    // Get by ID
    const getResult = await getCourse(dc, { id: courseId });
    expect(getResult.data.course).toBeDefined();
    expect(getResult.data.course?.id).toBe(courseId);
    expect(getResult.data.course?.title).toBe(title);
    expect(getResult.data.course?.description).toBe(description);

    // List all courses
    const listResult = await listCourses(dc);
    expect(listResult.data.courses).toBeDefined();
    const foundCourse = listResult.data.courses.find((c: any) => c.id === courseId);
    expect(foundCourse).toBeDefined();
    expect(foundCourse?.title).toBe(title);

    // Update
    const updatedTitle = 'Updated Course Title';
    const updatedDescription = 'Updated description';
    const updateResult = await updateCourse(dc, {
      id: courseId,
      title: updatedTitle,
      description: updatedDescription
    });
    expect(updateResult.data.course_update).toBeDefined();

    // Verify update
    const updatedCourseResult = await getCourse(dc, { id: courseId });
    expect(updatedCourseResult.data.course?.title).toBe(updatedTitle);
    expect(updatedCourseResult.data.course?.description).toBe(updatedDescription);

    // Upsert (should update existing)
    const upsertTitle = 'Upserted Course';
    const upsertResult = await upsertCourse(dc, {
      id: courseId,
      title: upsertTitle,
      description: 'Upserted description'
    });
    expect(upsertResult.data.course_upsert).toBeDefined();

    // Verify upsert
    const upsertedCourseResult = await getCourse(dc, { id: courseId });
    expect(upsertedCourseResult.data.course?.title).toBe(upsertTitle);

    // Delete
    const deleteResult = await deleteCourse(dc, { id: courseId });
    expect(deleteResult.data.course_delete).toBeDefined();

    // Verify deletion
    const deletedCourseResult = await getCourse(dc, { id: courseId });
    expect(deletedCourseResult.data.course).toBeNull();
  });

  // ========== SOURCE DOCUMENT TESTS ==========
  test('should insert, get, update, and delete a source document', async () => {
    // Create parent course first
    const courseId = `course-doc-${Date.now()}`;
    const courseResult = await insertCourse(dc, {
      id: courseId,
      title: 'Doc Course',
      description: 'For docs'
    });
    expect(courseResult.data.course_insert).toBeDefined();

    const fileName = 'test-syllabus.pdf';
    const mimeType = 'application/pdf';
    const size = 1024;
    const storagePath = `courses/${courseId}/${fileName}`;

    // Insert - ID is auto-generated as UUID
    const insertResult = await createSourceDocument(dc, {
      courseId,
      fileName,
      mimeType,
      size,
      storagePath
    });
    expect(insertResult.data.sourceDocument_insert).toBeDefined();
    const docId = (insertResult.data.sourceDocument_insert as any).id;
    expect(docId).toBeTruthy();

    // Get by ID
    const getResult = await getSourceDocument(dc, { id: docId });
    expect(getResult.data.sourceDocument).toBeDefined();
    expect(getResult.data.sourceDocument?.id).toBe(docId);
    expect(getResult.data.sourceDocument?.fileName).toBe(fileName);
    expect(getResult.data.sourceDocument?.mimeType).toBe(mimeType);
    expect(getResult.data.sourceDocument?.size).toBe(size);
    expect(getResult.data.sourceDocument?.status).toBe(DocumentStatus.UPLOADING);
    expect(getResult.data.sourceDocument?.course?.id).toBe(courseId);

    // List all documents
    const listAllResult = await listSourceDocuments(dc);
    expect(listAllResult.data.sourceDocuments).toBeDefined();
    const foundDoc = listAllResult.data.sourceDocuments.find((d: any) => d.id === docId);
    expect(foundDoc).toBeDefined();
    expect(foundDoc?.fileName).toBe(fileName);

    // List documents for course
    const listCourseDocsResult = await listCourseDocuments(dc, { courseId });
    expect(listCourseDocsResult.data.sourceDocuments).toBeDefined();
    const courseDoc = listCourseDocsResult.data.sourceDocuments.find((d: any) => d.id === docId);
    expect(courseDoc).toBeDefined();
    expect(courseDoc?.fileName).toBe(fileName);

    // Update status only
    const updateStatusResult = await updateDocumentStatus(dc, {
      id: docId,
      status: DocumentStatus.UPLOADED,
      storagePath: storagePath
    });
    expect(updateStatusResult.data.sourceDocument_update).toBeDefined();

    // Verify status update
    const statusUpdatedResult = await getSourceDocument(dc, { id: docId });
    expect(statusUpdatedResult.data.sourceDocument?.status).toBe(DocumentStatus.UPLOADED);

    // Full update
    const newFileName = 'updated-document.pdf';
    const newMimeType = 'application/pdf';
    const newSize = 2048;
    const newStatus = DocumentStatus.CONVERTED;
    const updateResult = await updateSourceDocument(dc, {
      id: docId,
      fileName: newFileName,
      mimeType: newMimeType,
      size: newSize,
      storagePath: storagePath,
      status: newStatus
    });
    expect(updateResult.data.sourceDocument_update).toBeDefined();

    // Verify full update
    const updatedResult = await getSourceDocument(dc, { id: docId });
    expect(updatedResult.data.sourceDocument?.fileName).toBe(newFileName);
    expect(updatedResult.data.sourceDocument?.mimeType).toBe(newMimeType);
    expect(updatedResult.data.sourceDocument?.size).toBe(newSize);
    expect(updatedResult.data.sourceDocument?.status).toBe(newStatus);

    // Delete
    const deleteResult = await deleteSourceDocument(dc, { id: docId });
    expect(deleteResult.data.sourceDocument_delete).toBeDefined();

    // Verify deletion
    const deletedResult = await getSourceDocument(dc, { id: docId });
    expect(deletedResult.data.sourceDocument).toBeNull();
  });

  // ========== INTEGRATION TEST ==========
  test('should create course with documents and verify relationships', async () => {
    const courseId = `course-integration-${Date.now()}`;
    
    // Create course
    const courseResult = await insertCourse(dc, {
      id: courseId,
      title: 'Integration Test Course',
      description: 'Testing relationships'
    });
    expect(courseResult.data.course_insert).toBeDefined();

    // Create multiple documents
    const doc1Result = await createSourceDocument(dc, {
      courseId,
      fileName: 'doc1.pdf',
      mimeType: 'application/pdf',
      size: 1000,
      storagePath: `courses/${courseId}/doc1.pdf`
    });
    const doc1Id = (doc1Result.data.sourceDocument_insert as any).id;

    const doc2Result = await createSourceDocument(dc, {
      courseId,
      fileName: 'doc2.pdf',
      mimeType: 'application/pdf',
      size: 2000,
      storagePath: `courses/${courseId}/doc2.pdf`
    });
    const doc2Id = (doc2Result.data.sourceDocument_insert as any).id;

    // List documents for course
    const listResult = await listCourseDocuments(dc, { courseId });
    expect(listResult.data.sourceDocuments.length).toBeGreaterThanOrEqual(2);
    const docIds = listResult.data.sourceDocuments.map((d: any) => d.id);
    expect(docIds).toContain(doc1Id);
    expect(docIds).toContain(doc2Id);

    // Verify course relationship in document
    const doc1 = await getSourceDocument(dc, { id: doc1Id });
    expect(doc1.data.sourceDocument?.course?.id).toBe(courseId);
    expect(doc1.data.sourceDocument?.course?.title).toBe('Integration Test Course');

    // Cleanup
    await deleteSourceDocument(dc, { id: doc1Id });
    await deleteSourceDocument(dc, { id: doc2Id });
    await deleteCourse(dc, { id: courseId });
  });
});
