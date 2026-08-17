# ADR-0001: Modular Monolith Architecture

* **Status:** Accepted
* **Date:** 2026-08-17
* **Decision Owners:** Intellex Engineering
* **Scope:** Backend application architecture
* **Related:** ADR-0002 Technology Stack

---

## 1. Context

Intellex is an AI-powered knowledge platform designed to allow users and teams to:

* create and manage workspaces
* invite and manage workspace members
* upload and manage documents
* process documents for AI retrieval
* perform semantic search
* communicate with an AI assistant
* ask questions about their knowledge base
* retrieve relevant information using RAG
* manage access to workspace resources

The initial Intellex backend therefore contains several distinct business domains:

* Authentication
* Users
* Workspaces
* Workspace Membership
* Documents
* Document Processing
* Search
* Conversations
* Messages
* RAG
* AI/LLM Integration

The system needs clear separation between these domains while remaining practical to develop, test, deploy, and operate.

Two major architectural approaches were considered:

1. Microservices
2. Monolithic application

A traditional monolith would simplify deployment but could lead to tightly coupled modules and an increasingly difficult-to-maintain codebase.

A microservices architecture would provide independent deployment and scaling, but would introduce substantial distributed-system complexity that is not justified for the initial Intellex implementation.

---

## 2. Decision

Intellex will use a **Modular Monolith Architecture** for its initial production implementation.

Intellex will be deployed as a single backend application, while the internal codebase will be divided into clearly defined business modules.

The application will therefore have:

```text
                    Intellex Backend
                          │
                       FastAPI
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
      Auth            Workspaces         Documents
       │                  │                  │
       │                  │                  ▼
       │                  │             Processing
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
                     AI / RAG
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
              Search             Chat
```

The modules will share the same application process and primary database initially, but each module will maintain clear ownership of its own business logic.

The architecture must allow individual modules to be extracted into independent services in the future if there is a demonstrated need.

---

## 3. Architectural Goals

The modular monolith is selected to achieve the following goals:

### 3.1 Maintainability

Each business domain should have a clear location in the codebase.

Developers should be able to answer:

> "Where does this business logic belong?"

without searching through unrelated modules.

### 3.2 Clear Domain Boundaries

Authentication logic should not be mixed with document processing.

Document processing should not contain workspace authorization logic.

AI provider-specific code should not be spread throughout the application.

### 3.3 Development Speed

Intellex must be developed rapidly without introducing unnecessary distributed-system infrastructure.

A single application allows faster:

* development
* debugging
* testing
* local setup
* deployment

### 3.4 Production Readiness

Although the architecture is initially a monolith, it must not be treated as a prototype or throwaway application.

The codebase should establish boundaries and engineering practices that can support future growth.

### 3.5 Future Extractability

Modules should be designed so that a high-load or independently evolving module can potentially be extracted into a separate service later.

---

# 4. Initial Module Boundaries

The backend will be organized around business capabilities rather than technical layers alone.

The initial modules are:

```text
backend/
└── app/
    │
    ├── auth/
    ├── users/
    ├── workspaces/
    ├── documents/
    ├── processing/
    ├── search/
    ├── chat/
    ├── rag/
    ├── ai/
    └── common/
```

Each module has a specific responsibility.

---

## 4.1 Authentication Module

Responsible for:

* user registration
* login
* logout/token lifecycle
* password hashing
* token generation
* token validation
* authentication dependencies
* authentication-related security logic

It should not contain workspace or document business logic.

Example:

```text
auth/
├── router.py
├── service.py
├── schemas.py
├── dependencies.py
└── security.py
```

---

## 4.2 Users Module

Responsible for user-related domain operations.

Examples:

* user profile
* user information
* account management
* user preferences where applicable

Authentication and user identity are related but should remain conceptually separate.

---

## 4.3 Workspaces Module

Responsible for:

* workspace creation
* workspace updates
* workspace deletion
* workspace membership
* roles within a workspace
* workspace-level authorization

Example:

```text
workspaces/
├── router.py
├── service.py
├── repository.py
├── schemas.py
└── models.py
```

The workspace module is especially important because Intellex is a multi-tenant application.

---

## 4.4 Documents Module

Responsible for document lifecycle management.

Examples:

* upload
* metadata
* listing
* retrieval
* deletion
* document ownership
* document status

The Documents module should manage the document as a business entity.

It should not directly contain the entire document ingestion pipeline.

---

## 4.5 Processing Module

