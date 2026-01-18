import { InsertUserData, InsertUserVariables, UpdateUserData, UpdateUserVariables, DeleteUserData, DeleteUserVariables, InsertCourseData, InsertCourseVariables, UpdateCourseData, UpdateCourseVariables, UpsertCourseData, UpsertCourseVariables, DeleteCourseData, DeleteCourseVariables, CreateSourceDocumentData, CreateSourceDocumentVariables, UpdateSourceDocumentData, UpdateSourceDocumentVariables, UpdateDocumentStatusData, UpdateDocumentStatusVariables, DeleteSourceDocumentData, DeleteSourceDocumentVariables, ListUsersData, GetUserData, GetUserVariables, ListCoursesData, GetCourseData, GetCourseVariables, ListSourceDocumentsData, ListCourseDocumentsData, ListCourseDocumentsVariables, GetSourceDocumentData, GetSourceDocumentVariables, GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useInsertUser(options?: useDataConnectMutationOptions<InsertUserData, FirebaseError, InsertUserVariables | void>): UseDataConnectMutationResult<InsertUserData, InsertUserVariables>;
export function useInsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<InsertUserData, FirebaseError, InsertUserVariables | void>): UseDataConnectMutationResult<InsertUserData, InsertUserVariables>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;

export function useInsertCourse(options?: useDataConnectMutationOptions<InsertCourseData, FirebaseError, InsertCourseVariables>): UseDataConnectMutationResult<InsertCourseData, InsertCourseVariables>;
export function useInsertCourse(dc: DataConnect, options?: useDataConnectMutationOptions<InsertCourseData, FirebaseError, InsertCourseVariables>): UseDataConnectMutationResult<InsertCourseData, InsertCourseVariables>;

export function useUpdateCourse(options?: useDataConnectMutationOptions<UpdateCourseData, FirebaseError, UpdateCourseVariables>): UseDataConnectMutationResult<UpdateCourseData, UpdateCourseVariables>;
export function useUpdateCourse(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCourseData, FirebaseError, UpdateCourseVariables>): UseDataConnectMutationResult<UpdateCourseData, UpdateCourseVariables>;

export function useUpsertCourse(options?: useDataConnectMutationOptions<UpsertCourseData, FirebaseError, UpsertCourseVariables>): UseDataConnectMutationResult<UpsertCourseData, UpsertCourseVariables>;
export function useUpsertCourse(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCourseData, FirebaseError, UpsertCourseVariables>): UseDataConnectMutationResult<UpsertCourseData, UpsertCourseVariables>;

export function useDeleteCourse(options?: useDataConnectMutationOptions<DeleteCourseData, FirebaseError, DeleteCourseVariables>): UseDataConnectMutationResult<DeleteCourseData, DeleteCourseVariables>;
export function useDeleteCourse(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCourseData, FirebaseError, DeleteCourseVariables>): UseDataConnectMutationResult<DeleteCourseData, DeleteCourseVariables>;

export function useCreateSourceDocument(options?: useDataConnectMutationOptions<CreateSourceDocumentData, FirebaseError, CreateSourceDocumentVariables>): UseDataConnectMutationResult<CreateSourceDocumentData, CreateSourceDocumentVariables>;
export function useCreateSourceDocument(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSourceDocumentData, FirebaseError, CreateSourceDocumentVariables>): UseDataConnectMutationResult<CreateSourceDocumentData, CreateSourceDocumentVariables>;

export function useUpdateSourceDocument(options?: useDataConnectMutationOptions<UpdateSourceDocumentData, FirebaseError, UpdateSourceDocumentVariables>): UseDataConnectMutationResult<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
export function useUpdateSourceDocument(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSourceDocumentData, FirebaseError, UpdateSourceDocumentVariables>): UseDataConnectMutationResult<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;

export function useUpdateDocumentStatus(options?: useDataConnectMutationOptions<UpdateDocumentStatusData, FirebaseError, UpdateDocumentStatusVariables>): UseDataConnectMutationResult<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
export function useUpdateDocumentStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDocumentStatusData, FirebaseError, UpdateDocumentStatusVariables>): UseDataConnectMutationResult<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;

export function useDeleteSourceDocument(options?: useDataConnectMutationOptions<DeleteSourceDocumentData, FirebaseError, DeleteSourceDocumentVariables>): UseDataConnectMutationResult<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
export function useDeleteSourceDocument(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSourceDocumentData, FirebaseError, DeleteSourceDocumentVariables>): UseDataConnectMutationResult<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
export function useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;

export function useListCourses(options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;
export function useListCourses(dc: DataConnect, options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;

export function useGetCourse(vars: GetCourseVariables, options?: useDataConnectQueryOptions<GetCourseData>): UseDataConnectQueryResult<GetCourseData, GetCourseVariables>;
export function useGetCourse(dc: DataConnect, vars: GetCourseVariables, options?: useDataConnectQueryOptions<GetCourseData>): UseDataConnectQueryResult<GetCourseData, GetCourseVariables>;

export function useListSourceDocuments(options?: useDataConnectQueryOptions<ListSourceDocumentsData>): UseDataConnectQueryResult<ListSourceDocumentsData, undefined>;
export function useListSourceDocuments(dc: DataConnect, options?: useDataConnectQueryOptions<ListSourceDocumentsData>): UseDataConnectQueryResult<ListSourceDocumentsData, undefined>;

export function useListCourseDocuments(vars: ListCourseDocumentsVariables, options?: useDataConnectQueryOptions<ListCourseDocumentsData>): UseDataConnectQueryResult<ListCourseDocumentsData, ListCourseDocumentsVariables>;
export function useListCourseDocuments(dc: DataConnect, vars: ListCourseDocumentsVariables, options?: useDataConnectQueryOptions<ListCourseDocumentsData>): UseDataConnectQueryResult<ListCourseDocumentsData, ListCourseDocumentsVariables>;

export function useGetSourceDocument(vars: GetSourceDocumentVariables, options?: useDataConnectQueryOptions<GetSourceDocumentData>): UseDataConnectQueryResult<GetSourceDocumentData, GetSourceDocumentVariables>;
export function useGetSourceDocument(dc: DataConnect, vars: GetSourceDocumentVariables, options?: useDataConnectQueryOptions<GetSourceDocumentData>): UseDataConnectQueryResult<GetSourceDocumentData, GetSourceDocumentVariables>;

export function useGetSourceDocumentByStoragePath(vars: GetSourceDocumentByStoragePathVariables, options?: useDataConnectQueryOptions<GetSourceDocumentByStoragePathData>): UseDataConnectQueryResult<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
export function useGetSourceDocumentByStoragePath(dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables, options?: useDataConnectQueryOptions<GetSourceDocumentByStoragePathData>): UseDataConnectQueryResult<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
