# Running Tests

## Test Suite Structure

| Category | File | Tests | Description |
|----------|------|-------|-------------|
| **Unit** | `unit/unit.spec.ts` | 12 | Utility functions, type definitions, validation logic |
| **API** | `api/api.spec.ts` | 11 | DSPy API endpoints, error handling, Next.js routes |
| **E2E** | `end-to-end/auth.spec.ts` | 6 | Authentication flows, login page, redirects |
| **E2E** | `end-to-end/storage-ui.spec.ts` | 4 | File upload/delete via browser UI |
| **Integration** | `integration/storage.spec.ts` | 4 | Firebase Storage RBAC (SDK-level) |
| **Integration** | `integration/dataconnect.spec.ts` | 4 | Data Connect CRUD operations |
| **Integration** | `integration/functions-trigger.spec.ts` | 2 | Cloud Functions storage triggers |
| | | **43** | **Total** |

### Test Categories

- **Unit Tests**: Pure function testing, type validation, business logic
- **API Tests**: HTTP endpoint testing against DSPy Python backend
- **E2E Tests**: Browser-based tests that open a real browser and interact with the UI
- **Integration Tests**: SDK-level tests against Firebase Emulators (no browser)

## Prerequisites

**Ensure dependencies are installed**:
```bash
npm install
```
This includes dataconnect SDK generation.

## Running All Tests

To run all tests at once, you need three terminals running:

1. **Terminal 1 - Firebase Emulators:**
   ```bash
   firebase emulators:start
   ```

2. **Terminal 2 - DSPy Python Server:**
   ```bash
   uvicorn src.ai.dspy.api:app --reload --port 8001
   ```

3. **Terminal 3 - Next.js Dev Server:**
   ```bash
   npm run dev
   ```

Then run all tests:
```bash
npm run test:e2e
```

### Dependencies per Test Type

| Test | Emulators | DSPy Server | Next.js | Browser |
|------|-----------|-------------|---------|---------|
| Unit | ❌ | ❌ | ❌ | ❌ |
| API | ❌ | ✅ | ❌ | ❌ |
| Auth E2E | ✅ auth | ❌ | ✅ | ✅ |
| Storage UI E2E | ✅ all | ❌ | ✅ | ✅ |
| Storage Integration | ✅ storage,auth | ❌ | ❌ | ❌ |
| DataConnect Integration | ✅ dataconnect | ❌ | ❌ | ❌ |
| Functions Integration | ✅ storage,auth,functions | ❌ | ❌ | ❌ |

To run a specific test file:
```bash
npx playwright test --config=tests/playwright.config.ts <filename>.spec.ts
```

## Unit Tests

Unit tests run without any emulators and test pure functions, types, and validation logic.

```bash
npx playwright test --config=tests/playwright.config.ts unit.spec.ts
```

## API Tests

API tests require the DSPy Python server to be running.

### 1. Start the DSPy Server:
```bash
uvicorn src.ai.dspy.api:app --reload --port 8001
```

### 2. Run API tests:
```bash
npx playwright test --config=tests/playwright.config.ts api.spec.ts
```

## Auth E2E Tests

Auth tests require the Next.js dev server and Firebase Auth emulator.

### 1. Start Firebase Auth Emulator:
```bash
firebase emulators:start --only auth
```

### 2. Start the Next.js dev server (in another terminal):
```bash
npm run dev
```

### 3. Run auth tests:
```bash
npx playwright test --config=tests/playwright.config.ts auth.spec.ts
```

## Data Connect Tests

### Start the Firebase Data Connect Emulator:
```bash
firebase emulators:start --only dataconnect
```
The emulator should be running on port 9399.

### Run all Data Connect tests:
```bash
npm run test:dataconnect
```

### Troubleshooting

#### "Cannot prepare SQL statement" Error

If you see this error:
```
DataConnectError: Cannot prepare SQL statement
pq: unexpected message 'E'; expected ReadyForQuery
```

**Solution**: Restart the Data Connect emulator:
1. Stop the emulator (Ctrl+C)
2. Clear the emulator data (optional but recommended):
   ```bash
   rm -rf dataconnect/.dataconnect/pgliteData
   ```
