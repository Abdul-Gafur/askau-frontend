# Architecture Decision Records (ADRs)

This directory contains records of significant architectural decisions made during the development of the AskAU Frontend.

## What is an ADR?

An Architecture Decision Record (ADR) is a short text file that captures an important architectural decision made along with its context and consequences.

## When to write an ADR

Write a new ADR when you are making a decision that will significantly impact:

- The structure of the codebase.
- The technologies or libraries being used.
- Security or authentication flows.
- Performance characteristics.

## How to create a new ADR

1. Create a new markdown file in this directory.
2. Follow the naming convention: `ADR-XXX-short-title.md` (e.g., `ADR-013-state-management.md`).
3. Use the following template:

```markdown
# ADR [Number]: [Title]

## Status

[Proposed | Accepted | Rejected | Deprecated | Superseded]

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?
```
