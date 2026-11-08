# 0013 — Code folders named backend, frontend and shared

- **Status:** accepted
- **Date:** 2026-11-08
- **Supersedes:** the folder names in [ADR 0001](0001-monorepo.md)

## Context

ADR 0001 put the code in `apps/api`, `apps/web` and `packages/shared`, the usual layout of pnpm and Turborepo monorepos. It is built for repositories with many apps and packages. Miga has exactly three pieces of code, and the team found the generic names harder to read than names that say what each folder holds.

Only the health module existed when this was decided, so renaming cost one pull request and no one's work in progress.

## Decision

- The code lives in three top-level folders: `backend/` (Fastify and Prisma), `frontend/` (React and Vite) and `shared/` (Zod schemas and types).
- The pnpm workspaces are `@miga/backend`, `@miga/frontend` and `@miga/shared`.
- The monorepo itself stays as ADR 0001 decided: one repository, pnpm workspaces, `infra/` and `docs/`.
- Names that describe the running services do not change: the Docker services `api` and `web`, and the commit scopes `api` and `web`.

## Consequences

- Anyone opening the repository sees at once where the backend and the frontend are.
- A new app (for example, end-to-end tests) gets its own top-level folder and is added to `pnpm-workspace.yaml`.
- Commands that filter a workspace use the new names: `pnpm --filter @miga/backend …`.
