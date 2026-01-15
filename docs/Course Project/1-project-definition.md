# Project Definition: CourseLLM (CourseWise)

## Formal Documentation with Description of the Analysis Process Using LLM Techniques

---

## 1. Executive Summary

**CourseLLM (CourseWise)** is an AI-powered educational platform designed to provide personalized learning experiences for undergraduate university students, with initial focus on Computer Science courses. The platform leverages Large Language Models (LLMs) to deliver Socratic-style tutoring, personalized assessments, and learning trajectory analytics.

---

## 2. Problem Statement

### 2.1 Educational Challenges Addressed
- **Scalability of Personalized Learning**: Traditional classroom settings cannot provide individualized attention to every student
- **Limited Feedback Loops**: Students lack immediate feedback on their understanding of course material
- **Teacher Insight Gaps**: Instructors have limited visibility into individual student learning trajectories
- **Passive Learning**: Traditional lecture formats don't encourage active engagement with material

### 2.2 Target Users
- **Primary Users**: Undergraduate university students (initially Computer Science)
- **Secondary Users**: Course instructors and teaching assistants

---

## 3. Project Goals and Objectives

### 3.1 Primary Goals
1. **Personalized Learning Assessment**: Enable AI-driven assessment of student knowledge with tailored recommendations
2. **Socratic Tutoring**: Provide AI-powered chat that guides students through concepts using Socratic questioning
3. **Learning Analytics**: Track student interactions to enable teachers to monitor progress and intervene when needed
4. **Role-Based Workflows**: Support differentiated experiences for students and teachers

### 3.2 Success Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Student Engagement | >70% weekly active users | Analytics dashboard |
| Learning Outcome Improvement | 15% grade improvement | Pre/post assessments |
| Teacher Time Savings | 30% reduction in Q&A time | Survey/time tracking |
| System Reliability | 99.5% uptime | Monitoring tools |

---

## 4. LLM Analysis Process

### 4.1 LLM Integration Strategy

The project employs **Google Genkit** with **Gemini 2.5 Flash** as the primary LLM backbone. The analysis process involves:

#### 4.1.1 Content Processing Pipeline
```
[Teacher Upload] → [File Conversion] → [Content Chunking] → [Embedding Generation] → [Vector Storage]
```

1. **Document Ingestion**: Teachers upload course materials (PDF, PPT, DOC, MD)
2. **Content Extraction**: Cloud Functions trigger conversion services to extract text
3. **Semantic Chunking**: Content is split into meaningful segments for retrieval
4. **Embedding Storage**: Chunks are embedded and stored for RAG retrieval

#### 4.1.2 Socratic Chat Analysis Process
```
[Student Query] → [Context Retrieval] → [Prompt Engineering] → [LLM Response] → [Guardrails] → [Delivery]
```

1. **Query Understanding**: Parse student question for intent and topic
2. **RAG Retrieval**: Fetch relevant course material chunks
3. **Socratic Prompting**: Engineer prompts to generate guiding questions rather than direct answers
4. **Response Validation**: Ensure responses align with course material (strict compliance)
5. **Conversation Memory**: Maintain context across multi-turn conversations

#### 4.1.3 Personalized Assessment Analysis
```
[Student Profile] → [Learning History] → [Knowledge Gap Analysis] → [Assessment Generation] → [Feedback Loop]
```

1. **Profile Analysis**: Analyze student's course enrollment and history
2. **Interaction Mining**: Extract patterns from chat history and quiz performance
3. **Gap Identification**: Use LLM to identify knowledge gaps based on interactions
4. **Adaptive Assessment**: Generate personalized questions targeting weak areas
5. **Progress Tracking**: Update student model based on assessment results

### 4.2 LLM Techniques Employed

| Technique | Application | Implementation |
|-----------|-------------|----------------|
| **RAG (Retrieval-Augmented Generation)** | Course-grounded responses | Vector DB + Genkit flows |
| **Prompt Engineering** | Socratic questioning style | Custom system prompts |
| **Few-Shot Learning** | Assessment question generation | Example-driven prompts |
| **Chain-of-Thought** | Complex problem explanations | Step-by-step reasoning |
| **Guardrails** | Content compliance | Tool-based enforcement |

### 4.3 Model Selection Rationale

**Primary Model: Gemini 2.5 Flash**
- **Speed**: Low latency for interactive chat experiences
- **Cost**: Efficient for high-volume educational queries
- **Capability**: Strong reasoning for Socratic dialogue
- **Integration**: Native Google Cloud/Firebase ecosystem support

---

## 5. Scope Definition

### 5.1 In Scope (MVP)
- Google OAuth authentication with role-based access
- Student and Teacher dashboards
- Course material upload (PDF, PPT, DOC, MD)
- AI-powered Socratic chat per course
- Basic personalized assessments
- Teacher analytics on student engagement

### 5.2 Out of Scope (Future Phases)
- Multi-institution deployment
- Mobile native applications
- Real-time collaboration features
- Advanced proctoring for assessments
- Integration with LMS systems (Canvas, Moodle)

---

## 6. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| LLM Hallucinations | Medium | High | Strict RAG grounding + guardrails |
| API Cost Overruns | Medium | Medium | Rate limiting + model tier selection |
| Data Privacy Concerns | Low | High | Firebase security rules + data isolation |
| Scalability Bottlenecks | Medium | Medium | Cloud Functions auto-scaling |
| Student Misuse | Low | Medium | Content moderation + logging |

---

## 7. Stakeholders

| Stakeholder | Role | Responsibilities |
|-------------|------|------------------|
| Course Instructor | Product Owner | Requirements, validation, testing |
| Development Team | Implementers | Design, development, deployment |
| Students (Testers) | End Users | Feedback, usability testing |
| University IT | Infrastructure | Security review, compliance |

---

## 8. Timeline Milestones

| Phase | Deliverables |
|-------|-------------|
| **Phase 1: Foundation** | Authentication, role-based dashboards, basic UI |
| **Phase 2: Content** | File upload, storage, conversion pipeline |
| **Phase 3: AI Core** | Socratic chat, RAG implementation |
| **Phase 4: Assessment** | Personalized assessments, analytics |
| **Phase 5: Polish** | Testing, optimization, deployment |

---

## 9. References

- Google Genkit Documentation
- Firebase Authentication & Firestore Documentation
- "Teaching Machines to Learn: A Survey on AI in Education" - Literature Review
- Socratic Method in Digital Learning Environments - Pedagogical Framework
