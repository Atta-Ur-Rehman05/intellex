# ADR-0005: Redis + Background Processing

- **Status:** Accepted
- **Date:** 2026-08-17
- **Decision Owners:** Intellex Engineering
- **Related:** ADR-0001 Modular Monolith Architecture, ADR-0002 Technology Stack, ADR-0003 PostgreSQL + pgvector, ADR-0004 Object Storage

---

## 1. Context

Intellex performs operations that may take significantly longer than a normal API request, including:

- document text extraction
- document parsing
- chunking
- embedding generation
- vector indexing
- document re-processing
- potentially other AI-related operations

These operations should not block an HTTP request until completion.

For example, uploading a 50 MB PDF should not require the client to keep an HTTP connection open while Intellex extracts, chunks, embeds, and indexes the entire document.

The system therefore requires asynchronous background processing.

---

## 2. Decision

Intellex will use **Redis as the initial infrastructure layer for background job queuing and temporary processing state**.

A separate worker process will consume queued jobs.

The architecture will be:

```text
                    Client
                      │
                      ▼
                   FastAPI
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     PostgreSQL                 Redis
     Document                  Job Queue
      Record                      │
                                  ▼
                               Worker
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                 Extract        Chunk         Embed
                                                  │
                                                  ▼
                                             pgvector