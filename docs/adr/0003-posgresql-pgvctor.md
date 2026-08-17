# ADR-0003: PostgreSQL + pgvector for Relational and Vector Data

* **Status:** Accepted
* **Date:** 2026-08-17
* **Decision Owners:** Intellex Engineering
* **Related:** ADR-0001 Modular Monolith Architecture, ADR-0002 Technology Stack

---

## 1. Context

Intellex requires two major categories of persistent data:

### Relational data

* Users
* Workspaces
* Workspace members
* Documents
* Conversations
* Messages
* Processing states
* Permissions and metadata

### Vector data

* Document chunk embeddings
* Semantic search vectors
* Retrieval metadata

A separate vector database could be introduced alongside PostgreSQL, but this would add another stateful infrastructure component and require additional operational and data-management complexity.

Intellex initially prioritizes architectural simplicity, strong workspace isolation, transactional consistency, and rapid development.

---

## 2. Decision

**PostgreSQL will be the primary system of record, with pgvector used for vector storage and similarity search.**

The initial data architecture is:

```text
                    PostgreSQL
                        │
          ┌─────────────┴─────────────┐
          │                           │
    Relational Data              Vector Data
          │                           │
    Users, Workspaces          Chunk Embeddings
    Documents, Messages         Semantic Search
    Permissions, Metadata       Retrieval Metadata
```

PostgreSQL remains authoritative for application state.

Redis, object storage, and external AI providers do not replace PostgreSQL as the system of record.

---

## 3. RAG Data Model

The document ingestion pipeline will conceptually produce:

```text
Document
   │
   ▼
Text Extraction
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

A document chunk will retain enough metadata to support secure and relevant retrieval.

Conceptually:

```text
document_chunks
├── id
├── document_id
├── workspace_id
├── chunk_index
├── content
├── embedding
└── metadata
```

The exact schema and embedding dimensions will be determined during implementation based on the selected embedding model.

---

## 4. Workspace Isolation

Intellex is a multi-tenant application, therefore vector retrieval must respect workspace boundaries.

A vector similarity search must not operate solely on embedding similarity.

Retrieval must also apply authorization and workspace constraints.

Conceptually:

```text
User Query
    │
    ▼
Query Embedding
    │
    ▼
Vector Search
    │
    ├── workspace filter
    ├── permission constraints
    └── metadata filters
    │
    ▼
Authorized Chunks
```

The frontend must never be trusted to enforce these boundaries.

Workspace/resource authorization is a backend responsibility.

---

## 5. Why PostgreSQL + pgvector?

### Primary reasons

* One primary database
* Strong relational capabilities
* ACID transactions
* Mature indexing and query capabilities
* Vector similarity search through pgvector
* Simplified local development
* Reduced infrastructure and operational overhead
* Easier integration between document metadata, permissions, and vectors
* Straightforward backup and migration strategy

Most importantly, Intellex can perform vector retrieval while retaining relational filters such as:

```text
workspace_id
document_id
user/member access
document status
metadata
```

within the same database architecture.

---

## 6. Alternatives Considered

### PostgreSQL + Dedicated Vector Database

Examples:

* Pinecone
* Weaviate
* Milvus

Rejected initially because the additional infrastructure and synchronization complexity are not justified for Intellex's initial scale.

### Dedicated Vector Database as Primary Storage

Rejected because Intellex still requires a relational system for users, workspaces, permissions, documents, and application state.

### PostgreSQL Without pgvector

Rejected because semantic retrieval is a core Intellex capability and requires native vector storage/search functionality.

---

## 7. Data Ownership

PostgreSQL is the source of truth for:

```text
Application state
+
Document metadata
+
Chunk metadata
+
Embeddings
+
Permissions
```

Original document binaries are **not** stored directly in PostgreSQL.

They belong in the object-storage layer defined by ADR-0004.

---

## 8. Performance and Indexing

Vector search performance will be evaluated using actual Intellex workloads.

The implementation may use pgvector's supported approximate-nearest-neighbor indexing strategies when dataset size justifies them.

Initial optimization priorities are:

1. Correct workspace filtering
2. Correct authorization
3. Query correctness
4. Appropriate relational indexes
5. Vector indexing
6. Performance measurement and tuning

Premature optimization is discouraged.

---

## 9. Consequences

### Positive

* Simplified architecture
* Single primary database
* Easier transactional consistency
* Easier workspace-aware retrieval
* Fewer infrastructure dependencies
* Simpler local development and deployment

### Negative

* Relational and vector workloads share PostgreSQL resources
* Very large vector workloads may require specialized infrastructure
* Vector performance must be monitored as the dataset grows
* pgvector capabilities and database capacity become part of the scaling considerations

---

## 10. Future Migration Criteria

A dedicated vector database should only be considered if measurable requirements justify it.

Potential signals include:

* vector search becomes a significant PostgreSQL bottleneck
* vector dataset size exceeds practical PostgreSQL capacity
* retrieval latency cannot meet product requirements after optimization
* vector workloads interfere with transactional workloads
* specialized vector capabilities become necessary

Until such requirements exist, PostgreSQL + pgvector remains the default vector architecture.

---

## 11. Final Decision

Intellex will use:

```text
PostgreSQL
    +
pgvector
```

as its initial unified relational and vector data layer.

This provides the simplest architecture that satisfies Intellex's current SaaS, multi-tenant, and RAG requirements while preserving a clear migration path if future scale requires specialized vector infrastructure.
