# Specification Documents: CourseLLM (CourseWise)

## Software Requirements Specification (SRS)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for CourseLLM, an AI-powered educational platform for undergraduate courses.

### 1.2 Scope
CourseLLM provides personalized learning experiences through:
- Role-based authentication and dashboards
- Course material management
- AI-powered Socratic tutoring
- Personalized learning assessments
- Teacher analytics and monitoring

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| LLM | Large Language Model |
| RAG | Retrieval-Augmented Generation |
| Genkit | Google's AI orchestration framework |
| DataConnect | Firebase's GraphQL layer over Firestore |
| Socratic Method | Teaching through guided questioning |

---

## 2. Overall Description

### 2.1 Product Perspective
CourseLLM is a standalone web application integrated with:
- Firebase ecosystem (Auth, Firestore, Storage, Functions)
- Google AI services (Genkit with Gemini models)
- External document conversion services

### 2.2 Product Functions
```
┌─────────────────────────────────────────────────────────────┐
│                      CourseLLM System                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Auth      │  │   Course    │  │    AI Services      │  │
│  │   Module    │  │   Module    │  │                     │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤  │
│  │ • Login     │  │ • Upload    │  │ • Socratic Chat     │  │
│  │ • Onboard   │  │ • List      │  │ • Assessment Gen    │  │
│  │ • Role Gate │  │ • Delete    │  │ • Analytics         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency |
|------------|-------------|----------------------|
| **Student** | Undergraduate learners seeking course assistance | Basic |
| **Teacher** | Course instructors managing content and monitoring | Intermediate |
| **Admin** | System administrators (future) | Advanced |

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server**: Firebase/Google Cloud Platform
- **Minimum Requirements**: Internet connection, JavaScript enabled

---

## 3. Functional Requirements

### 3.1 Authentication Module (AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-001 | System SHALL support Google OAuth 2.0 authentication | Must |
| AUTH-002 | System SHALL detect first-time users and redirect to onboarding | Must |
| AUTH-003 | System SHALL store user profiles in Firestore with uid as document ID | Must |
| AUTH-004 | System SHALL support role selection (Student/Teacher) during onboarding | Must |
| AUTH-005 | System SHALL redirect returning users to role-appropriate dashboards | Must |
| AUTH-006 | System SHALL enforce role-based route guards | Must |
| AUTH-007 | System SHALL handle auth state changes in real-time | Must |
| AUTH-008 | System SHOULD support auth persistence across sessions | Should |

### 3.2 User Profile Module (PROF)

| ID | Requirement | Priority |
|----|-------------|----------|
| PROF-001 | System SHALL capture: uid, email, role, department, courses | Must |
| PROF-002 | System SHALL validate role as enum ['student', 'teacher'] | Must |
| PROF-003 | System SHALL support course list as string array (max 10) | Must |
| PROF-004 | System SHALL record createdAt timestamp on profile creation | Must |
| PROF-005 | System SHALL prevent role modification after initial selection | Must |

### 3.3 Course Material Module (MAT)

| ID | Requirement | Priority |
|----|-------------|----------|
| MAT-001 | System SHALL support file uploads: PDF, PPT/PPTX, DOC/DOCX, MD, TXT | Must |
| MAT-002 | System SHALL enforce 10MB maximum file size | Must |
| MAT-003 | System SHALL store files in Firebase Storage | Must |
| MAT-004 | System SHALL store file metadata in DataConnect | Must |
| MAT-005 | System SHALL track upload status: UPLOADING, UPLOADED, ANALYZING, ANALYZED, ERROR | Must |
| MAT-006 | System SHALL handle duplicate uploads by overwriting existing | Must |
| MAT-007 | System SHALL support material deletion (file + metadata) | Must |
| MAT-008 | System SHALL trigger conversion pipeline on upload | Should |
| MAT-009 | System SHOULD display upload progress feedback | Should |

### 3.4 Socratic Chat Module (CHAT)

| ID | Requirement | Priority |
|----|-------------|----------|
| CHAT-001 | System SHALL provide AI chat interface per course | Must |
| CHAT-002 | System SHALL ground responses in uploaded course materials | Must |
| CHAT-003 | System SHALL use Socratic questioning methodology | Must |
| CHAT-004 | System SHALL maintain conversation context within session | Must |
| CHAT-005 | System SHALL log all chat interactions for analytics | Must |
| CHAT-006 | System SHALL enforce content compliance guardrails | Must |
| CHAT-007 | System SHOULD support multi-turn conversations | Should |
| CHAT-008 | System SHOULD handle rate limiting gracefully | Should |

### 3.5 Assessment Module (ASSESS)

| ID | Requirement | Priority |
|----|-------------|----------|
| ASSESS-001 | System SHALL generate personalized assessments based on student profile | Must |
| ASSESS-002 | System SHALL analyze learning gaps from chat history | Must |
| ASSESS-003 | System SHALL provide recommendations based on assessment results | Must |
| ASSESS-004 | System SHOULD adapt difficulty based on student performance | Should |
| ASSESS-005 | System SHOULD track assessment history per student | Should |

### 3.6 Analytics Module (ANALYTICS)

| ID | Requirement | Priority |
|----|-------------|----------|
| ANALYTICS-001 | System SHALL display student engagement metrics to teachers | Must |
| ANALYTICS-002 | System SHALL track chat frequency and topics per student | Must |
| ANALYTICS-003 | System SHALL identify at-risk students based on interaction patterns | Should |
| ANALYTICS-004 | System SHOULD provide exportable reports | Could |

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| PERF-001 | Page load time | < 3 seconds |
| PERF-002 | Chat response latency | < 5 seconds |
| PERF-003 | File upload throughput | 1 MB/s minimum |
| PERF-004 | Concurrent users support | 100+ simultaneous |

### 4.2 Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-001 | All data transmission SHALL use HTTPS/TLS |
| SEC-002 | Firebase Security Rules SHALL enforce user data isolation |
| SEC-003 | Service account credentials SHALL NOT be exposed to client |
| SEC-004 | Test-only routes SHALL be disabled in production |
| SEC-005 | User input SHALL be validated and sanitized |

### 4.3 Usability Requirements

| ID | Requirement |
|----|-------------|
| USE-001 | UI SHALL be responsive across desktop and tablet devices |
| USE-002 | System SHALL provide clear feedback on all user actions |
| USE-003 | Navigation SHALL be consistent across all pages |
| USE-004 | Error messages SHALL be user-friendly and actionable |

### 4.4 Reliability Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| REL-001 | System uptime | 99.5% |
| REL-002 | Data durability | 99.99% (Firebase SLA) |
| REL-003 | Graceful degradation | AI features degrade, core functions remain |

### 4.5 Scalability Requirements

| ID | Requirement |
|----|-------------|
| SCALE-001 | System SHALL leverage Firebase auto-scaling |
| SCALE-002 | Cloud Functions SHALL scale based on demand |
| SCALE-003 | Database queries SHALL be optimized with indexes |

---

## 5. Data Requirements

### 5.1 User Profile Schema
```typescript
interface UserProfile {
  uid: string;           // Primary key (Firebase Auth UID)
  email: string;         // From Google Auth
  role: 'student' | 'teacher';
  department: string;    // Max 50 characters
  courses: string[];     // Max 10 items
  createdAt: Timestamp;  // Server timestamp
}
```

### 5.2 Source Document Schema
```typescript
interface SourceDocument {
  id: string;            // Auto-generated
  courseId: string;      // Reference to course
  filename: string;      // Original filename
  storagePath: string;   // Firebase Storage path
  mimeType: string;      // File MIME type
  size: number;          // File size in bytes
  status: 'UPLOADING' | 'UPLOADED' | 'ANALYZING' | 'ANALYZED' | 'ERROR';
  uploadedBy: string;    // User UID
  uploadedAt: Timestamp;
  analyzedAt?: Timestamp;
}
```

### 5.3 Chat Interaction Schema
```typescript
interface ChatInteraction {
  id: string;
  userId: string;
  courseId: string;
  query: string;
  response: string;
  timestamp: Timestamp;
  tokensUsed: number;
}
```

---

## 6. Interface Requirements

### 6.1 User Interfaces
- **Login Page**: Google Sign-in button, clean centered card
- **Onboarding Page**: Role selection, department input, course tags
- **Student Dashboard**: Course list, chat interface, assessments
- **Teacher Dashboard**: Course management, material upload, analytics

### 6.2 External Interfaces
- **Firebase Auth API**: Authentication flows
- **Firebase Storage API**: File upload/download
- **Firestore API**: Document read/write
- **DataConnect API**: GraphQL queries/mutations
- **Google Genkit API**: AI model invocation
- **Conversion Service API**: Document text extraction

---

## 7. Constraints

### 7.1 Technical Constraints
- Must use Firebase ecosystem for backend services
- Must use Next.js 15 with React 18 for frontend
- AI models limited to Google Genkit-supported providers
- File size limited to 10MB due to Cloud Function limits

### 7.2 Business Constraints
- Initial deployment limited to single university
- MVP scope limited to Computer Science courses
- No paid tier features in initial release

---

## 8. Appendices

### Appendix A: Acceptance Test Scenarios
See separate Test Plan document for detailed test cases.

### Appendix B: UI Mockups
Reference Figma designs (if available) or existing implementation.

### Appendix C: API Contracts
See Architecture Specification for detailed API documentation.
