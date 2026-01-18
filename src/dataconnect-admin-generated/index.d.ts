import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;

export enum DocumentStatus {
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  CONVERTING = "CONVERTING",
  CONVERTED = "CONVERTED",
  CHUNKING = "CHUNKING",
  CHUNKED = "CHUNKED",
  ANALYZING = "ANALYZING",
  ANALYZED = "ANALYZED",
  ERROR = "ERROR",
}

export interface Course_Key {
  id: string;
  __typename?: 'Course_Key';
}

export interface CreateSourceDocumentData {
  sourceDocument_insert: SourceDocument_Key;
}

export interface CreateSourceDocumentVariables {
  courseId: string;
  fileName: string;
  mimeType: string;
  size?: number | null;
  storagePath: string;
}

export interface DeleteCourseData {
  course_delete?: Course_Key | null;
}

export interface DeleteCourseVariables {
  id: string;
}

export interface DeleteSourceDocumentData {
  sourceDocument_delete?: SourceDocument_Key | null;
}

export interface DeleteSourceDocumentVariables {
  id: string;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: string;
}

export interface GetCourseData {
  course?: {
    id: string;
    title: string;
    description?: string | null;
  } & Course_Key;
}

export interface GetCourseVariables {
  id: string;
}

export interface GetSourceDocumentByStoragePathData {
  sourceDocuments: ({
    id: string;
    status: DocumentStatus;
  } & SourceDocument_Key)[];
}

export interface GetSourceDocumentByStoragePathVariables {
  storagePath: string;
}

export interface GetSourceDocumentData {
  sourceDocument?: {
    id: string;
    fileName: string;
    mimeType: string;
    size?: number | null;
    status: DocumentStatus;
    storagePath: string;
    updatedAt?: TimestampString | null;
    course: {
      id: string;
      title: string;
      description?: string | null;
    } & Course_Key;
  } & SourceDocument_Key;
}

export interface GetSourceDocumentVariables {
  id: string;
}

export interface GetUserData {
  user?: {
    id: string;
    username?: string | null;
  } & User_Key;
}

export interface GetUserVariables {
  id: string;
}

export interface InsertCourseData {
  course_insert: Course_Key;
}

export interface InsertCourseVariables {
  id: string;
  title: string;
  description?: string | null;
}

export interface InsertUserData {
  user_insert: User_Key;
}

export interface InsertUserVariables {
  username?: string | null;
}

export interface ListCourseDocumentsData {
  sourceDocuments: ({
    id: string;
    fileName: string;
    mimeType: string;
    size?: number | null;
    status: DocumentStatus;
    storagePath: string;
    updatedAt?: TimestampString | null;
  } & SourceDocument_Key)[];
}

export interface ListCourseDocumentsVariables {
  courseId: string;
}

export interface ListCoursesData {
  courses: ({
    id: string;
    title: string;
    description?: string | null;
  } & Course_Key)[];
}

export interface ListSourceDocumentsData {
  sourceDocuments: ({
    id: string;
    fileName: string;
    mimeType: string;
    size?: number | null;
    status: DocumentStatus;
    storagePath: string;
    updatedAt?: TimestampString | null;
    course: {
      id: string;
      title: string;
    } & Course_Key;
  } & SourceDocument_Key)[];
}

export interface ListUsersData {
  users: ({
    id: string;
    username?: string | null;
  } & User_Key)[];
}

export interface SourceDocument_Key {
  id: string;
  __typename?: 'SourceDocument_Key';
}

export interface UpdateCourseData {
  course_update?: Course_Key | null;
}

export interface UpdateCourseVariables {
  id: string;
  title?: string | null;
  description?: string | null;
}

export interface UpdateDocumentStatusData {
  sourceDocument_update?: SourceDocument_Key | null;
}

export interface UpdateDocumentStatusVariables {
  id: string;
  status: DocumentStatus;
  storagePath?: string | null;
}

export interface UpdateSourceDocumentData {
  sourceDocument_update?: SourceDocument_Key | null;
}

export interface UpdateSourceDocumentVariables {
  id: string;
  fileName?: string | null;
  mimeType?: string | null;
  size?: number | null;
  storagePath?: string | null;
  status?: DocumentStatus | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  id: string;
  username?: string | null;
}

export interface UpsertCourseData {
  course_upsert: Course_Key;
}

