# ADR 001: Separate Frontend Repository

## Status

Accepted

## Context

The AskAU platform involves sensitive infrastructure, including Large Language Models (LLMs), vector databases (for RAG), and enterprise system integrations. Mixing frontend UI code with backend infrastructure code in a single repository increases the risk of accidental exposure of secrets and complicates deployment pipelines.

## Decision

We will maintain the AskAU Frontend in a completely separate Git repository from the AskAU backend platform.

## Consequences

- **Positive**: Strict security boundary. The frontend cannot accidentally import backend infrastructure libraries (e.g., `langchain`, `pgvector`).
- **Positive**: Independent scaling and deployment cycles.
- **Negative**: Requires rigorous API contract management (OpenAPI) to ensure the frontend and backend remain synchronized.
