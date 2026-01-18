const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const DocumentStatus = {
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
exports.DocumentStatus = DocumentStatus;

const connectorConfig = {
  connector: 'example',
  service: 'se-with-llms-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const insertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertUser', inputVars);
}
insertUserRef.operationName = 'InsertUser';
exports.insertUserRef = insertUserRef;

exports.insertUser = function insertUser(dcOrVars, vars) {
  return executeMutation(insertUserRef(dcOrVars, vars));
};

const updateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUser', inputVars);
}
updateUserRef.operationName = 'UpdateUser';
exports.updateUserRef = updateUserRef;

exports.updateUser = function updateUser(dcOrVars, vars) {
  return executeMutation(updateUserRef(dcOrVars, vars));
};

const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';
exports.deleteUserRef = deleteUserRef;

exports.deleteUser = function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
};

const insertCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertCourse', inputVars);
}
insertCourseRef.operationName = 'InsertCourse';
exports.insertCourseRef = insertCourseRef;

exports.insertCourse = function insertCourse(dcOrVars, vars) {
  return executeMutation(insertCourseRef(dcOrVars, vars));
};

const updateCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCourse', inputVars);
}
updateCourseRef.operationName = 'UpdateCourse';
exports.updateCourseRef = updateCourseRef;

exports.updateCourse = function updateCourse(dcOrVars, vars) {
  return executeMutation(updateCourseRef(dcOrVars, vars));
};

const upsertCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCourse', inputVars);
}
upsertCourseRef.operationName = 'UpsertCourse';
exports.upsertCourseRef = upsertCourseRef;

exports.upsertCourse = function upsertCourse(dcOrVars, vars) {
  return executeMutation(upsertCourseRef(dcOrVars, vars));
};

const deleteCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCourse', inputVars);
}
deleteCourseRef.operationName = 'DeleteCourse';
exports.deleteCourseRef = deleteCourseRef;

exports.deleteCourse = function deleteCourse(dcOrVars, vars) {
  return executeMutation(deleteCourseRef(dcOrVars, vars));
};

const createSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceDocument', inputVars);
}
createSourceDocumentRef.operationName = 'CreateSourceDocument';
exports.createSourceDocumentRef = createSourceDocumentRef;

exports.createSourceDocument = function createSourceDocument(dcOrVars, vars) {
  return executeMutation(createSourceDocumentRef(dcOrVars, vars));
};

const updateSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSourceDocument', inputVars);
}
updateSourceDocumentRef.operationName = 'UpdateSourceDocument';
exports.updateSourceDocumentRef = updateSourceDocumentRef;

exports.updateSourceDocument = function updateSourceDocument(dcOrVars, vars) {
  return executeMutation(updateSourceDocumentRef(dcOrVars, vars));
};

const updateDocumentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDocumentStatus', inputVars);
}
updateDocumentStatusRef.operationName = 'UpdateDocumentStatus';
exports.updateDocumentStatusRef = updateDocumentStatusRef;

exports.updateDocumentStatus = function updateDocumentStatus(dcOrVars, vars) {
  return executeMutation(updateDocumentStatusRef(dcOrVars, vars));
};

const deleteSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceDocument', inputVars);
}
deleteSourceDocumentRef.operationName = 'DeleteSourceDocument';
exports.deleteSourceDocumentRef = deleteSourceDocumentRef;

exports.deleteSourceDocument = function deleteSourceDocument(dcOrVars, vars) {
  return executeMutation(deleteSourceDocumentRef(dcOrVars, vars));
};

const listUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsers');
}
listUsersRef.operationName = 'ListUsers';
exports.listUsersRef = listUsersRef;

exports.listUsers = function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
};

const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
};

const listCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourses');
}
listCoursesRef.operationName = 'ListCourses';
exports.listCoursesRef = listCoursesRef;

exports.listCourses = function listCourses(dc) {
  return executeQuery(listCoursesRef(dc));
};

const getCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCourse', inputVars);
}
getCourseRef.operationName = 'GetCourse';
exports.getCourseRef = getCourseRef;

exports.getCourse = function getCourse(dcOrVars, vars) {
  return executeQuery(getCourseRef(dcOrVars, vars));
};

const listSourceDocumentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSourceDocuments');
}
listSourceDocumentsRef.operationName = 'ListSourceDocuments';
exports.listSourceDocumentsRef = listSourceDocumentsRef;

exports.listSourceDocuments = function listSourceDocuments(dc) {
  return executeQuery(listSourceDocumentsRef(dc));
};

const listCourseDocumentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourseDocuments', inputVars);
}
listCourseDocumentsRef.operationName = 'ListCourseDocuments';
exports.listCourseDocumentsRef = listCourseDocumentsRef;

exports.listCourseDocuments = function listCourseDocuments(dcOrVars, vars) {
  return executeQuery(listCourseDocumentsRef(dcOrVars, vars));
};

const getSourceDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSourceDocument', inputVars);
}
getSourceDocumentRef.operationName = 'GetSourceDocument';
exports.getSourceDocumentRef = getSourceDocumentRef;

exports.getSourceDocument = function getSourceDocument(dcOrVars, vars) {
  return executeQuery(getSourceDocumentRef(dcOrVars, vars));
};

const getSourceDocumentByStoragePathRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSourceDocumentByStoragePath', inputVars);
}
getSourceDocumentByStoragePathRef.operationName = 'GetSourceDocumentByStoragePath';
exports.getSourceDocumentByStoragePathRef = getSourceDocumentByStoragePathRef;

exports.getSourceDocumentByStoragePath = function getSourceDocumentByStoragePath(dcOrVars, vars) {
  return executeQuery(getSourceDocumentByStoragePathRef(dcOrVars, vars));
};