export interface UpsertCourseVariables {
  id: string;
  title: string;
  description?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'InsertUser' Mutation. Allow users to execute without passing in DataConnect. */
export function insertUser(dc: DataConnect, vars?: InsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<InsertUserData>>;
/** Generated Node Admin SDK operation action function for the 'InsertUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function insertUser(vars?: InsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<InsertUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUser(dc: DataConnect, vars: UpdateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUser(vars: UpdateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(vars: DeleteUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'InsertCourse' Mutation. Allow users to execute without passing in DataConnect. */
export function insertCourse(dc: DataConnect, vars: InsertCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<InsertCourseData>>;
/** Generated Node Admin SDK operation action function for the 'InsertCourse' Mutation. Allow users to pass in custom DataConnect instances. */
export function insertCourse(vars: InsertCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<InsertCourseData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCourse' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCourse(dc: DataConnect, vars: UpdateCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCourseData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCourse' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCourse(vars: UpdateCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCourseData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCourse' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCourse(dc: DataConnect, vars: UpsertCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCourseData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCourse' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCourse(vars: UpsertCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCourseData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCourse' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCourse(dc: DataConnect, vars: DeleteCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCourseData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCourse' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCourse(vars: DeleteCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCourseData>>;

/** Generated Node Admin SDK operation action function for the 'CreateSourceDocument' Mutation. Allow users to execute without passing in DataConnect. */
export function createSourceDocument(dc: DataConnect, vars: CreateSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateSourceDocumentData>>;
/** Generated Node Admin SDK operation action function for the 'CreateSourceDocument' Mutation. Allow users to pass in custom DataConnect instances. */
export function createSourceDocument(vars: CreateSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateSourceDocumentData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateSourceDocument' Mutation. Allow users to execute without passing in DataConnect. */
export function updateSourceDocument(dc: DataConnect, vars: UpdateSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSourceDocumentData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateSourceDocument' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateSourceDocument(vars: UpdateSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSourceDocumentData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateDocumentStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateDocumentStatus(dc: DataConnect, vars: UpdateDocumentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDocumentStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateDocumentStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateDocumentStatus(vars: UpdateDocumentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDocumentStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteSourceDocument' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteSourceDocument(dc: DataConnect, vars: DeleteSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSourceDocumentData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteSourceDocument' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteSourceDocument(vars: DeleteSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSourceDocumentData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to execute without passing in DataConnect. */
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to pass in custom DataConnect instances. */
export function getUser(vars: GetUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListCourses' Query. Allow users to execute without passing in DataConnect. */
export function listCourses(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCoursesData>>;
/** Generated Node Admin SDK operation action function for the 'ListCourses' Query. Allow users to pass in custom DataConnect instances. */
export function listCourses(options?: OperationOptions): Promise<ExecuteOperationResponse<ListCoursesData>>;

/** Generated Node Admin SDK operation action function for the 'GetCourse' Query. Allow users to execute without passing in DataConnect. */
export function getCourse(dc: DataConnect, vars: GetCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCourseData>>;
/** Generated Node Admin SDK operation action function for the 'GetCourse' Query. Allow users to pass in custom DataConnect instances. */
export function getCourse(vars: GetCourseVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCourseData>>;

/** Generated Node Admin SDK operation action function for the 'ListSourceDocuments' Query. Allow users to execute without passing in DataConnect. */
export function listSourceDocuments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSourceDocumentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListSourceDocuments' Query. Allow users to pass in custom DataConnect instances. */
export function listSourceDocuments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListSourceDocumentsData>>;

/** Generated Node Admin SDK operation action function for the 'ListCourseDocuments' Query. Allow users to execute without passing in DataConnect. */
export function listCourseDocuments(dc: DataConnect, vars: ListCourseDocumentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCourseDocumentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListCourseDocuments' Query. Allow users to pass in custom DataConnect instances. */
export function listCourseDocuments(vars: ListCourseDocumentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCourseDocumentsData>>;

/** Generated Node Admin SDK operation action function for the 'GetSourceDocument' Query. Allow users to execute without passing in DataConnect. */
export function getSourceDocument(dc: DataConnect, vars: GetSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSourceDocumentData>>;
/** Generated Node Admin SDK operation action function for the 'GetSourceDocument' Query. Allow users to pass in custom DataConnect instances. */
export function getSourceDocument(vars: GetSourceDocumentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSourceDocumentData>>;

/** Generated Node Admin SDK operation action function for the 'GetSourceDocumentByStoragePath' Query. Allow users to execute without passing in DataConnect. */
export function getSourceDocumentByStoragePath(dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSourceDocumentByStoragePathData>>;
/** Generated Node Admin SDK operation action function for the 'GetSourceDocumentByStoragePath' Query. Allow users to pass in custom DataConnect instances. */
export function getSourceDocumentByStoragePath(vars: GetSourceDocumentByStoragePathVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSourceDocumentByStoragePathData>>;

