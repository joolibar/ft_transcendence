# 0001 — One repository for the whole project

- **Status:** accepted; the folder names are superseded by [ADR 0013](0013-code-folders.md)
- **Date:** 2026-11-02

## Context

Miga has a web app, an API and a database, built by a team of up to five people. The subject requires the whole project to start with a single command, and many features (for example, reviews) need changes in the web app and the API at the same time.

The alternative is a polyrepo: one repository per part (web, API, infrastructure).

## Decision

Use a single repository (monorepo) managed with **pnpm workspaces**:

- `apps/` — things that run: `web` (React) and `api` (Fastify).
- `packages/` — code shared between apps: `shared` (types and validation schemas).
- `infra/` — infrastructure that belongs to no single app (nginx).
- `docs/` — documentation and these decisions.

## Consequences

- One `git clone` and one `make` start everything.
- A feature that touches the web app and the API is one pull request and one review.
- Every commit is a consistent state of the whole project; there are no versions to keep in sync between repositories.
- Everyone must use pnpm. Mixing package managers corrupts the lockfile.
