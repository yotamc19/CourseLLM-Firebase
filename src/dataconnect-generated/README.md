# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUsers*](#listusers)
  - [*GetUser*](#getuser)
  - [*ListCourses*](#listcourses)
  - [*GetCourse*](#getcourse)
  - [*ListSourceDocuments*](#listsourcedocuments)
  - [*ListCourseDocuments*](#listcoursedocuments)
  - [*GetSourceDocument*](#getsourcedocument)
  - [*GetSourceDocumentByStoragePath*](#getsourcedocumentbystoragepath)
- [**Mutations**](#mutations)
  - [*InsertUser*](#insertuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*InsertCourse*](#insertcourse)
  - [*UpdateCourse*](#updatecourse)
  - [*UpsertCourse*](#upsertcourse)
  - [*DeleteCourse*](#deletecourse)
  - [*CreateSourceDocument*](#createsourcedocument)
  - [*UpdateSourceDocument*](#updatesourcedocument)
  - [*UpdateDocumentStatus*](#updatedocumentstatus)
  - [*DeleteSourceDocument*](#deletesourcedocument)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    id: string;
    username?: string | null;
  } & User_Key)[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    username?: string | null;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@dataconnect/generated';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@dataconnect/generated';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListCourses
You can execute the `ListCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCourses(): QueryPromise<ListCoursesData, undefined>;

interface ListCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCoursesData, undefined>;
}
export const listCoursesRef: ListCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCourses(dc: DataConnect): QueryPromise<ListCoursesData, undefined>;

interface ListCoursesRef {
  ...
  (dc: DataConnect): QueryRef<ListCoursesData, undefined>;
}
export const listCoursesRef: ListCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCoursesRef:
```typescript
const name = listCoursesRef.operationName;
console.log(name);
```

### Variables
The `ListCourses` query has no variables.
### Return Type
Recall that executing the `ListCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCoursesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCoursesData {
  courses: ({
    id: string;
    title: string;
    description?: string | null;
  } & Course_Key)[];
}
```
### Using `ListCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCourses } from '@dataconnect/generated';


// Call the `listCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
listCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `ListCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCoursesRef } from '@dataconnect/generated';


// Call the `listCoursesRef()` function to get a reference to the query.
const ref = listCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetCourse
You can execute the `GetCourse` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCourse(vars: GetCourseVariables): QueryPromise<GetCourseData, GetCourseVariables>;

interface GetCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourseVariables): QueryRef<GetCourseData, GetCourseVariables>;
}
export const getCourseRef: GetCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCourse(dc: DataConnect, vars: GetCourseVariables): QueryPromise<GetCourseData, GetCourseVariables>;

interface GetCourseRef {
  ...
  (dc: DataConnect, vars: GetCourseVariables): QueryRef<GetCourseData, GetCourseVariables>;
}
export const getCourseRef: GetCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCourseRef:
```typescript
const name = getCourseRef.operationName;
console.log(name);
```

### Variables
The `GetCourse` query requires an argument of type `GetCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCourseVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetCourse` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCourseData {
  course?: {
    id: string;
    title: string;
    description?: string | null;
  } & Course_Key;
}
```
### Using `GetCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCourse, GetCourseVariables } from '@dataconnect/generated';

// The `GetCourse` query requires an argument of type `GetCourseVariables`:
const getCourseVars: GetCourseVariables = {
  id: ..., 
};

// Call the `getCourse()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCourse(getCourseVars);
// Variables can be defined inline as well.
const { data } = await getCourse({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCourse(dataConnect, getCourseVars);

console.log(data.course);

// Or, you can use the `Promise` API.
getCourse(getCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course);
});
```

### Using `GetCourse`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCourseRef, GetCourseVariables } from '@dataconnect/generated';

// The `GetCourse` query requires an argument of type `GetCourseVariables`:
const getCourseVars: GetCourseVariables = {
  id: ..., 
};

// Call the `getCourseRef()` function to get a reference to the query.
const ref = getCourseRef(getCourseVars);
// Variables can be defined inline as well.
const ref = getCourseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCourseRef(dataConnect, getCourseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.course);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.course);
});
```

## ListSourceDocuments
You can execute the `ListSourceDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSourceDocuments(): QueryPromise<ListSourceDocumentsData, undefined>;

interface ListSourceDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSourceDocumentsData, undefined>;
}
export const listSourceDocumentsRef: ListSourceDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSourceDocuments(dc: DataConnect): QueryPromise<ListSourceDocumentsData, undefined>;

interface ListSourceDocumentsRef {
  ...
  (dc: DataConnect): QueryRef<ListSourceDocumentsData, undefined>;
}
export const listSourceDocumentsRef: ListSourceDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSourceDocumentsRef:
```typescript
const name = listSourceDocumentsRef.operationName;
console.log(name);
```

### Variables
The `ListSourceDocuments` query has no variables.
### Return Type
Recall that executing the `ListSourceDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSourceDocumentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListSourceDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSourceDocuments } from '@dataconnect/generated';


// Call the `listSourceDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSourceDocuments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSourceDocuments(dataConnect);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
listSourceDocuments().then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

### Using `ListSourceDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSourceDocumentsRef } from '@dataconnect/generated';


// Call the `listSourceDocumentsRef()` function to get a reference to the query.
const ref = listSourceDocumentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSourceDocumentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

## ListCourseDocuments
You can execute the `ListCourseDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCourseDocuments(vars: ListCourseDocumentsVariables): QueryPromise<ListCourseDocumentsData, ListCourseDocumentsVariables>;

interface ListCourseDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCourseDocumentsVariables): QueryRef<ListCourseDocumentsData, ListCourseDocumentsVariables>;
}
export const listCourseDocumentsRef: ListCourseDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCourseDocuments(dc: DataConnect, vars: ListCourseDocumentsVariables): QueryPromise<ListCourseDocumentsData, ListCourseDocumentsVariables>;

interface ListCourseDocumentsRef {
  ...
  (dc: DataConnect, vars: ListCourseDocumentsVariables): QueryRef<ListCourseDocumentsData, ListCourseDocumentsVariables>;
}
export const listCourseDocumentsRef: ListCourseDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCourseDocumentsRef:
```typescript
const name = listCourseDocumentsRef.operationName;
console.log(name);
```

### Variables
The `ListCourseDocuments` query requires an argument of type `ListCourseDocumentsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCourseDocumentsVariables {
  courseId: string;
}
```
### Return Type
Recall that executing the `ListCourseDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCourseDocumentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCourseDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCourseDocuments, ListCourseDocumentsVariables } from '@dataconnect/generated';

// The `ListCourseDocuments` query requires an argument of type `ListCourseDocumentsVariables`:
const listCourseDocumentsVars: ListCourseDocumentsVariables = {
  courseId: ..., 
};

// Call the `listCourseDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCourseDocuments(listCourseDocumentsVars);
// Variables can be defined inline as well.
const { data } = await listCourseDocuments({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCourseDocuments(dataConnect, listCourseDocumentsVars);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
listCourseDocuments(listCourseDocumentsVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

### Using `ListCourseDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCourseDocumentsRef, ListCourseDocumentsVariables } from '@dataconnect/generated';

// The `ListCourseDocuments` query requires an argument of type `ListCourseDocumentsVariables`:
const listCourseDocumentsVars: ListCourseDocumentsVariables = {
  courseId: ..., 
};

// Call the `listCourseDocumentsRef()` function to get a reference to the query.
const ref = listCourseDocumentsRef(listCourseDocumentsVars);
// Variables can be defined inline as well.
const ref = listCourseDocumentsRef({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCourseDocumentsRef(dataConnect, listCourseDocumentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

## GetSourceDocument
You can execute the `GetSourceDocument` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSourceDocument(vars: GetSourceDocumentVariables): QueryPromise<GetSourceDocumentData, GetSourceDocumentVariables>;

interface GetSourceDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSourceDocumentVariables): QueryRef<GetSourceDocumentData, GetSourceDocumentVariables>;
}
export const getSourceDocumentRef: GetSourceDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSourceDocument(dc: DataConnect, vars: GetSourceDocumentVariables): QueryPromise<GetSourceDocumentData, GetSourceDocumentVariables>;

interface GetSourceDocumentRef {
  ...
  (dc: DataConnect, vars: GetSourceDocumentVariables): QueryRef<GetSourceDocumentData, GetSourceDocumentVariables>;
}
export const getSourceDocumentRef: GetSourceDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSourceDocumentRef:
```typescript
const name = getSourceDocumentRef.operationName;
console.log(name);
```

### Variables
The `GetSourceDocument` query requires an argument of type `GetSourceDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSourceDocumentVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetSourceDocument` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSourceDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetSourceDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSourceDocument, GetSourceDocumentVariables } from '@dataconnect/generated';

// The `GetSourceDocument` query requires an argument of type `GetSourceDocumentVariables`:
const getSourceDocumentVars: GetSourceDocumentVariables = {
  id: ..., 
};

// Call the `getSourceDocument()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSourceDocument(getSourceDocumentVars);
// Variables can be defined inline as well.
const { data } = await getSourceDocument({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSourceDocument(dataConnect, getSourceDocumentVars);

console.log(data.sourceDocument);

// Or, you can use the `Promise` API.
getSourceDocument(getSourceDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument);
});
```

### Using `GetSourceDocument`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSourceDocumentRef, GetSourceDocumentVariables } from '@dataconnect/generated';

// The `GetSourceDocument` query requires an argument of type `GetSourceDocumentVariables`:
const getSourceDocumentVars: GetSourceDocumentVariables = {
  id: ..., 
};

// Call the `getSourceDocumentRef()` function to get a reference to the query.
const ref = getSourceDocumentRef(getSourceDocumentVars);
// Variables can be defined inline as well.
const ref = getSourceDocumentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSourceDocumentRef(dataConnect, getSourceDocumentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceDocument);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument);
});
```

## GetSourceDocumentByStoragePath
You can execute the `GetSourceDocumentByStoragePath` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSourceDocumentByStoragePath(vars: GetSourceDocumentByStoragePathVariables): QueryPromise<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;

interface GetSourceDocumentByStoragePathRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSourceDocumentByStoragePathVariables): QueryRef<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
}
export const getSourceDocumentByStoragePathRef: GetSourceDocumentByStoragePathRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSourceDocumentByStoragePath(dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables): QueryPromise<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;

interface GetSourceDocumentByStoragePathRef {
  ...
  (dc: DataConnect, vars: GetSourceDocumentByStoragePathVariables): QueryRef<GetSourceDocumentByStoragePathData, GetSourceDocumentByStoragePathVariables>;
}
export const getSourceDocumentByStoragePathRef: GetSourceDocumentByStoragePathRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSourceDocumentByStoragePathRef:
```typescript
const name = getSourceDocumentByStoragePathRef.operationName;
console.log(name);
```

### Variables
The `GetSourceDocumentByStoragePath` query requires an argument of type `GetSourceDocumentByStoragePathVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSourceDocumentByStoragePathVariables {
  storagePath: string;
}
```
### Return Type
Recall that executing the `GetSourceDocumentByStoragePath` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSourceDocumentByStoragePathData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSourceDocumentByStoragePathData {
  sourceDocuments: ({
    id: string;
    status: DocumentStatus;
  } & SourceDocument_Key)[];
}
```
### Using `GetSourceDocumentByStoragePath`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSourceDocumentByStoragePath, GetSourceDocumentByStoragePathVariables } from '@dataconnect/generated';

// The `GetSourceDocumentByStoragePath` query requires an argument of type `GetSourceDocumentByStoragePathVariables`:
const getSourceDocumentByStoragePathVars: GetSourceDocumentByStoragePathVariables = {
  storagePath: ..., 
};

// Call the `getSourceDocumentByStoragePath()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSourceDocumentByStoragePath(getSourceDocumentByStoragePathVars);
// Variables can be defined inline as well.
const { data } = await getSourceDocumentByStoragePath({ storagePath: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSourceDocumentByStoragePath(dataConnect, getSourceDocumentByStoragePathVars);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
getSourceDocumentByStoragePath(getSourceDocumentByStoragePathVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

### Using `GetSourceDocumentByStoragePath`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSourceDocumentByStoragePathRef, GetSourceDocumentByStoragePathVariables } from '@dataconnect/generated';

// The `GetSourceDocumentByStoragePath` query requires an argument of type `GetSourceDocumentByStoragePathVariables`:
const getSourceDocumentByStoragePathVars: GetSourceDocumentByStoragePathVariables = {
  storagePath: ..., 
};

// Call the `getSourceDocumentByStoragePathRef()` function to get a reference to the query.
const ref = getSourceDocumentByStoragePathRef(getSourceDocumentByStoragePathVars);
// Variables can be defined inline as well.
const ref = getSourceDocumentByStoragePathRef({ storagePath: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSourceDocumentByStoragePathRef(dataConnect, getSourceDocumentByStoragePathVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocuments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## InsertUser
You can execute the `InsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertUser(vars?: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertUser(dc: DataConnect, vars?: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  (dc: DataConnect, vars?: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertUserRef:
```typescript
const name = insertUserRef.operationName;
console.log(name);
```

### Variables
The `InsertUser` mutation has an optional argument of type `InsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertUserVariables {
  username?: string | null;
}
```
### Return Type
Recall that executing the `InsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertUserData {
  user_insert: User_Key;
}
```
### Using `InsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertUser, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation has an optional argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  username: ..., // optional
};

// Call the `insertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertUser(insertUserVars);
// Variables can be defined inline as well.
const { data } = await insertUser({ username: ..., });
// Since all variables are optional for this mutation, you can omit the `InsertUserVariables` argument.
const { data } = await insertUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertUser(dataConnect, insertUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
insertUser(insertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `InsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertUserRef, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation has an optional argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  username: ..., // optional
};

// Call the `insertUserRef()` function to get a reference to the mutation.
const ref = insertUserRef(insertUserVars);
// Variables can be defined inline as well.
const ref = insertUserRef({ username: ..., });
// Since all variables are optional for this mutation, you can omit the `InsertUserVariables` argument.
const ref = insertUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertUserRef(dataConnect, insertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  id: string;
  username?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  username: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ id: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  username: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ id: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## InsertCourse
You can execute the `InsertCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertCourse(vars: InsertCourseVariables): MutationPromise<InsertCourseData, InsertCourseVariables>;

interface InsertCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCourseVariables): MutationRef<InsertCourseData, InsertCourseVariables>;
}
export const insertCourseRef: InsertCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertCourse(dc: DataConnect, vars: InsertCourseVariables): MutationPromise<InsertCourseData, InsertCourseVariables>;

interface InsertCourseRef {
  ...
  (dc: DataConnect, vars: InsertCourseVariables): MutationRef<InsertCourseData, InsertCourseVariables>;
}
export const insertCourseRef: InsertCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertCourseRef:
```typescript
const name = insertCourseRef.operationName;
console.log(name);
```

### Variables
The `InsertCourse` mutation requires an argument of type `InsertCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertCourseVariables {
  id: string;
  title: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `InsertCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertCourseData {
  course_insert: Course_Key;
}
```
### Using `InsertCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertCourse, InsertCourseVariables } from '@dataconnect/generated';

// The `InsertCourse` mutation requires an argument of type `InsertCourseVariables`:
const insertCourseVars: InsertCourseVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
};

// Call the `insertCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertCourse(insertCourseVars);
// Variables can be defined inline as well.
const { data } = await insertCourse({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertCourse(dataConnect, insertCourseVars);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
insertCourse(insertCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

### Using `InsertCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertCourseRef, InsertCourseVariables } from '@dataconnect/generated';

// The `InsertCourse` mutation requires an argument of type `InsertCourseVariables`:
const insertCourseVars: InsertCourseVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
};

// Call the `insertCourseRef()` function to get a reference to the mutation.
const ref = insertCourseRef(insertCourseVars);
// Variables can be defined inline as well.
const ref = insertCourseRef({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertCourseRef(dataConnect, insertCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

## UpdateCourse
You can execute the `UpdateCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCourse(vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCourse(dc: DataConnect, vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  (dc: DataConnect, vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCourseRef:
```typescript
const name = updateCourseRef.operationName;
console.log(name);
```

### Variables
The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCourseVariables {
  id: string;
  title?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCourseData {
  course_update?: Course_Key | null;
}
```
### Using `UpdateCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCourse, UpdateCourseVariables } from '@dataconnect/generated';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
};

// Call the `updateCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCourse(updateCourseVars);
// Variables can be defined inline as well.
const { data } = await updateCourse({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCourse(dataConnect, updateCourseVars);

console.log(data.course_update);

// Or, you can use the `Promise` API.
updateCourse(updateCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

### Using `UpdateCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCourseRef, UpdateCourseVariables } from '@dataconnect/generated';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
};

// Call the `updateCourseRef()` function to get a reference to the mutation.
const ref = updateCourseRef(updateCourseVars);
// Variables can be defined inline as well.
const ref = updateCourseRef({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCourseRef(dataConnect, updateCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

## UpsertCourse
You can execute the `UpsertCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCourse(vars: UpsertCourseVariables): MutationPromise<UpsertCourseData, UpsertCourseVariables>;

interface UpsertCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCourseVariables): MutationRef<UpsertCourseData, UpsertCourseVariables>;
}
export const upsertCourseRef: UpsertCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCourse(dc: DataConnect, vars: UpsertCourseVariables): MutationPromise<UpsertCourseData, UpsertCourseVariables>;

interface UpsertCourseRef {
  ...
  (dc: DataConnect, vars: UpsertCourseVariables): MutationRef<UpsertCourseData, UpsertCourseVariables>;
}
export const upsertCourseRef: UpsertCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCourseRef:
```typescript
const name = upsertCourseRef.operationName;
console.log(name);
```

### Variables
The `UpsertCourse` mutation requires an argument of type `UpsertCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCourseVariables {
  id: string;
  title: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpsertCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCourseData {
  course_upsert: Course_Key;
}
```
### Using `UpsertCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCourse, UpsertCourseVariables } from '@dataconnect/generated';

// The `UpsertCourse` mutation requires an argument of type `UpsertCourseVariables`:
const upsertCourseVars: UpsertCourseVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
};

// Call the `upsertCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCourse(upsertCourseVars);
// Variables can be defined inline as well.
const { data } = await upsertCourse({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCourse(dataConnect, upsertCourseVars);

console.log(data.course_upsert);

// Or, you can use the `Promise` API.
upsertCourse(upsertCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_upsert);
});
```

### Using `UpsertCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCourseRef, UpsertCourseVariables } from '@dataconnect/generated';

// The `UpsertCourse` mutation requires an argument of type `UpsertCourseVariables`:
const upsertCourseVars: UpsertCourseVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
};

// Call the `upsertCourseRef()` function to get a reference to the mutation.
const ref = upsertCourseRef(upsertCourseVars);
// Variables can be defined inline as well.
const ref = upsertCourseRef({ id: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCourseRef(dataConnect, upsertCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_upsert);
});
```

## DeleteCourse
You can execute the `DeleteCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCourse(vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;

interface DeleteCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
}
export const deleteCourseRef: DeleteCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCourse(dc: DataConnect, vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;

interface DeleteCourseRef {
  ...
  (dc: DataConnect, vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
}
export const deleteCourseRef: DeleteCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCourseRef:
```typescript
const name = deleteCourseRef.operationName;
console.log(name);
```

### Variables
The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCourseVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCourseData {
  course_delete?: Course_Key | null;
}
```
### Using `DeleteCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCourse, DeleteCourseVariables } from '@dataconnect/generated';

// The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`:
const deleteCourseVars: DeleteCourseVariables = {
  id: ..., 
};

// Call the `deleteCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCourse(deleteCourseVars);
// Variables can be defined inline as well.
const { data } = await deleteCourse({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCourse(dataConnect, deleteCourseVars);

console.log(data.course_delete);

// Or, you can use the `Promise` API.
deleteCourse(deleteCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_delete);
});
```

### Using `DeleteCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCourseRef, DeleteCourseVariables } from '@dataconnect/generated';

// The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`:
const deleteCourseVars: DeleteCourseVariables = {
  id: ..., 
};

// Call the `deleteCourseRef()` function to get a reference to the mutation.
const ref = deleteCourseRef(deleteCourseVars);
// Variables can be defined inline as well.
const ref = deleteCourseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCourseRef(dataConnect, deleteCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_delete);
});
```

## CreateSourceDocument
You can execute the `CreateSourceDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSourceDocument(vars: CreateSourceDocumentVariables): MutationPromise<CreateSourceDocumentData, CreateSourceDocumentVariables>;

interface CreateSourceDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceDocumentVariables): MutationRef<CreateSourceDocumentData, CreateSourceDocumentVariables>;
}
export const createSourceDocumentRef: CreateSourceDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceDocument(dc: DataConnect, vars: CreateSourceDocumentVariables): MutationPromise<CreateSourceDocumentData, CreateSourceDocumentVariables>;

interface CreateSourceDocumentRef {
  ...
  (dc: DataConnect, vars: CreateSourceDocumentVariables): MutationRef<CreateSourceDocumentData, CreateSourceDocumentVariables>;
}
export const createSourceDocumentRef: CreateSourceDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceDocumentRef:
```typescript
const name = createSourceDocumentRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceDocument` mutation requires an argument of type `CreateSourceDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceDocumentVariables {
  courseId: string;
  fileName: string;
  mimeType: string;
  size?: number | null;
  storagePath: string;
}
```
### Return Type
Recall that executing the `CreateSourceDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceDocumentData {
  sourceDocument_insert: SourceDocument_Key;
}
```
### Using `CreateSourceDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceDocument, CreateSourceDocumentVariables } from '@dataconnect/generated';

// The `CreateSourceDocument` mutation requires an argument of type `CreateSourceDocumentVariables`:
const createSourceDocumentVars: CreateSourceDocumentVariables = {
  courseId: ..., 
  fileName: ..., 
  mimeType: ..., 
  size: ..., // optional
  storagePath: ..., 
};

// Call the `createSourceDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceDocument(createSourceDocumentVars);
// Variables can be defined inline as well.
const { data } = await createSourceDocument({ courseId: ..., fileName: ..., mimeType: ..., size: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceDocument(dataConnect, createSourceDocumentVars);

console.log(data.sourceDocument_insert);

// Or, you can use the `Promise` API.
createSourceDocument(createSourceDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_insert);
});
```

### Using `CreateSourceDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceDocumentRef, CreateSourceDocumentVariables } from '@dataconnect/generated';

// The `CreateSourceDocument` mutation requires an argument of type `CreateSourceDocumentVariables`:
const createSourceDocumentVars: CreateSourceDocumentVariables = {
  courseId: ..., 
  fileName: ..., 
  mimeType: ..., 
  size: ..., // optional
  storagePath: ..., 
};

// Call the `createSourceDocumentRef()` function to get a reference to the mutation.
const ref = createSourceDocumentRef(createSourceDocumentVars);
// Variables can be defined inline as well.
const ref = createSourceDocumentRef({ courseId: ..., fileName: ..., mimeType: ..., size: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceDocumentRef(dataConnect, createSourceDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceDocument_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_insert);
});
```

## UpdateSourceDocument
You can execute the `UpdateSourceDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSourceDocument(vars: UpdateSourceDocumentVariables): MutationPromise<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;

interface UpdateSourceDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceDocumentVariables): MutationRef<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
}
export const updateSourceDocumentRef: UpdateSourceDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSourceDocument(dc: DataConnect, vars: UpdateSourceDocumentVariables): MutationPromise<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;

interface UpdateSourceDocumentRef {
  ...
  (dc: DataConnect, vars: UpdateSourceDocumentVariables): MutationRef<UpdateSourceDocumentData, UpdateSourceDocumentVariables>;
}
export const updateSourceDocumentRef: UpdateSourceDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSourceDocumentRef:
```typescript
const name = updateSourceDocumentRef.operationName;
console.log(name);
```

### Variables
The `UpdateSourceDocument` mutation requires an argument of type `UpdateSourceDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSourceDocumentVariables {
  id: string;
  fileName?: string | null;
  mimeType?: string | null;
  size?: number | null;
  storagePath?: string | null;
  status?: DocumentStatus | null;
}
```
### Return Type
Recall that executing the `UpdateSourceDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSourceDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSourceDocumentData {
  sourceDocument_update?: SourceDocument_Key | null;
}
```
### Using `UpdateSourceDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSourceDocument, UpdateSourceDocumentVariables } from '@dataconnect/generated';

// The `UpdateSourceDocument` mutation requires an argument of type `UpdateSourceDocumentVariables`:
const updateSourceDocumentVars: UpdateSourceDocumentVariables = {
  id: ..., 
  fileName: ..., // optional
  mimeType: ..., // optional
  size: ..., // optional
  storagePath: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSourceDocument(updateSourceDocumentVars);
// Variables can be defined inline as well.
const { data } = await updateSourceDocument({ id: ..., fileName: ..., mimeType: ..., size: ..., storagePath: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSourceDocument(dataConnect, updateSourceDocumentVars);

console.log(data.sourceDocument_update);

// Or, you can use the `Promise` API.
updateSourceDocument(updateSourceDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_update);
});
```

### Using `UpdateSourceDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSourceDocumentRef, UpdateSourceDocumentVariables } from '@dataconnect/generated';

// The `UpdateSourceDocument` mutation requires an argument of type `UpdateSourceDocumentVariables`:
const updateSourceDocumentVars: UpdateSourceDocumentVariables = {
  id: ..., 
  fileName: ..., // optional
  mimeType: ..., // optional
  size: ..., // optional
  storagePath: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceDocumentRef()` function to get a reference to the mutation.
const ref = updateSourceDocumentRef(updateSourceDocumentVars);
// Variables can be defined inline as well.
const ref = updateSourceDocumentRef({ id: ..., fileName: ..., mimeType: ..., size: ..., storagePath: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSourceDocumentRef(dataConnect, updateSourceDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceDocument_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_update);
});
```

## UpdateDocumentStatus
You can execute the `UpdateDocumentStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDocumentStatus(vars: UpdateDocumentStatusVariables): MutationPromise<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;

interface UpdateDocumentStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDocumentStatusVariables): MutationRef<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
}
export const updateDocumentStatusRef: UpdateDocumentStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDocumentStatus(dc: DataConnect, vars: UpdateDocumentStatusVariables): MutationPromise<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;

interface UpdateDocumentStatusRef {
  ...
  (dc: DataConnect, vars: UpdateDocumentStatusVariables): MutationRef<UpdateDocumentStatusData, UpdateDocumentStatusVariables>;
}
export const updateDocumentStatusRef: UpdateDocumentStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDocumentStatusRef:
```typescript
const name = updateDocumentStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateDocumentStatus` mutation requires an argument of type `UpdateDocumentStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDocumentStatusVariables {
  id: string;
  status: DocumentStatus;
  storagePath?: string | null;
}
```
### Return Type
Recall that executing the `UpdateDocumentStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDocumentStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDocumentStatusData {
  sourceDocument_update?: SourceDocument_Key | null;
}
```
### Using `UpdateDocumentStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDocumentStatus, UpdateDocumentStatusVariables } from '@dataconnect/generated';

// The `UpdateDocumentStatus` mutation requires an argument of type `UpdateDocumentStatusVariables`:
const updateDocumentStatusVars: UpdateDocumentStatusVariables = {
  id: ..., 
  status: ..., 
  storagePath: ..., // optional
};

// Call the `updateDocumentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDocumentStatus(updateDocumentStatusVars);
// Variables can be defined inline as well.
const { data } = await updateDocumentStatus({ id: ..., status: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDocumentStatus(dataConnect, updateDocumentStatusVars);

console.log(data.sourceDocument_update);

// Or, you can use the `Promise` API.
updateDocumentStatus(updateDocumentStatusVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_update);
});
```

### Using `UpdateDocumentStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDocumentStatusRef, UpdateDocumentStatusVariables } from '@dataconnect/generated';

// The `UpdateDocumentStatus` mutation requires an argument of type `UpdateDocumentStatusVariables`:
const updateDocumentStatusVars: UpdateDocumentStatusVariables = {
  id: ..., 
  status: ..., 
  storagePath: ..., // optional
};

// Call the `updateDocumentStatusRef()` function to get a reference to the mutation.
const ref = updateDocumentStatusRef(updateDocumentStatusVars);
// Variables can be defined inline as well.
const ref = updateDocumentStatusRef({ id: ..., status: ..., storagePath: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDocumentStatusRef(dataConnect, updateDocumentStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceDocument_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_update);
});
```

## DeleteSourceDocument
You can execute the `DeleteSourceDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceDocument(vars: DeleteSourceDocumentVariables): MutationPromise<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;

interface DeleteSourceDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceDocumentVariables): MutationRef<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
}
export const deleteSourceDocumentRef: DeleteSourceDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceDocument(dc: DataConnect, vars: DeleteSourceDocumentVariables): MutationPromise<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;

interface DeleteSourceDocumentRef {
  ...
  (dc: DataConnect, vars: DeleteSourceDocumentVariables): MutationRef<DeleteSourceDocumentData, DeleteSourceDocumentVariables>;
}
export const deleteSourceDocumentRef: DeleteSourceDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceDocumentRef:
```typescript
const name = deleteSourceDocumentRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceDocument` mutation requires an argument of type `DeleteSourceDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceDocumentVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteSourceDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceDocumentData {
  sourceDocument_delete?: SourceDocument_Key | null;
}
```
### Using `DeleteSourceDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceDocument, DeleteSourceDocumentVariables } from '@dataconnect/generated';

// The `DeleteSourceDocument` mutation requires an argument of type `DeleteSourceDocumentVariables`:
const deleteSourceDocumentVars: DeleteSourceDocumentVariables = {
  id: ..., 
};

// Call the `deleteSourceDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceDocument(deleteSourceDocumentVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceDocument({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceDocument(dataConnect, deleteSourceDocumentVars);

console.log(data.sourceDocument_delete);

// Or, you can use the `Promise` API.
deleteSourceDocument(deleteSourceDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_delete);
});
```

### Using `DeleteSourceDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceDocumentRef, DeleteSourceDocumentVariables } from '@dataconnect/generated';

// The `DeleteSourceDocument` mutation requires an argument of type `DeleteSourceDocumentVariables`:
const deleteSourceDocumentVars: DeleteSourceDocumentVariables = {
  id: ..., 
};

// Call the `deleteSourceDocumentRef()` function to get a reference to the mutation.
const ref = deleteSourceDocumentRef(deleteSourceDocumentVars);
// Variables can be defined inline as well.
const ref = deleteSourceDocumentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceDocumentRef(dataConnect, deleteSourceDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceDocument_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceDocument_delete);
});
```

