import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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
};



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

interface InsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  operationName: string;
}
export const insertUserRef: InsertUserRef;

export function insertUser(vars?: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;
export function insertUser(dc: DataConnect, vars?: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface InsertCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCourseVariables): MutationRef<InsertCourseData, InsertCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertCourseVariables): MutationRef<InsertCourseData, InsertCourseVariables>;
  operationName: string;
}
export const insertCourseRef: InsertCourseRef;

export function insertCourse(vars: InsertCourseVariables): MutationPromise<InsertCourseData, InsertCourseVariables>;
export function insertCourse(dc: DataConnect, vars: InsertCourseVariables): MutationPromise<InsertCourseData, InsertCourseVariables>;

interface UpdateCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
  operationName: string;
}
export const updateCourseRef: UpdateCourseRef;

export function updateCourse(vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;
export function updateCourse(dc: DataConnect, vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpsertCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCourseVariables): MutationRef<UpsertCourseData, UpsertCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCourseVariables): MutationRef<UpsertCourseData, UpsertCourseVariables>;
  operationName: string;
}
export const upsertCourseRef: UpsertCourseRef;

export function upsertCourse(vars: UpsertCourseVariables): MutationPromise<UpsertCourseData, UpsertCourseVariables>;
export function upsertCourse(dc: DataConnect, vars: UpsertCourseVariables): MutationPromise<UpsertCourseData, UpsertCourseVariables>;

interface DeleteCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
  operationName: string;
}
export const deleteCourseRef: DeleteCourseRef;

export function deleteCourse(vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;
export function deleteCourse(dc: DataConnect, vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;

interface CreateSourceDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceDocumentVariables): MutationRef<CreateSourceDocumentData, CreateSourceDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceDocumentVariables): MutationRef<CreateSourceDocumentData, CreateSourceDocumentVariables>;
  operationName: string;
}
export const createSourceDocumentRef: CreateSourceDocumentRef;

export function createSourceDocument(vars: CreateSourceDocumentVariables): MutationPromise<CreateSourceDocumentData, CreateSourceDocumentVariables>;
export function createSourceDocument(dc: DataConnect, vars: CreateSourceDocumentVariables): MutationPromise<CreateSourceDocumentData, CreateSourceDocumentVariables>;

interface UpdateSourceDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceDocumentVariables): MutationRef<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSourceDocumentVariables): MutationRef<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
  operationName: string;
}
export const updateSourceDocumentRef: UpdateSourceDocumentRef;

export function updateSourceDocument(vars: UpdateSourceDocumentVariables): MutationPromise<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
export function updateSourceDocument(dc: DataConnect, vars: UpdateSourceDocumentVariables): MutationPromise<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;

interface UpdateDocumentStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDocumentStatusVariables): MutationRef<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDocumentStatusVariables): MutationRef<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
  operationName: string;
}
export const updateDocumentStatusRef: UpdateDocumentStatusRef;

export function updateDocumentStatus(vars: UpdateDocumentStatusVariables): MutationPromise<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
export function updateDocumentStatus(dc: DataConnect, vars: UpdateDocumentStatusVariables): MutationPromise<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;

interface DeleteSourceDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceDocumentVariables): MutationRef<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceDocumentVariables): MutationRef<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
  operationName: string;
}
export const deleteSourceDocumentRef: DeleteSourceDocumentRef;

export function deleteSourceDocument(vars: DeleteSourceDocumentVariables): MutationPromise<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
export function deleteSourceDocument(dc: DataConnect, vars: DeleteSourceDocumentVariables): MutationPromise<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface ListCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCoursesData, undefined>;
  operationName: string;
}
export const listCoursesRef: ListCoursesRef;

export function listCourses(): QueryPromise<ListCoursesData, undefined>;
export function listCourses(dc: DataConnect): QueryPromise<ListCoursesData, undefined>;

interface GetCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourseVariables): QueryRef<GetCourseData, GetCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCourseVariables): QueryRef<GetCourseData, GetCourseVariables>;
  operationName: string;
}
export const getCourseRef: GetCourseRef;

export function getCourse(vars: GetCourseVariables): QueryPromise<GetCourseData, GetCourseVariables>;
export function getCourse(dc: DataConnect, vars: GetCourseVariables): QueryPromise<GetCourseData, GetCourseVariables>;

interface ListSourceDocumentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSourceDocumentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSourceDocumentsData, undefined>;
  operationName: string;
}
export const listSourceDocumentsRef: ListSourceDocumentsRef;

export function listSourceDocuments(): QueryPromise<ListSourceDocumentsData, undefined>;
export function listSourceDocuments(dc: DataConnect): QueryPromise<ListSourceDocumentsData, undefined>;

interface ListCourseDocumentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCourseDocumentsVariables): QueryRef<ListCourseDocumentsData, ListCourseDocumentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCourseDocumentsVariables): QueryRef<ListCourseDocumentsData, ListCourseDocumentsVariables>;
  operationName: string;
}
export const listCourseDocumentsRef: ListCourseDocumentsRef;

export function listCourseDocuments(vars: ListCourseDocumentsVariables): QueryPromise<ListCourseDocumentsData, ListCourseDocumentsVariables>;
export function listCourseDocuments(dc: DataConnect, vars: ListCourseDocumentsVariables): QueryPromise<ListCourseDocumentsData, ListCourseDocumentsVariables>;

interface GetSourceDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSourceDocumentVariables): QueryRef<GetSourceDocumentData, GetSourceDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSourceDocumentVariables): QueryRef<GetSourceDocumentData, GetSourceDocumentVariables>;
  operationName: string;
}
export const getSourceDocumentRef: GetSourceDocumentRef;

export function getSourceDocument(vars: GetSourceDocumentVariables): QueryPromise<GetSourceDocumentData, GetSourceDocumentVariables>;
export function getSourceDocument(dc: DataConnect, vars: GetSourceDocumentVariables): QueryPromise<GetSourceDocumentData, GetSourceDocumentVariables>;

interface GetSourceDocumentByStoragePathRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSourceDocumentByStoragePathVariables): QueryRef<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables): QueryRef<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
  operationName: string;
}
export const getSourceDocumentByStoragePathRef: GetSourceDocumentByStoragePathRef;

export function getSourceDocumentByStoragePath(vars: GetSourceDocumentByStoragePathVariables): QueryPromise<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
export function getSourceDocumentByStoragePath(dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables): QueryPromise<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;

