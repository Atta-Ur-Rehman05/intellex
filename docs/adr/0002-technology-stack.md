# ADR-0002: Technology Stack

* **Status:** Accepted
* **Date:** 2026-08-17
* **Decision Owners:** Intellex Engineering
* **Scope:** Full-stack application and infrastructure
* **Related:** ADR-0001 Modular Monolith Architecture

---

## 1. Context

Intellex is a production-oriented AI knowledge platform that combines:

* multi-user SaaS functionality
* workspace management
* document management
* document processing
* semantic search
* retrieval-augmented generation (RAG)
* AI-powered chat
* authentication and authorization
* background processing
* object storage
* relational data management

The technology stack must support these requirements while remaining:

* maintainable
* secure
* testable
* scalable
* developer-friendly
* suitable for containerized deployment
* practical to implement within the initial development timeline

The stack should also minimize unnecessary infrastructure and avoid introducing technologies whose complexity is not justified by the current requirements.

---

# 2. Decision

Intellex will use the following primary technology stack.

| Layer                 | Technology                        |
| --------------------- | --------------------------------- |
| Frontend Framework    | Next.js                           |
| Frontend Language     | TypeScript                        |
| Frontend Styling      | Tailwind CSS                      |
| UI Components         | shadcn/ui                         |
| Backend Language      | Python                            |
| Backend Framework     | FastAPI                           |
| API Style             | REST                              |
| API Specification     | OpenAPI                           |
| Data Validation       | Pydantic                          |
| ORM                   | SQLAlchemy 2.x                    |
| Database              | PostgreSQL                        |
| Vector Search         | pgvector                          |
| Database Migrations   | Alembic                           |
| Cache                 | Redis                             |
| Background Processing | Redis-backed worker architecture  |
| Object Storage        | S3-compatible storage             |
| Local Object Storage  | MinIO                             |
| Initial LLM Provider  | OpenAI                            |
| Embedding Provider    | Configurable provider abstraction |
| Authentication        | JWT-based authentication          |
| Backend Testing       | Pytest                            |
| Frontend Testing      | Vitest + React Testing Library    |
| End-to-End Testing    | Playwright                        |
| Backend Linting       | Ruff                              |
| Backend Type Checking | MyPy                              |
| Frontend Linting      | ESLint                            |
| Frontend Formatting   | Prettier                          |
| Containerization      | Docker                            |
| Local Orchestration   | Docker Compose                    |
| CI/CD                 | GitHub Actions                    |
| Error Tracking        | Sentry                            |
| Logging               | Structured application logging    |

These technologies form the default technology stack for the initial Intellex implementation.

Major changes to these decisions should be documented through a new or updated ADR.

---

# 3. Frontend Stack

## 3.1 Next.js

Intellex will use **Next.js** as the frontend framework.

### Responsibilities

Next.js will provide:

* application routing
* layouts
* page composition
* frontend rendering
* server/client component architecture where appropriate
* production frontend build
* frontend application structure

The frontend will communicate with the FastAPI backend through the REST API.

Architecture:

```text
User
 │
 ▼
Next.js
 │
 │ HTTPS
 ▼
FastAPI REST API
```

### Why Next.js?

Intellex is a full SaaS application rather than a simple static React application.

The application will contain:

* authentication pages
* dashboard
* workspace interface
* document management
* AI chat
* search
* settings
* potentially public-facing pages

Next.js provides a mature application framework around React and gives Intellex a structured routing and rendering model.

---

# 4. TypeScript

The frontend will use **TypeScript** instead of plain JavaScript.

### Why?

Intellex contains many structured entities:

```text
User
Workspace
WorkspaceMember
Document
Conversation
Message
SearchResult
AIResponse
```

TypeScript allows these contracts to be represented explicitly.

For example:

```text
Frontend
   │
   ▼
TypeScript Types
   │
   ▼
API Response
```

This reduces common runtime errors caused by incorrect assumptions about API data.

TypeScript will also make the codebase easier to maintain as the frontend grows.

---

# 5. Tailwind CSS

Tailwind CSS will be used for application styling.

### Why?

Intellex requires a consistent SaaS interface across:

* dashboard
* sidebar
* workspace pages
* document views
* search interface
* AI chat
* settings
* authentication pages

Tailwind provides a utility-based styling system that allows consistent design without maintaining a large collection of custom CSS files.

---

# 6. shadcn/ui

The frontend will use **shadcn/ui** as the primary reusable UI component foundation.

Potential components include:

* buttons
* dialogs
* dropdowns
* forms
* inputs
* tables
* cards
* tabs
* alerts
* tooltips

The purpose is not to blindly use a component library for everything.

Components should be composed and customized to match Intellex's product design.

---

# 7. Backend Stack

## 7.1 Python

Intellex will use Python for backend development.

### Why?

Python provides a strong ecosystem for:

* AI
* machine learning
* embeddings
* document processing
* NLP
* vector search
* LLM integration

This makes Python particularly appropriate for Intellex because AI/RAG functionality is a core part of the product.

---

# 8. FastAPI

The backend framework will be **FastAPI**.

FastAPI will provide:

* REST API endpoints
* request validation
* dependency injection
* authentication dependencies
* OpenAPI documentation
* asynchronous request handling

The backend will follow a modular architecture as defined in ADR-0001.

Example:

```text
FastAPI
   │
   ├── Auth
   ├── Users
   ├── Workspaces
   ├── Documents
   ├── Search
   ├── Chat
   ├── RAG
   └── AI
```

---

# 9. REST API

Intellex will initially expose a versioned REST API.

Base path:

```text
/api/v1
```

Example:

```text
/api/v1/auth
/api/v1/users
/api/v1/workspaces
/api/v1/documents
/api/v1/search
/api/v1/chat
```

### Why REST?

REST is appropriate for Intellex because:

* the application is primarily resource-oriented
* FastAPI provides excellent REST support
* OpenAPI documentation is generated automatically
* frontend integration is straightforward
* API testing is simple
* the architecture remains easy to understand

GraphQL is not required for the initial implementation.

---

# 10. OpenAPI

FastAPI's OpenAPI support will be used as the primary API specification mechanism.

The API documentation will be available through development tooling such as:

```text
/docs
```

and:

```text
/redoc
```

The OpenAPI specification should remain synchronized with the actual API implementation.

---

# 11. Pydantic

Pydantic will be used for:

* request validation
* response schemas
* configuration validation
* structured data validation

Example:

```text
HTTP Request
     │
     ▼
Pydantic Schema
     │
     ▼
Validated Data
     │
     ▼
Service
```

Pydantic validation will be considered part of the API boundary rather than the business logic itself.

---

# 12. PostgreSQL

PostgreSQL will be Intellex's primary relational database.

It will store data such as:

```text
Users
Workspaces
Workspace Members
Documents
Document Metadata
Conversations
Messages
Processing States
Permissions
```

### Why PostgreSQL?

Intellex has strong relational requirements.

For example:

```text
User
 │
 ├── Workspace Membership
 │
 └── Conversations

Workspace
 │
 ├── Members
 ├── Documents
 └── Knowledge
```

These relationships are naturally represented using a relational database.

PostgreSQL also provides:

* transactions
* constraints
* indexes
* foreign keys
* mature tooling
* strong consistency
* extensibility

---

# 13. SQLAlchemy 2.x

SQLAlchemy 2.x will be used as the ORM/database toolkit.

It will provide:

* database models
* SQL queries
* transactions
* relationship management
* asynchronous database access

Intellex will use SQLAlchemy's modern 2.x API rather than legacy ORM patterns.

The application will use asynchronous database access where appropriate.

---

# 14. Alembic

Alembic will manage database schema migrations.

The workflow will be:

```text
Model Change
     │
     ▼
Alembic Migration
     │
     ▼
PostgreSQL
```

Database schema changes should be version-controlled.

Manual production database modifications should be avoided unless explicitly required for operational recovery.

---

# 15. pgvector

Intellex will use **pgvector** for vector storage and similarity search.

The RAG pipeline will conceptually be:

```text
Document
   │
   ▼
Text
   │
   ▼
Chunks
   │
   ▼
Embeddings
   │
   ▼
PostgreSQL + pgvector
```