Responsible for asynchronous document processing.

Examples:

* text extraction
* document parsing
* chunking
* embedding generation
* indexing
* processing status
* retry handling

Conceptually:

```text
Document
   │
   ▼
Processing
   │
   ├── Extract
   ├── Chunk
   ├── Embed
   └── Index
```

This separation prevents document CRUD logic from becoming tightly coupled to expensive AI processing.

---

## 4.6 Search Module

Responsible for retrieving relevant information.

Examples:

* semantic search
* vector similarity search
* metadata filtering
* workspace filtering
* search result ranking

Search should not own document upload or user authentication.

---

## 4.7 Chat Module

Responsible for conversational functionality.

Examples:

* conversations
* messages
* conversation history
* user questions
* AI responses
* conversation state

The Chat module can use the RAG and AI modules without owning their internal implementation.

---

## 4.8 RAG Module

Responsible for retrieval-augmented generation orchestration.

The RAG module coordinates:

```text
User Question
      │
      ▼
Query Processing
      │
      ▼
Retrieval
      │
      ▼
Relevant Chunks
      │
      ▼
Context Construction
      │
      ▼
LLM
      │
      ▼
Answer
```

RAG should not directly own:

* user authentication
* workspace CRUD
* document upload
* frontend concerns

---

## 4.9 AI Module

Responsible for communication with external AI providers.

Examples:

* LLM generation
* embeddings
* model configuration
* provider abstraction
* retries
* provider-specific adapters
* AI-related error handling

The application should communicate with an internal AI interface instead of importing provider-specific SDKs throughout the codebase.

Example:

```text
ai/
├── interfaces/
├── providers/
│   └── openai/
├── service.py
└── schemas.py
```

This allows the AI provider to change without rewriting the rest of Intellex.

---

## 4.10 Common Module

The `common` module contains genuinely shared infrastructure.

Examples:

* configuration
* database infrastructure
* logging
* exceptions
* middleware
* utilities
* shared types
* security primitives

The `common` module must not become a dumping ground for arbitrary business logic.

A utility should only be placed here when it is genuinely shared across multiple modules.

---

# 5. Module Structure

Each business module should follow a consistent internal structure where appropriate.

Example:

```text
documents/
├── __init__.py
├── router.py
├── schemas.py
├── service.py
├── repository.py
├── models.py
├── dependencies.py
└── exceptions.py
```

Responsibilities:

### `router.py`

Defines HTTP/API endpoints.

### `schemas.py`

Defines request and response models.

### `service.py`

Contains business logic.

### `repository.py`

Handles persistence-related operations.

### `models.py`

Defines database models owned by the module.

### `dependencies.py`

Contains module-specific FastAPI dependencies where required.

### `exceptions.py`

Contains module-specific domain exceptions.

Not every module must contain every file. The structure should follow actual requirements rather than creating empty abstractions.

---

# 6. Dependency Rules

The most important part of a modular monolith is not the folders.

It is the **dependency rules**.

Modules must not freely depend on each other's internal implementation.

For example, this is discouraged:

```text
Documents
    │
    └── directly accesses
            │
            ▼
Workspaces internal repository
```

Instead:

```text
Documents
    │
    ▼
Workspace service/interface
```

The goal is to make dependencies explicit.

---

# 7. Business Logic Must Not Live in Routers

FastAPI routers should primarily handle:

```text
HTTP Request
     │
     ▼
Validation
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Database
```

Avoid putting complex business logic directly inside:

```python
@router.post(...)
async def create_document(...):
    ...
```

Instead:

```text
Router
   │
   ▼
DocumentService
   │
   ▼
DocumentRepository
```

This improves:

* testability
* maintainability
* separation of concerns
* future service extraction

---

# 8. Repository Responsibility

Repositories are responsible for persistence operations.

For example:

```text
DocumentRepository
```

may handle:

* create document
* get document
* list documents
* delete document
* update document status

The repository should not decide:

> "Is this user allowed to access this workspace?"

That belongs to the appropriate business/service layer.

---

# 9. Service Responsibility

Services contain business rules.

For example:

```text
DocumentService
```

may coordinate:

```text
validate workspace access
        ↓
validate file
        ↓
create document record
        ↓
store file
        ↓
create processing job
```

The service coordinates the domain behavior while repositories handle persistence.

---

# 10. Database Ownership

Although Intellex initially uses one PostgreSQL database, database ownership should follow module boundaries.

Conceptually:

