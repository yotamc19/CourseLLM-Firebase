# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useInsertUser, useUpdateUser, useDeleteUser, useInsertCourse, useUpdateCourse, useUpsertCourse, useDeleteCourse, useCreateSourceDocument, useUpdateSourceDocument, useUpdateDocumentStatus } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useInsertUser(insertUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUser(deleteUserVars);

const { data, isPending, isSuccess, isError, error } = useInsertCourse(insertCourseVars);

const { data, isPending, isSuccess, isError, error } = useUpdateCourse(updateCourseVars);

const { data, isPending, isSuccess, isError, error } = useUpsertCourse(upsertCourseVars);

const { data, isPending, isSuccess, isError, error } = useDeleteCourse(deleteCourseVars);

const { data, isPending, isSuccess, isError, error } = useCreateSourceDocument(createSourceDocumentVars);

const { data, isPending, isSuccess, isError, error } = useUpdateSourceDocument(updateSourceDocumentVars);

const { data, isPending, isSuccess, isError, error } = useUpdateDocumentStatus(updateDocumentStatusVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { insertUser, updateUser, deleteUser, insertCourse, updateCourse, upsertCourse, deleteCourse, createSourceDocument, updateSourceDocument, updateDocumentStatus } from '@dataconnect/generated';


// Operation InsertUser:  For variables, look at type InsertUserVars in ../index.d.ts
const { data } = await InsertUser(dataConnect, insertUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser:  For variables, look at type DeleteUserVars in ../index.d.ts
const { data } = await DeleteUser(dataConnect, deleteUserVars);

// Operation InsertCourse:  For variables, look at type InsertCourseVars in ../index.d.ts
const { data } = await InsertCourse(dataConnect, insertCourseVars);

// Operation UpdateCourse:  For variables, look at type UpdateCourseVars in ../index.d.ts
const { data } = await UpdateCourse(dataConnect, updateCourseVars);

// Operation UpsertCourse:  For variables, look at type UpsertCourseVars in ../index.d.ts
const { data } = await UpsertCourse(dataConnect, upsertCourseVars);

// Operation DeleteCourse:  For variables, look at type DeleteCourseVars in ../index.d.ts
const { data } = await DeleteCourse(dataConnect, deleteCourseVars);

// Operation CreateSourceDocument:  For variables, look at type CreateSourceDocumentVars in ../index.d.ts
const { data } = await CreateSourceDocument(dataConnect, createSourceDocumentVars);

// Operation UpdateSourceDocument:  For variables, look at type UpdateSourceDocumentVars in ../index.d.ts
const { data } = await UpdateSourceDocument(dataConnect, updateSourceDocumentVars);

// Operation UpdateDocumentStatus:  For variables, look at type UpdateDocumentStatusVars in ../index.d.ts
const { data } = await UpdateDocumentStatus(dataConnect, updateDocumentStatusVars);


```