This decision is described in greater detail in ADR-0003.

---

# 16. Redis

Redis will be used for infrastructure requirements that benefit from fast in-memory access.

Initial use cases include:

* caching
* rate limiting where appropriate
* temporary application state
* supporting background job processing

Redis should not become the primary source of truth for permanent business data.

PostgreSQL remains the authoritative application database.

---

# 17. Background Processing

Document processing will use asynchronous background processing.

Typical operations include:

```text
PDF parsing
Text extraction
Chunking
Embedding generation
Vector indexing
```

The API should not synchronously execute the entire pipeline during an upload request.

Conceptually:

```text
Upload
  │
  ▼
FastAPI
  │
  ├── Store document
  ├── Create database record
  └── Queue processing job
             │
             ▼
           Worker
             │
             ├── Extract
             ├── Chunk
             ├── Embed
             └── Index
```

The exact worker implementation may evolve, but the architectural requirement is that expensive document processing remains asynchronous.

---

# 18. Object Storage

Uploaded documents will be stored in S3-compatible object storage.

Examples:

```text
PDF
DOCX
TXT
Images
```

The database will store metadata and a storage key rather than the complete binary file.

Example:

```text
PostgreSQL
└── storage_key:
    workspaces/123/documents/456/file.pdf

Object Storage
└── workspaces/
    └── 123/
        └── documents/
            └── 456/
                └── file.pdf
```

---

# 19. MinIO

MinIO will be used as an S3-compatible object storage implementation for local development where appropriate.

This allows development to closely resemble production object-storage behavior without requiring a cloud bucket for every developer environment.

Production storage may use:

* Amazon S3
* another S3-compatible provider

The application should interact with an object-storage abstraction rather than hard-coding provider-specific behavior.

---

# 20. AI / LLM Stack

AI functionality is a core part of Intellex.

The initial LLM provider will be OpenAI.

However, Intellex will not allow provider-specific SDK calls to spread throughout the application.

The architecture will be:

```text
Intellex Application
        │
        ▼
     AI Service
        │
        ▼
 Provider Interface
        │
        ▼
 OpenAI Adapter
        │
        ▼
   OpenAI API
```

The provider implementation will be isolated.

The detailed provider abstraction is defined in ADR-0006.

---

# 21. Embeddings

Intellex requires embeddings for semantic retrieval.

The embedding layer will therefore be provider-agnostic.

Conceptually:

```text
Text Chunk
    │
    ▼
Embedding Service
    │
    ▼
Embedding Provider
    │
    ▼
Vector
    │
    ▼
pgvector
```

Embedding model selection should be configurable rather than scattered through business logic.

---

# 22. Authentication

Intellex will use JWT-based authentication.

The authentication architecture will use:

```text
Short-lived Access Token
+
Refresh Token
```

Authentication and authorization remain separate concerns.

Authentication determines:

> Who is the user?

Authorization determines:

> What can that user access?

Workspace-level authorization is particularly important because Intellex is a multi-tenant SaaS platform.

The detailed authentication decision is documented in ADR-0007.

---

# 23. Testing Stack

Intellex will use different testing tools for different layers.

## Backend

```text
Pytest
pytest-asyncio
HTTPX
```

These will support:

* unit testing
* service testing
* API testing
* integration testing

## Frontend

```text
Vitest
React Testing Library
```

These will support component and frontend logic testing.

## End-to-End

```text
Playwright
```

will be used for critical user journeys when appropriate.

Example:

```text
Register
   ↓
Login
   ↓
Create Workspace
   ↓
Upload Document
   ↓
Wait for Processing
   ↓
Ask AI Question
   ↓
Receive Answer
```

---

# 24. Code Quality

The backend will use:

```text
Ruff
MyPy
```

Ruff will handle Python linting and formatting-related workflows.

MyPy will provide static type checking where practical.

The frontend will use:

```text
ESLint
Prettier
TypeScript
```

The goal is to detect errors before code reaches production.

---

# 25. Containerization

Docker will be used to provide reproducible development and deployment environments.

Local development will use Docker Compose where appropriate.

The initial infrastructure may include:

```text
Docker Compose
│
├── PostgreSQL
├── Redis
└── MinIO
```

The application containers may be added as the project foundation is implemented.

---

# 26. CI/CD

GitHub Actions will be used for continuous integration.

The initial CI pipeline should eventually perform:

```text
Push / Pull Request
        │
        ▼
Install Dependencies
        │
        ▼
Lint
        │
        ▼
Type Check
        │
        ▼
Run Tests
        │
        ▼
Build
```

Deployment automation can be added once the production deployment target is established.

---

# 27. Logging

Intellex will use structured application logging.

Logs should contain useful operational information such as:

* timestamp
* log level
* request identifier
* relevant resource identifier
* operation
* error information

Sensitive information must not be written to logs.

The application must never log:

* passwords
* access tokens
* refresh tokens
* API keys
* secret credentials
* sensitive document contents

---

# 28. Error Tracking

Sentry will be considered the initial error tracking platform.

The purpose is to detect and investigate unexpected production failures.

Error tracking should complement application logs rather than replace them.

The implementation must ensure sensitive information is not unintentionally transmitted to the error tracking system.

---

# 29. Configuration Management

Application configuration will be supplied through environment variables.

Examples include:

```text
DATABASE_URL
REDIS_URL
SECRET_KEY
OPENAI_API_KEY
S3_ENDPOINT
S3_ACCESS_KEY
S3_SECRET_KEY
SENTRY_DSN
```

Secrets must not be committed to Git.

The repository will provide:

```text
.env.example
```

containing variable names and safe example values/placeholders.

---

# 30. Local Development Architecture

The local development environment should approximate the production architecture while remaining simple.

Conceptually:

```text
                 Local Development
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
    Next.js          FastAPI         Infrastructure
                                         │
                              ┌──────────┼──────────┐
                              ▼          ▼          ▼
                         PostgreSQL   Redis      MinIO
```

The AI provider remains an external service during development unless a local model is intentionally introduced later.

---

# 31. Production Architecture

The production architecture is expected to follow the same logical boundaries:

```text
                       Internet
                           │
                           ▼
                    Frontend / CDN
                           │
                           ▼
                      FastAPI API
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     PostgreSQL          Redis         Object Storage
          │
          │
          ▼
       pgvector
          │
          ▼
      AI Services
```

The exact cloud provider and deployment platform are intentionally not fixed in this ADR.

Infrastructure-specific decisions should be documented separately when deployment planning begins.

---

# 32. Technology Selection Principles

Technology choices for Intellex will follow these principles:

### 32.1 Prefer simplicity

Do not introduce a technology unless it solves a real problem.

### 32.2 Prefer mature ecosystems

Core infrastructure should use technologies with strong documentation, community support, and production adoption.

### 32.3 Prefer interoperability

Components should communicate through well-defined interfaces and standard protocols.

### 32.4 Avoid unnecessary vendor lock-in

External AI and storage providers should be isolated behind application-level abstractions where practical.

### 32.5 Optimize for the current scale

Intellex should not be architected for hypothetical internet-scale traffic before there is evidence that such scale is required.

### 32.6 Keep future migration possible

Important infrastructure choices should avoid making future alternatives unnecessarily difficult.

---

# 33. Technologies Explicitly Not Selected Initially

The following technologies are intentionally not part of the initial Intellex stack.

## Dedicated Vector Database

Examples:

* Pinecone
* Weaviate
* Milvus

Reason:

PostgreSQL + pgvector provides sufficient vector capabilities while reducing infrastructure complexity.

See ADR-0003.

---

## MongoDB

Reason:

Intellex has strong relational requirements involving:

```text
Users
Workspaces
Memberships
Documents
Permissions
Conversations
```

PostgreSQL provides a better fit for these relationships.

---

## GraphQL

Reason:

The initial Intellex API is resource-oriented and REST provides sufficient flexibility and simpler operational requirements.

GraphQL can be reconsidered if frontend data requirements become significantly more complex.

---

## Microservices

Reason:

Microservices are intentionally deferred.

See ADR-0001.

---

## Kubernetes

Reason:

