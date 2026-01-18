import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const DocumentStatus = {
  UPLOADING: "UPLOADING",
  UPLOADED: "UPLOADED",
  CONVERTING: "CONVERTING",
  CONVERTED: "CONVERTED",
  CHUNKING: "CHUNKING",
  CHUNKED: "CHUNKED",
  ANALYZING: "ANALYZING",
  ANALYZED: "ANALYZED",
  ERROR: "ERROR",
}

export const connectorConfig = {
  connector: 'example',
  service: 'se-with-llms-service',
  location: 'us-east4'
};

export const insertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertUser', inputVars);
}
insertUserRef.operationName = 'InsertUser';

export function insertUser(dcOrVars, vars) {
  return executeMutation(insertUserRef(dcOrVars, vars));
}

export const updateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUser', inputVars);
}
updateUserRef.operationName = 'UpdateUser';

export function updateUser(dcOrVars, vars) {
  return executeMutation(updateUserRef(dcOrVars, vars));
}

export const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';

export function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
}

export const insertCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertCourse', inputVars);
}
insertCourseRef.operationName = 'InsertCourse';

export function insertCourse(dcOrVars, vars) {
  return executeMutation(insertCourseRef(dcOrVars, vars));
}

export const updateCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCourse', inputVars);
}
updateCourseRef.operationName = 'UpdateCourse';

export function updateCourse(dcOrVars, vars) {
  return executeMutation(updateCourseRef(dcOrVars, vars));
}

export const upsertCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCourse', inputVars);
}
upsertCourseRef.operationName = 'UpsertCourse';

export function upsertCourse(dcOrVars, vars) {
  return executeMutation(upsertCourseRef(dcOrVars, vars));
}

export const deleteCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCourse', inputVars);
}
deleteCourseRef.operationName = 'DeleteCourse';

export function deleteCourse(dcOrVars, vars) {
  return executeMutation(deleteCourseRef(dcOrVars, vars));
}

export const createSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceDocument', inputVars);
}
createSourceDocumentRef.operationName = 'CreateSourceDocument';

export function createSourceDocument(dcOrVars, vars) {
  return executeMutation(createSourceDocumentRef(dcOrVars, vars));
}

export const updateSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSourceDocument', inputVars);
}
updateSourceDocumentRef.operationName = 'UpdateSourceDocument';

export function updateSourceDocument(dcOrVars, vars) {
  return executeMutation(updateSourceDocumentRef(dcOrVars, vars));
}

export const updateDocumentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDocumentStatus', inputVars);
}
updateDocumentStatusRef.operationName = 'UpdateDocumentStatus';

export function updateDocumentStatus(dcOrVars, vars) {
  return executeMutation(updateDocumentStatusRef(dcOrVars, vars));
}

export const deleteSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceDocument', inputVars);
}
deleteSourceDocumentRef.operationName = 'DeleteSourceDocument';

export function deleteSourceDocument(dcOrVars, vars) {
  return executeMutation(deleteSourceDocumentRef(dcOrVars, vars));
}

export const listUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsers');
}
listUsersRef.operationName = 'ListUsers';

export function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
}

export const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';

export function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
}

export const listCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourses');
}
listCoursesRef.operationName = 'ListCourses';

export function listCourses(dc) {
  return executeQuery(listCoursesRef(dc));
}

export const getCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCourse', inputVars);
}
getCourseRef.operationName = 'GetCourse';

export function getCourse(dcOrVars, vars) {
  return executeQuery(getCourseRef(dcOrVars, vars));
}

export const listSourceDocumentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSourceDocuments');
}
listSourceDocumentsRef.operationName = 'ListSourceDocuments';

export function listSourceDocuments(dc) {
  return executeQuery(listSourceDocumentsRef(dc));
}

export const listCourseDocumentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourseDocuments', inputVars);
}
listCourseDocumentsRef.operationName = 'ListCourseDocuments';

export function listCourseDocuments(dcOrVars, vars) {
  return executeQuery(listCourseDocumentsRef(dcOrVars, vars));
}

export const getSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSourceDocument', inputVars);
}
getSourceDocumentRef.operationName = 'GetSourceDocument';

export function getSourceDocument(dcOrVars, vars) {
  return executeQuery(getSourceDocumentRef(dcOrVars, vars));
}

export const getSourceDocumentByStoragePathRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSourceDocumentByStoragePath', inputVars);
}
getSourceDocumentByStoragePathRef.operationName = 'GetSourceDocumentByStoragePath';

export function getSourceDocumentByStoragePath(dcOrVars, vars) {
  return executeQuery(getSourceDocumentByStoragePathRef(dcOrVars, vars));
}

