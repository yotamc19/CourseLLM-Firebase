# Project Context

## Purpose
CourseLLM-Firebase (Coursewise) is an educational platform that leverages AI to provide personalized learning experiences. The project provides role-based dashboards for students and teachers, integrated authentication via Firebase, and AI-powered course assessment and tutoring via Google Genkit. The core goals are to:
- Enable personalized learning assessment and recommendations
- Provide Socratic-style course tutoring through AI chat
- Support both student and teacher workflows
- Ensure secure, role-based access control

## Tech Stack
- **Frontend Framework**: Next.js 15 with React 18 (TypeScript)
- **Styling**: Tailwind CSS with Radix UI components
- **Backend/Functions**: Firebase Cloud Functions (v2), Firebase Admin SDK
- **Database**: Firebase DataConnect (PostgreSQL via Cloud SQL)
- **Storage**: Firebase Storage with role-based access control
- **Authentication**: Firebase Authentication (Google OAuth) with custom claims for roles
- **AI/ML**:
  - DSPy with Google Gemini for course Q&A, assessment, summarization, and quiz generation
  - Python FastAPI backend (`src/ai/dspy/api.py`) running on port 8001
- **Data**: Firebase DataConnect (GraphQL layer with auto-generated TypeScript types)
- **Testing**: Playwright for E2E, integration, and unit tests (43 tests)
- **Dev Tools**: TypeScript 5, npm, Node.js 22
- **Deployment**: Firebase Hosting, App Hosting

## Project Conventions

### Code Style
- **Language**: TypeScript (strict mode enabled)
- **Formatting**: Follows Next.js and Tailwind CSS conventions
- **Component Architecture**: Server and Client components (React 18+)
  - Suffix client components with `Client.tsx` (e.g., `AuthProviderClient.tsx`)
  - Use Server components by default; mark interactive components as `'use client'`
- **Naming Conventions**:
  - React hooks: `use*` prefix (e.g., `useAuth`, `useMobile`)
  - API routes: `src/app/api/{feature}/route.ts`
  - UI components: `src/components/ui/{component-name}.tsx`
  - Utilities: `src/lib/{feature}.ts` or `src/lib/utils.ts`
  - Types: defined in `src/lib/types.ts`
- **Path Aliases**: Use `@/*` to reference `./src/*` (configured in tsconfig.json)
- **CSS**: Tailwind utility-first with CSS variables for theming

### Architecture Patterns
- **Authentication Flow**:
  - Centralized auth state via React Context (`AuthProviderClient.tsx`)
  - Firebase Auth SDK on client, Admin SDK on server
  - Custom tokens for testing (via test-only `/api/test-token` route)
  - Role-based guards via `RoleGuardClient.tsx` component
- **UI Architecture**:
  - Radix UI primitives as the base component library
  - Shadcn-style component wrappers in `src/components/ui/`
  - App shell layout with sidebar navigation
  - Responsive design with mobile detection hooks
- **AI/ML Integration**:
  - Genkit flows defined in `src/ai/flows/` (e.g., `socratic-course-chat.ts`, `personalized-learning-assessment.ts`)
  - AI models configured in `src/ai/genkit.ts`
  - Server-side AI function execution
- **Data Layer**:
  - DataConnect for strongly-typed GraphQL queries (auto-generated into `src/dataconnect-generated/`)
  - PostgreSQL database via Cloud SQL (managed by DataConnect)
  - Firebase Storage for course materials with security rules enforcing role-based access
- **Storage Security**:
  - Only teachers and admins can upload/delete files (`request.auth.token.role in ['teacher', 'admin']`)
  - All authenticated users can read course materials
  - Security rules defined in `storage.rules`
- **Cloud Functions** (v2):
  - `onFileUpload`: Triggered when files are uploaded to Storage, sends to conversion service
  - `onFileDeleted`: Triggered when files are deleted, cleans up corresponding `.md` files
- **File Structure**:
  ```
  src/
    app/          → Next.js pages and layouts (teacher/, student/, login, onboarding)
    components/   → Reusable React components
    lib/          → Utilities, auth, firebase init, types
    ai/
      dspy/       → DSPy-based AI endpoints (Python FastAPI)
    dataconnect-generated/  → Auto-generated DataConnect types
  functions/    → Firebase Cloud Functions (onFileUpload, onFileDeleted)
  dataconnect/  → DataConnect schema and queries
  tests/        → Playwright tests (unit, integration, e2e, api)
  docs/         → Documentation
  openspec/     → Project specification
  ```

