# CourseWise – How to Run (Local)

## 1. Purpose

This README explains how to run the CourseLLM app locally. It covers environment setup, running the 3 required services (Firebase emulators, Python backend, Next.js frontend), testing, authentication, and technical details about the project structure, dependencies, DataConnect schema, and DSPy API.

---

## 2. Environment config (`.env.local`)

1. From the **project root folder** (main folder of the repo), copy the example file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in the Firebase web config using the values from  
   **Firebase Console → Project settings → General → SDK setup & configuration**:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Make sure the Firebase project id is the same in all of these places:

   - `.firebaserc` → `projects.default`
   - `.env.local` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `.env.local` → `FIREBASE_PROJECT_ID`

4. Leave the emulator host variables as in `.env.local.example`:

   - `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
   - `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`
   - `FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199`

---

## 3. Prerequisites

- Node.js (LTS) + npm / pnpm
- Python 3.x
- Firebase CLI:
  ```bash
  npm install -g firebase-tools
  firebase login
  ```
- From the **project root folder**:
  ```bash
  python -m venv .venv

  # Windows
  .venv\Scripts\activate
  # macOS / Linux
   source .venv/bin/activate

  pip install -r requirements.txt
  npm install
  ```

---

## 4. Run (3 terminals)

> **Note:** All commands in this section should be run from the **main folder of the project**  
> (the folder that contains `package.json`, `firebase.json`, and `README.md`).

### 4.1 Terminal 1 – Firebase Emulators

In **Terminal 1**:

```bash
npm run emulators
```

This command automatically builds the Firebase Functions before starting the emulators.

- Firestore emulator: `127.0.0.1:8080`
- Storage emulator: `127.0.0.1:9199`
- Auth emulator: `127.0.0.1:9099`
- Emulator UI: `http://127.0.0.1:4000`

Leave this running.

---

### 4.2 Terminal 2 – Python Backend (DSPy API)

In **Terminal 2**, with the virtualenv activated:

```bash
# Windows:
   .venv\Scripts\activate
# macOS / Linux:
   source .venv/bin/activate

uvicorn src.ai.dspy.api:app --reload --port 8001
```

Backend runs at: `http://127.0.0.1:8001`

---

### 4.3 Terminal 3 – Next.js Frontend

In **Terminal 3**:

```bash
npm run dev
```

The dev script is configured to run on port **9002**, so the frontend is at:

- `http://localhost:9002`

---

## 5. Running Tests

With all 3 terminals running (emulators, Python backend, Next.js), run:

```bash
npm run test:e2e
```

This runs all 43 tests (unit, API, E2E, and integration tests).

---

## 6. Ports Summary

- Emulator UI: `http://127.0.0.1:4000`
- Firestore emulator: `127.0.0.1:8080`
- Storage emulator: `127.0.0.1:9199`
- Auth emulator: `127.0.0.1:9099`
- Backend (DSPy API): `http://127.0.0.1:8001`
- Frontend (Next.js dev): `http://localhost:9002`
- Monitoring dashboard: `http://localhost:9002/admin/monitoring`

---

## 7. How to Login

**Authentication method:** Firebase Authentication with Google Sign-In (OAuth 2.0)

Navigate to `http://localhost:9002/login` and click "Sign in with Google".
- New users are redirected to `/onboarding` to complete their profile
- Returning users go directly to their dashboard (`/student` or `/teacher`)

---

## 8. Project Structure

```
CourseLLM-Firebase/
├── docs/                         # Documentation
│   ├── Course Project/           # Project specifications (see table below)
│   └── [other]                   # Auth/, File Upload/
├── tests/                        # Playwright E2E tests
└── [other]                       # src/, dataconnect/, functions/, config files
```

### Course Project Documentation

| # | Required Document | File |
|---|---|---|
| 1 | Project definition | `docs/Course Project/1-project-definition.md` |
| 2 | Specification documents | `docs/Course Project/2-specification-documents.md` |
| 3 | Architecture specification (APIs, components) | `docs/Course Project/3-architecture-specification.md` |
| 4 | Project report and AI process analysis | `docs/Course Project/4-project-report-ai-analysis.md` |

---

## 9. Dependencies

### JavaScript / Next.js