Kubernetes would introduce significant operational complexity that is not justified during the initial implementation.

Containerization with Docker and a suitable deployment platform is sufficient initially.

---

## Multiple LLM Providers

Intellex will initially use one primary provider.

Provider abstraction will be implemented so additional providers can be introduced when there is a real requirement.

---

# 34. Technology Introduction Rule

Before introducing a major new technology, the following questions should be answered:

1. What problem does it solve?
2. Can the existing stack solve the problem adequately?
3. What operational complexity does it introduce?
4. Does it create another source of truth?
5. Does it create vendor lock-in?
6. How will it be tested?
7. How will it be deployed?
8. How will it be monitored?
9. Does it fit the existing architecture?
10. Does the decision require a new ADR?

If the technology introduces a significant architectural change, a new ADR should be created before implementation.

---

# 35. Consequences

## Positive Consequences

The selected stack provides:

* strong AI ecosystem support
* mature relational database infrastructure
* integrated vector search
* modern frontend development
* strong API documentation
* type safety
* automated testing
* containerized development
* straightforward CI/CD
* future provider flexibility
* relatively low infrastructure complexity

The technologies also work well together:

```text
Next.js
   │
   ▼
FastAPI
   │
   ├── PostgreSQL
   ├── Redis
   ├── Object Storage
   └── AI Provider
```

---

## Negative Consequences

The stack still introduces several operational components:

```text
PostgreSQL
Redis
Object Storage
AI Provider
Frontend
Backend
```

Developers must understand how these systems interact.

The stack also creates several areas requiring careful engineering:

* asynchronous processing
* database migrations
* AI provider failures
* vector indexing
* file storage security
* authentication
* workspace authorization
* background job failures

---

# 36. Security Considerations

Technology choices must not compromise application security.

The implementation must include:

* secure secret management
* password hashing
* token protection
* server-side authorization
* workspace isolation
* input validation
* file validation
* secure object-storage access
* rate limiting
* safe logging
* dependency updates
* HTTPS in production

Security decisions that require significant architectural choices should be documented separately.

---

# 37. Performance Considerations

The selected technologies provide sufficient performance for the initial Intellex scale.

Performance-sensitive areas include:

* database queries
* vector similarity search
* document ingestion
* embedding generation
* LLM requests
* background job processing
* file uploads

Performance optimization should be evidence-driven.

Premature introduction of distributed infrastructure is discouraged.

---

# 38. Scalability Strategy

Intellex will initially scale primarily through vertical scaling and horizontal scaling of the application where supported.

Potential future scaling paths include:

```text
Current

FastAPI
   │
   ├── PostgreSQL
   ├── Redis
   └── Object Storage


Future

Load Balancer
      │
 ┌────┼────┐
 ▼    ▼    ▼
API  API   API
 │    │    │
 └────┼────┘
      ▼
 PostgreSQL
      │
      └── pgvector
```

If specific workloads become bottlenecks, they may be independently scaled or extracted according to the principles established in ADR-0001.

---

# 39. Decision Review

This technology stack should be reviewed when:

* Intellex reaches significantly larger scale
* a selected technology becomes a performance bottleneck
* a technology becomes unsupported
* operational requirements change
* a new business requirement cannot reasonably be satisfied by the current stack
* infrastructure costs become significant
* security requirements change
* a major architectural migration becomes justified

Technology changes should be evidence-driven rather than trend-driven.

---

# 40. Final Decision Summary

Intellex will use a modern, production-oriented stack centered around:

```text
Frontend
    Next.js + TypeScript
            │
            ▼
Backend
    FastAPI + Python
            │
            ▼
Database
    PostgreSQL + pgvector
            │
      ┌─────┴─────┐
      ▼           ▼
    Redis      Object Storage
      │
      ▼
Background Processing
      │
      ▼
AI/RAG
      │
      ▼
LLM Provider
```

The stack prioritizes:

```text
Simplicity
    +
Maintainability
    +
AI Compatibility
    +
Production Readiness
    +
Future Scalability
```

The selected technologies are the default implementation choices for Intellex.

Any significant deviation from this stack should be evaluated against the technology selection principles and documented through an appropriate architectural decision.