### Testing Strategy
- **Test Suite**: 43 Playwright tests across 4 categories:
  - **Unit tests** (`tests/unit/unit.spec.ts`): Type definitions, validation, utilities
  - **Integration tests** (`tests/integration/`):
    - `storage.spec.ts`: Storage RBAC (teacher/admin can write, students blocked)
    - `dataconnect.spec.ts`: DataConnect CRUD operations
    - `functions-trigger.spec.ts`: Cloud Functions triggers (onFileUpload, onFileDeleted)
  - **E2E tests** (`tests/end-to-end/`):
    - `auth.spec.ts`: Authentication flows (login, onboarding, redirects)
    - `storage-ui.spec.ts`: File upload/delete through UI
  - **API tests** (`tests/api/api.spec.ts`): DSPy endpoints (answer, assess, summarize, quiz)
- **Configuration**: `tests/playwright.config.ts`
- **Running Tests**:
  - Requires: Firebase emulators (`firebase emulators:start`), Next.js dev server (`npm run dev`), DSPy API (`uvicorn src.ai.dspy.api:app --port 8001`)
  - Command: `npm run test:e2e`
- **Test Environment Variables**:
  - `ENABLE_TEST_AUTH=true` (enables test-only routes)
  - Project ID read dynamically from `.firebaserc`

### Git Workflow
- **Primary Branch**: `main` (default)
- **Branching Strategy**: Feature branching (implicit; no formal convention documented)
- **Commit Messages**: No strict convention enforced; keep messages descriptive
- **Pull Requests**: Code review expected before merge to main

## Domain Context
### Educational Platform
- **Users**: Students, Teachers, and Admins (role-based via custom claims)
- **Student Workflow**: Authenticate → Onboarding (select role, department, courses) → Student dashboard → Access course materials and AI tutoring
- **Teacher Workflow**: Authenticate → Onboarding → Teacher dashboard → Manage courses, upload materials, view student progress
- **Course Model**: Courses and SourceDocuments stored in DataConnect (PostgreSQL); materials stored in Firebase Storage
- **AI Features** (via DSPy + Gemini):
  - **Question Answering**: Answer student questions based on course materials (with optional Socratic mode)
  - **Assessment**: Evaluate student answers and provide understanding levels
  - **Summarization**: Generate summaries and key points from course content
  - **Quiz Generation**: Auto-generate quiz questions from materials
- **File Processing**:
  - Teachers upload course materials (PDF, PPT, DOC, MD, TXT)
  - Cloud Function triggers on upload → sends to conversion service
  - Converted files stored as `.md` for AI processing

### Firebase/Google Cloud Ecosystem
- Project uses Firebase emulators locally for development (Firestore, Auth, Functions, DataConnect, Storage)
- Deployment targets: Firebase Hosting + App Hosting for full-stack
- Service account credentials required for server-side operations (testing, admin functions)

## Important Constraints
- **Authentication Security**:
  - Test-only token route (`ENABLE_TEST_AUTH`) must never be enabled in production
  - Custom claims (`role: 'teacher' | 'student' | 'admin'`) set via Admin SDK
  - Storage rules enforce role-based write access (teachers/admins only)
  - Server-side Admin SDK writes bypass security rules (used for onboarding in tests)
- **Client SDK Limitations**:
  - Google OAuth popup flows can be blocked by browser policies (fallback to redirect)
  - Token refresh required after setting custom claims (`getIdToken(true)`)
- **Model Configuration**:
  - AI model: Google Gemini (via DSPy Google provider)
  - DSPy API must be running on port 8001 for AI features
- **Environment Variables**:
  - All Firebase config keys must be prefixed with `NEXT_PUBLIC_` to be accessible in browser
  - Service account JSON for Admin SDK should never be committed to repo
  - Project ID read from `.firebaserc` for portability across environments

## External Dependencies
- **Google Cloud / Firebase**:
  - Firebase Authentication (Google OAuth provider)
  - Firebase Storage (course materials)
  - Firebase Cloud Functions v2 (storage triggers)
  - Firebase App Hosting
  - Firebase DataConnect (PostgreSQL via Cloud SQL)
  - Google Gemini (via DSPy)
- **Python/AI**:
  - DSPy: LLM framework for structured AI outputs
  - FastAPI/Uvicorn: Python web framework for AI API
  - Google GenerativeAI: Gemini model access
- **Frontend**:
  - Radix UI: Accessible, unstyled component primitives
  - Tailwind CSS: Utility-first CSS framework
  - React Hook Form + Zod: Form handling and validation
  - Recharts: Data visualization library
  - Lucide React: Icon library
  - Sonner: Toast notifications
- **Testing**:
  - Playwright: Browser automation for E2E testing
  - Firebase Admin SDK: Server-side testing utilities