Main dependencies are defined in `package.json`:

- **Core:** `next`, `react`, `react-dom`
- **UI & forms:** `@radix-ui/*`, `lucide-react`, `react-hook-form`, `zod`, `tailwind-merge`, `tailwindcss-animate`
- **Firebase & Genkit:** `firebase`, `firebase-admin`, `genkit`, `@genkit-ai/next`, `@genkit-ai/google-genai`
- **Other helpers:** see full list in `package.json`

### Python backend

Python dependencies are defined in `requirements.txt`:

- `dspy-ai`
- `google-generativeai`
- `fastapi`
- `uvicorn[standard]`
- `pydantic`
- `python-dotenv`

### External services / tools

- **Firebase** (Auth, Firestore, Storage, Emulators, Firebase CLI)
- **Google / Gemini** API (for LLM calls, via Genkit and `google-generativeai`)
- **Node.js + npm** (for the frontend, Next.js)
- **Python 3.x** (for the DSPy backend)

---

## 9. Production Environment

For production deployment, create a `.env` file (not `.env.local`) with production Firebase values:

```bash
# Firebase Production Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google AI (Genkit)
GOOGLE_API_KEY=your-google-api-key

# Do NOT set emulator host variables in production
```

**Note:** Do not include `FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST`, or `FIREBASE_STORAGE_EMULATOR_HOST` in production - these should only be set for local development.

---

## 10. DataConnect (PostgreSQL)

This project uses Firebase DataConnect with Cloud SQL (PostgreSQL).

### Schema

Located in `dataconnect/schema/schema.gql`:

```graphql
enum DocumentStatus {
  UPLOADING, UPLOADED, CONVERTING, CONVERTED,
  CHUNKING, CHUNKED, ANALYZING, ANALYZED, ERROR
}

type User @table {
  id: String! @default(expr: "uuidV4()")
  username: String
}

type Course @table {
  id: String!
  title: String!
  description: String
}

type SourceDocument @table {
  id: String! @default(expr: "uuidV4()")
  course: Course!
  fileName: String!
  mimeType: String!
  size: Int
  storagePath: String!
  status: DocumentStatus!
  updatedAt: Timestamp @default(expr: "request.time")
}
```

### Connector

Located in `dataconnect/example/`:
- `connector.yaml` - Configuration for SDK generation
- `queries.gql` - GraphQL queries (ListUsers, GetUser, ListCourses, GetCourse, ListSourceDocuments, etc.)
- `mutations.gql` - GraphQL mutations for CRUD operations

### Generated SDKs

After running `npm install` (which triggers `npm run dataconnect:generate`):
- `src/dataconnect-generated/` - JavaScript SDK with React bindings
- `src/dataconnect-admin-generated/` - Admin Node SDK for server-side operations

---

## 11. DSPy Backend API (overview)

The Python backend exposes a small HTTP API (FastAPI) on `http://127.0.0.1:8001`.  
The Next.js app calls these endpoints via server actions in  
`src/app/student/courses/[courseId]/dspy-actions.ts`.

All endpoints are **POST** and use JSON.

### 11.1 `POST /answer`

- **Purpose:** Answer a student's question using course materials.
- **Request body:**
  - `course_materials`: array of strings
  - `question`: string
  - `use_socratic`: boolean (optional, default false)
- **Response:**
  - `response`: string
  - `type`: string

### 11.2 `POST /assess`

- **Purpose:** Assess a student's answer and provide feedback.
- **Request body:**
  - `question`: string
  - `student_answer`: string
  - `correct_answer`: string
  - `topic`: string
- **Response:**
  - `assessment`: string
  - `understanding_level`: string
  - `follow_up_questions`: array of strings

### 11.3 `POST /summarize`

- **Purpose:** Summarize course materials.
- **Request body:**
  - `materials`: array of strings
- **Response:**
  - `summary`: string
  - `key_points`: array of strings

### 11.4 `POST /quiz`

- **Purpose:** Generate quiz questions from course material.
- **Request body:**
  - `material_content`: string
  - `difficulty`: string (optional, default "medium")
  - `num_questions`: number (optional, default 5)
- **Response:**
  - `questions`: array of question objects

For exact schemas, see the Pydantic models in `src/ai/dspy/api.py`.

