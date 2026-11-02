# 0003 — Branches, commits and pull requests

- **Status:** accepted
- **Date:** 2026-11-02

## Context

Five people will work in parallel. The subject evaluates the Git history: every member must have clear commits and the work must be well distributed. Nobody should be able to break the version that is evaluated.

## Decision

- **`main`** holds the stable, evaluable version. Protected: changes only arrive through a pull request from `develop`.
- **`develop`** is the integration branch and the default branch on GitHub. Protected: changes only arrive through pull requests.
- Work happens in short-lived branches created from `develop`:
  - `feature/<short-description>` — new functionality
  - `fix/<short-description>` — bug fixes
  - `chore/<short-description>` — tooling, configuration, dependencies
  - `docs/<short-description>` — documentation only
- Commits follow **Conventional Commits** in English (`feat(auth): add sign-up endpoint`).
- Every pull request needs green CI and at least one approval, and is merged with **squash and merge**.

## Consequences

- `main` is always in a state that can be evaluated.
- The history reads as a list of features and fixes, each one traceable to its author and pull request.
- Small branches merged often avoid large conflicts.