3. Start the emulator again:
   ```bash
   firebase emulators:start --only dataconnect
   ```

#### Connection Errors

If tests fail with connection errors, verify:
- The emulator is running: Check `http://localhost:9399` or the Firebase Emulator UI
- Port 9399 is not in use by another process
- The emulator logs show no errors

#### Test Isolation

Each test should be independent. If you see flaky tests:
- Ensure the emulator is in a clean state
- Check for race conditions in test setup
- Verify `beforeAll` hooks are working correctly


## Storage UI E2E Tests

The Storage UI E2E tests verify file upload and delete functionality through the browser UI. These are true end-to-end tests that open a real browser, sign in via Firebase Auth emulator, and interact with the course materials page.

### Running Storage UI E2E Tests

1. **Start Firebase Emulators** (all emulators needed):
```bash
firebase emulators:start
```

2. **Start the Next.js dev server** (in another terminal):
```bash
npm run dev
```

3. **Run storage UI tests** (headless):
```bash
npx playwright test --config=tests/playwright.config.ts storage-ui.spec.ts
```

Or with visible browser:
```bash
npx playwright test --config=tests/playwright.config.ts storage-ui.spec.ts --headed
```

### What the Storage UI E2E Tests Do

| Test | Description |
|------|-------------|
| Teacher can upload a file | Signs in, navigates to course materials, uploads a file, verifies it appears in the list |
| Teacher can delete a file | Signs in, uploads a file, clicks delete, verifies it's removed from the list |
| Upload button is disabled | Verifies the Upload button is disabled when no file is selected |
| File input accepts correct types | Verifies the file input accepts `.pdf`, `.ppt`, `.doc`, `.md`, `.txt` |

The tests automatically:
- Sign in using the Firebase Auth emulator popup flow
- Complete the teacher onboarding flow
- Navigate to a course's materials page
- Clean up test files after each test

## Storage Integration Tests

The Storage integration tests focus on role-based access control (RBAC), ensuring only authorized roles (teacher/admin) can upload, update, and delete files, while unauthorized roles (student/unauthenticated) are denied these actions, all according to `storage.rules`.

### Running Storage Tests with Emulator

1. **Start the Firebase Storage and Auth Emulators**:
```bash
firebase emulators:start --only storage,auth
```
The Storage emulator should be running on port 9199, and Auth on port 9099.

2. **Run storage tests**:
```bash
npm run test:storage
```

### What the Storage Tests Do

The storage tests verify:
- Role-based file upload permissions (teacher/admin success, student/unauthenticated failure).
- Role-based file update permissions (teacher/admin success, student/unauthenticated failure).
- Role-based file deletion permissions (teacher/admin success, student/unauthenticated failure).

The tests automatically:
- Use the Storage and Auth emulators.
- Clean up test files after each test (via emulator cleanup).

## Functions Triggers Tests

The Functions Triggers tests verify the behavior of Firebase Cloud Functions that respond to Storage events. These tests ensure that background functions are correctly triggered and execute their intended logic.

### Running Functions Triggers Tests with Emulator

1.  **Start the Firebase Storage, Auth, and Functions Emulators**:
    ```bash
    firebase emulators:start --only storage,auth,functions
    ```
    The Storage emulator should be running on port 9199, Auth on port 9099, and Functions on port 5001 (or as configured). Additionally, a mock HTTP server on port 8000 is used by one of the tests.

2.  **Run functions trigger tests**:
    ```bash
    npm run test:functions
    ```

### What the Functions Triggers Tests Do

The functions trigger tests verify:
-   **`onFileUpload`**: When a file is uploaded to the `/courses/{courseId}/materials/` path, a Cloud Function is triggered. This function should then send a POST request to a file conversion service (mocked in the test).
-   **`onFileDeleted`**: When a file (e.g., `document.pdf`) is deleted from the `/courses/{courseId}/materials/` path, a Cloud Function is triggered. This function should automatically delete any corresponding `.md` file (e.g., `document.md`) in the same location.

The tests automatically:
-   Use the Storage, Auth, and Functions emulators.
-   Include cleanup logic to remove any files created during the test execution, ensuring test isolation and a clean state after each run.