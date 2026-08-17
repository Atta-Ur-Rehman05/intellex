# ADR-0007: API Versioning and Contract Strategy

- **Status:** Accepted
- **Date:** 2026-08-17
- **Decision Owners:** Intellex Engineering
- **Related:** ADR-0001 Modular Monolith Architecture, ADR-0002 Technology Stack

## Context

Intellex exposes a REST API consumed by the frontend and potentially other clients in the future.

As the platform evolves, API contracts may change. Breaking changes to endpoints, request schemas, response schemas, authentication behavior, or resource semantics can cause existing clients to fail.

Intellex therefore needs a predictable API versioning and contract strategy from the beginning.

## Decision

Intellex will use **URL-based major API versioning**.

The initial API will use:

```text
/api/v1/