```text
PostgreSQL
│
├── users
├── workspaces
├── workspace_members
├── documents
├── document_chunks
├── conversations
└── messages
```

Each table should have a clearly identified owning module.

For example:

```text
users
    → Users

workspaces
    → Workspaces

documents
    → Documents

document_chunks
    → RAG/Processing
```

A module should avoid directly modifying tables owned by another module unless there is a clearly defined domain-level reason.

---

# 11. Cross-Module Communication

Modules may need to collaborate.

For example:

```text
Chat
 │
 ├── Workspace authorization
 │
 ├── Search
 │
 ├── RAG
 │
 └── AI
```

This is allowed.

However, communication should happen through explicit interfaces or service contracts.

Example:

```text
ChatService
    │
    ▼
RAGService
    │
    ▼
SearchService
```

rather than:

```text
ChatService
    │
    ├── directly queries document tables
    ├── directly generates embeddings
    ├── directly calls OpenAI
    └── directly checks workspace tables
```

The second approach creates tightly coupled code.

---

# 12. Dependency Direction

Intellex should generally follow:

```text
API Layer
    │
    ▼
Application / Service Layer
    │
    ▼
Repository / Infrastructure Layer
    │
    ▼
Database / External Services
```

For AI:

```text
RAG
 │
 ▼
AI Service
 │
 ▼
Provider Adapter
 │
 ▼
OpenAI
```

This allows infrastructure implementations to change without rewriting business logic.

---

# 13. What Modules Must NOT Do

The following practices are explicitly discouraged.

### Do not:

* put business logic inside API routers
* import provider SDKs throughout unrelated modules
* directly access another module's private implementation
* create circular dependencies
* put all logic into `common`
* create generic utility functions without a real need
* let every module directly query every database table
* create abstractions solely for the sake of abstraction
* introduce microservices without a demonstrated requirement

---

# 14. Multi-Tenant Architecture Consideration

Intellex is a workspace-based SaaS application.

Therefore, workspace isolation is a fundamental architectural concern.

Resources should generally have a relationship to a workspace.

For example:

```text
Workspace
    │
    ├── Members
    ├── Documents
    ├── Conversations
    └── Knowledge
```

A request such as:

```text
GET /api/v1/documents
```

must never simply return every document in the database.

The system must determine:

```text
Who is the user?
       │
       ▼
Which workspace?
       │
       ▼
Is the user a member?
       │
       ▼
What permissions do they have?
       │
       ▼
Which resources may they access?
```

Workspace isolation must be enforced server-side.

It must never depend solely on frontend behavior.

---

# 15. API Boundary

The modular monolith will expose a single API.

Example:

```text
/api/v1/
│
├── auth/
├── users/
├── workspaces/
├── documents/
├── search/
└── chat/
```

The fact that modules are internally separated does not mean that each module needs a separate HTTP service.

---

# 16. Background Processing Boundary

Long-running work should not execute synchronously inside normal request handlers.

For example:

```text
POST /documents
        │
        ▼
Create Document
        │
        ▼
Queue Processing Job
        │
        ▼
Return Response
```

The worker then performs:

```text
Extract
   ↓
Chunk
   ↓
Embed
   ↓
Index
```

This maintains a clean boundary between API operations and background processing.

---

# 17. External Service Boundary

External services should be accessed through dedicated infrastructure/adapters.

For example:

```text
Intellex
   │
   ▼
AI Interface
   │
   ▼
OpenAI Adapter
   │
   ▼
OpenAI API
```

Similarly:

```text
Document Service
       │
       ▼
Storage Interface
       │
       ▼
S3 / MinIO
```

This prevents external provider details from leaking throughout the application.

---

# 18. Testing Strategy

The modular architecture should support testing at multiple levels.

### Unit tests

Test individual business functions.

```text
Service
   ↓
Unit Test
```

### Integration tests

Test interactions between:

```text
Service
+
Repository
+
Database
```

### API tests

Test:

```text
HTTP Request
     ↓
FastAPI
     ↓
Service
     ↓
Database
```

### End-to-end tests

Test complete user workflows.

For example:

```text
Register
   ↓
Create Workspace
   ↓
Upload Document
   ↓
Process Document
   ↓
Ask Question
   ↓
Receive RAG Answer
```

---

# 19. Why Not Microservices?

Microservices were explicitly considered and rejected for the initial architecture.

A microservice implementation could look like:

```text
                 API Gateway
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
    Auth Service  Document       Chat Service
                     Service
                       │
                       ▼
                   RAG Service
                       │
                       ▼
                    AI Service
```

This creates additional requirements:

* service-to-service authentication
* network communication
* service discovery
* distributed tracing
* separate deployments
* independent configuration
* distributed transactions
* message infrastructure
* additional monitoring
* more complicated local development

These are valid engineering concerns at sufficient scale, but they are not justified for Intellex's initial implementation.

---

# 20. Why Not a Traditional Monolith?

A traditional monolith might eventually become:

```text
app/
├── models.py
├── routes.py
├── services.py
├── utils.py
└── everything_else.py
```

As the application grows, unrelated functionality becomes increasingly coupled.

For Intellex, this is undesirable because AI/RAG processing has very different responsibilities from authentication, workspace management, and document CRUD.

Therefore, we need the simplicity of a monolith with the boundaries of a modular architecture.

---

# 21. Advantages

The modular monolith provides:

* simple deployment
* simple local development
* straightforward debugging
* shared database transactions
* low infrastructure overhead
* clear business boundaries
* easier testing
* faster development
* easier onboarding
* future extraction opportunities

---

# 22. Disadvantages

The architecture also has limitations.

### Shared deployment

All modules initially deploy together.

### Shared runtime

A problem in one module can potentially affect the application process.

### Shared database

Database workloads are not independently isolated.

### Limited independent scaling

We cannot independently scale the document service from the authentication service while everything remains in one deployment.

### Potential coupling

Poor discipline can still turn a modular monolith into a tightly coupled monolith.

Therefore, module boundaries must be actively maintained.

---

# 23. When Should We Move to Microservices?

Intellex should **not** migrate to microservices simply because:

> "Microservices are more production-ready."

Migration should be driven by an actual requirement.

Possible signals include:

* one module requires dramatically different scaling
* one module needs independent deployment
* one module has significantly different reliability requirements
* teams need to work independently on domains
* deployment frequency differs substantially between domains
* resource requirements become incompatible
* a specific module becomes a clear operational bottleneck

For example, if document processing becomes extremely CPU/GPU intensive:

```text
Current:

FastAPI
  └── Processing

Future:

FastAPI
   │
   ▼
Processing Service
   │
   ▼
Worker Infrastructure
```

Only the part that actually requires independent scaling should be extracted.

---

# 24. Future Extraction Strategy

The modular monolith is intentionally designed to make future extraction possible.

A potential evolution could be:

```text
Phase 1

             Intellex
                │
             FastAPI
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
     Auth    Documents   RAG


Phase 2

             Intellex
                │
        ┌───────┴────────┐
        ▼                ▼
     FastAPI       Processing Service
        │                │
        └───────┬────────┘
                ▼
             Database
```

The architecture does not require us to make that decision today.

---

# 25. Architectural Principles

The following principles will guide Intellex development:

1. **Prefer modularity over premature distribution.**
2. **Keep business domains clearly separated.**
3. **Keep business logic out of HTTP routers.**
4. **Use services for business orchestration.**
5. **Use repositories for persistence operations.**
6. **Hide infrastructure behind appropriate interfaces.**
7. **Keep external provider implementations isolated.**
8. **Enforce workspace isolation server-side.**
9. **Avoid circular dependencies.**
10. **Avoid unnecessary abstractions.**
11. **Prefer asynchronous processing for expensive operations.**
12. **Extract services only when real requirements justify it.**

---

# 26. Decision Summary

Intellex will begin as a **production-oriented modular monolith**.

The system will have:

```text
Single Deployment
       │
       ▼
FastAPI Application
       │
       ├── Auth
       ├── Users
       ├── Workspaces
       ├── Documents
       ├── Processing
       ├── Search
       ├── Chat
       ├── RAG
       └── AI
```

The modules will share infrastructure initially but maintain clear ownership and dependency boundaries.

This approach provides the best balance between:

```text
Development Speed
        +
Maintainability
        +
Production Readiness
        +
Future Scalability
```

without introducing premature distributed-system complexity.

---

## 27. Review Criteria

This decision should be revisited when one or more of the following occurs:

* Intellex reaches significant production scale.
* A module requires independent scaling.
* A module requires independent deployment.
* Infrastructure requirements differ significantly between modules.
* Team ownership becomes distributed across domains.
* Operational evidence demonstrates that the modular monolith has become a bottleneck.

Until such evidence exists, the modular monolith remains the default architecture for Intellex.
