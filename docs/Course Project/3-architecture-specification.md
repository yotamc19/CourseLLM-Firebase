# Architecture Specification: CourseLLM (CourseWise)

## APIs, Components, and System Design

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Next.js 15 Application                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │    │
│  │  │  Auth    │  │ Student  │  │ Teacher  │  │   Shared UI      │    │    │
│  │  │  Pages   │  │Dashboard │  │Dashboard │  │   Components     │    │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘    │    │
│  └───────┼─────────────┼─────────────┼─────────────────┼──────────────┘    │
└──────────┼─────────────┼─────────────┼─────────────────┼────────────────────┘
           │             │             │                 │
           ▼             ▼             ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐      │
│  │  Next.js API    │  │   Firebase      │  │    Google Genkit        │      │
│  │   Routes        │  │   Client SDK    │  │    AI Flows             │      │
│  │  /api/*         │  │   (Auth, FS)    │  │    /ai/*                │      │
│  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘      │
└───────────┼────────────────────┼───────────────────────┼────────────────────┘
            │                    │                       │
            ▼                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE LAYER                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │Firestore │  │ Storage  │  │Functions │  │DataConnect│      │
│  │          │  │          │  │          │  │          │  │ (GraphQL) │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
            │                    │                       │
            ▼                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
│  ┌─────────────────────┐  ┌─────────────────────────────────────────┐       │
│  │  Google GenAI       │  │  Document Conversion Service            │       │
│  │  (Gemini 2.5 Flash) │  │  (Cloud Run / External API)             │       │
│  └─────────────────────┘  └─────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 15, React 18, TypeScript | Web application |
| UI Components | Radix UI, Tailwind CSS | Design system |
| Authentication | Firebase Auth | Google OAuth |
| Database | Firestore | NoSQL document store |
| File Storage | Firebase Storage | Binary file storage |
| Data Layer | Firebase DataConnect | GraphQL API |
| AI/ML | Google Genkit + Gemini | LLM orchestration |
| Backend Functions | Firebase Cloud Functions | Serverless compute |
| Testing | Playwright | E2E testing |

---

## 2. Component Architecture

### 2.1 Frontend Component Hierarchy

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing/login page
│   ├── onboarding/
│   │   └── page.tsx             # New user onboarding
│   ├── student/
│   │   └── dashboard/
│   │       └── page.tsx         # Student dashboard
│   ├── teacher/
│   │   └── dashboard/
│   │       └── page.tsx         # Teacher dashboard
│   └── api/                     # API routes
│       ├── test-token/          # Test-only auth (dev)
│       └── ai/                  # Genkit AI endpoints
│
├── components/
│   ├── ui/                      # Radix UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── AuthProviderClient.tsx    # Auth context provider
│   │   ├── RoleGuardClient.tsx       # Route protection
│   │   └── LoginButton.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── StatsCards.tsx
│   ├── course/
│   │   ├── CourseList.tsx
│   │   ├── MaterialUpload.tsx
│   │   └── MaterialList.tsx
│   └── chat/
│       ├── ChatInterface.tsx
│       ├── MessageList.tsx
│       └── ChatInput.tsx
│
├── lib/
│   ├── firebase.ts              # Firebase client initialization
│   ├── firebase-admin.ts        # Firebase Admin SDK (server)
│   ├── auth.ts                  # Auth utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
│
└── ai/
    ├── genkit.ts                # Genkit configuration
    ├── dev.ts                   # Genkit dev server
    └── flows/
        ├── socratic-course-chat.ts
        └── personalized-learning-assessment.ts
```

### 2.2 Core React Components

#### AuthProviderClient
```typescript
// Purpose: Centralized authentication state management
// Location: src/components/auth/AuthProviderClient.tsx

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Responsibilities:
// - Listen to Firebase Auth state changes
// - Fetch user profile from Firestore
// - Provide auth state to entire app via Context
// - Handle sign-in/sign-out operations
```

#### RoleGuardClient
```typescript
// Purpose: Protect routes based on user roles
// Location: src/components/auth/RoleGuardClient.tsx

interface RoleGuardProps {
  allowedRoles: ('student' | 'teacher')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Responsibilities:
// - Check if user has required role
// - Redirect unauthorized users
// - Show loading state during auth check
```

#### MaterialUpload
```typescript
// Purpose: Handle course material file uploads
// Location: src/components/course/MaterialUpload.tsx

interface MaterialUploadProps {
  courseId: string;
  onUploadComplete: (material: SourceDocument) => void;
}

// Responsibilities:
// - Validate file type and size
// - Upload to Firebase Storage
// - Create DataConnect record
// - Track upload progress
// - Handle errors with toast notifications
```

---

## 3. API Specifications

### 3.1 Next.js API Routes

#### POST /api/test-token (Development Only)
```typescript
// Purpose: Generate custom Firebase tokens for E2E testing
// Security: Only enabled when ENABLE_TEST_AUTH=true

Request Body:
{
  "uid": string,
  "email": string,
  "role": "student" | "teacher"
}

Response:
{
  "token": string  // Firebase custom token
}
```

#### POST /api/ai/socratic-chat
```typescript
// Purpose: Handle Socratic chat interactions
// Security: Requires authenticated user

Request Body:
{
  "courseId": string,
  "message": string,
  "conversationHistory"?: Message[]
}

Response:
{
  "response": string,
  "tokensUsed": number
}
```

### 3.2 Firebase DataConnect API (GraphQL)

#### Queries

```graphql
# Get user profile
query GetUserProfile($uid: String!) {
  user(uid: $uid) {
    uid
    email
    role
    department
    courses
    createdAt
  }
}

# Get course materials
query GetCourseMaterials($courseId: String!) {
  sourceDocuments(where: { courseId: { eq: $courseId } }) {
    id
    filename
    storagePath
    mimeType
    size
    status
    uploadedAt
  }
}
```

#### Mutations

```graphql
# Create source document record
mutation CreateSourceDocument($input: SourceDocumentInput!) {
  createSourceDocument(input: $input) {
    id
    filename
    status
  }
}

# Update document status
mutation UpdateDocumentStatus($id: String!, $status: String!) {
  updateSourceDocument(id: $id, input: { status: $status }) {
    id
    status
  }
}

# Delete source document
mutation DeleteSourceDocument($id: String!) {
  deleteSourceDocument(id: $id) {
    id
  }
}
```

### 3.3 Genkit AI Flows

#### socraticCourseChat
```typescript
// Location: src/ai/flows/socratic-course-chat.ts

const socraticCourseChatFlow = defineFlow({
  name: 'socraticCourseChat',
  inputSchema: z.object({
    courseId: z.string(),
    userMessage: z.string(),
    conversationHistory: z.array(MessageSchema).optional(),
  }),
  outputSchema: z.object({
    response: z.string(),
    suggestedFollowUps: z.array(z.string()).optional(),
  }),
});

// Implementation:
// 1. Retrieve relevant course material chunks (RAG)
// 2. Construct Socratic system prompt
// 3. Include conversation history for context
// 4. Generate response using Gemini 2.5 Flash
// 5. Apply content guardrails
// 6. Return response with optional follow-up suggestions
```

#### personalizedLearningAssessment
```typescript
// Location: src/ai/flows/personalized-learning-assessment.ts

const assessmentFlow = defineFlow({
  name: 'personalizedLearningAssessment',
  inputSchema: z.object({
    userId: z.string(),
    courseId: z.string(),
    topicFocus: z.string().optional(),
  }),
  outputSchema: z.object({
    questions: z.array(QuestionSchema),
    targetedTopics: z.array(z.string()),
    difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
});

// Implementation:
// 1. Fetch user's chat history for the course
// 2. Analyze interaction patterns for knowledge gaps
// 3. Select relevant course material sections
// 4. Generate personalized assessment questions
// 5. Calibrate difficulty based on user performance
```

---

## 4. Data Flow Diagrams

### 4.1 Authentication Flow

```
┌──────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│ User │────▶│  Login    │────▶│  Firebase │────▶│  Google   │
│      │     │  Button   │     │   Auth    │     │  OAuth    │
└──────┘     └───────────┘     └───────────┘     └───────────┘
                                     │
                                     ▼
                              ┌───────────┐
                              │  Auth     │
                              │  State    │
                              │  Changed  │
                              └─────┬─────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             ┌───────────┐                  ┌───────────┐
             │  Query    │                  │  Profile  │
             │ Firestore │                  │  Missing  │
             │  Profile  │                  │           │
             └─────┬─────┘                  └─────┬─────┘
                   │                              │
                   ▼                              ▼
            ┌───────────┐                  ┌───────────┐
            │ Redirect  │                  │ Redirect  │
            │ to Role   │                  │    to     │
            │ Dashboard │                  │ Onboarding│
            └───────────┘                  └───────────┘
```

### 4.2 File Upload Flow

```
┌──────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│Teacher│───▶│  Select   │────▶│  Validate │────▶│  Upload   │
│      │     │   File    │     │ Type/Size │     │ to Storage│
└──────┘     └───────────┘     └───────────┘     └───────────┘
                                                       │
                                                       ▼
                                                ┌───────────┐
                                                │  Create   │
                                                │DataConnect│
                                                │  Record   │
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Trigger  │
                                                │  Cloud    │
                                                │ Function  │
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Convert  │
                                                │  & Index  │
                                                │  Content  │
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Update   │
                                                │  Status   │
                                                │ ANALYZED  │
                                                └───────────┘
```

### 4.3 Socratic Chat Flow

```
┌──────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│Student│───▶│   Enter   │────▶│  Genkit   │────▶│    RAG    │
│      │     │  Question │     │   Flow    │     │ Retrieval │
└──────┘     └───────────┘     └───────────┘     └───────────┘
                                                       │
                                                       ▼
                                                ┌───────────┐
                                                │  Build    │
                                                │  Prompt   │
                                                │ + Context │
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Gemini   │
                                                │   2.5     │
                                                │   Flash   │
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Apply    │
                                                │ Guardrails│
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │   Log     │
                                                │Interaction│
                                                └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  Return   │
                                                │ Socratic  │
                                                │ Response  │
                                                └───────────┘
```

---

## 5. Security Architecture

### 5.1 Authentication Security

```typescript
// Firebase Security Rules (Firestore)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Source documents - teachers can manage their uploads
    match /sourceDocuments/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    // Chat logs - users can read their own, teachers can read all for their courses
    match /chatLogs/{logId} {
      allow read: if request.auth != null
                  && (resource.data.userId == request.auth.uid
                      || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher');
      allow create: if request.auth != null;
    }
  }
}
```

### 5.2 Storage Security

```typescript
// Firebase Storage Rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /courses/{courseId}/{allPaths=**} {
      // Only authenticated teachers can upload/delete
      allow write: if request.auth != null
                   && firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'teacher';
      // All authenticated users can read
      allow read: if request.auth != null;
    }
  }
}
```

### 5.3 API Security

| Endpoint | Auth Required | Role Required | Additional Checks |
|----------|---------------|---------------|-------------------|
| /api/test-token | No | N/A | ENABLE_TEST_AUTH flag |
| /api/ai/socratic-chat | Yes | Any | Rate limiting |
| DataConnect Queries | Yes | Varies | Per-operation rules |
| DataConnect Mutations | Yes | Teacher (for materials) | Ownership validation |

---

## 6. Deployment Architecture

### 6.1 Environment Configuration

```
Development:
├── Firebase Emulators (local)
│   ├── Auth Emulator (port 9099)
│   ├── Firestore Emulator (port 8080)
│   ├── Storage Emulator (port 9199)
│   ├── Functions Emulator (port 5001)
│   └── DataConnect Emulator (port 9399)
├── Next.js Dev Server (port 9002)
└── Genkit Dev UI (port 4000)

Production:
├── Firebase Hosting (static assets)
├── Firebase App Hosting (Next.js SSR)
├── Cloud Firestore (managed)
├── Cloud Storage (managed)
├── Cloud Functions (auto-scaled)
└── Google AI APIs (Gemini)
```

### 6.2 Environment Variables

```bash
# Client-side (NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Server-side only
FIREBASE_SERVICE_ACCOUNT_JSON=  # Admin SDK credentials
GOOGLE_GENAI_API_KEY=           # Gemini API access
ENABLE_TEST_AUTH=false          # MUST be false in production
```

---

## 7. Integration Points

### 7.1 External Service Integrations

| Service | Purpose | Protocol | Auth Method |
|---------|---------|----------|-------------|
| Google OAuth | User authentication | OAuth 2.0 | Firebase managed |
| Google Gemini | LLM inference | REST/gRPC | API Key |
| Document Conversion | Text extraction | REST | Service-to-service |

### 7.2 Internal Module Communication

```
┌─────────────────────────────────────────────────────────────┐
│                    Communication Matrix                      │
├─────────────────┬─────────────────┬─────────────────────────┤
│ From            │ To              │ Method                  │
├─────────────────┼─────────────────┼─────────────────────────┤
│ UI Components   │ Auth Provider   │ React Context           │
│ UI Components   │ DataConnect     │ Generated SDK hooks     │
│ UI Components   │ Storage         │ Firebase SDK direct     │
│ API Routes      │ Genkit Flows    │ Function invocation     │
│ Cloud Functions │ DataConnect     │ Admin SDK               │
│ Cloud Functions │ External APIs   │ HTTP/REST               │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling
- Cloud Functions auto-scale based on request volume
- Firestore handles concurrent reads/writes automatically
- DataConnect connection pooling managed by Firebase

### 8.2 Performance Optimizations
- React Server Components for reduced client bundle
- Firestore composite indexes for complex queries
- CDN caching for static assets via Firebase Hosting
- Connection pooling for Genkit AI calls

### 8.3 Cost Management
- Gemini 2.5 Flash selected for cost-efficiency
- Rate limiting on AI endpoints
- Lazy loading of dashboard components
- Efficient Firestore query design (avoid full collection scans)
