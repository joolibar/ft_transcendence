# 0003 — Branches, commits and pull requests

- **Status:** accepted; branch names, commit types and scopes extended by [ADR 0010](0010-commit-conventions.md)
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
- Every pull request needs green CI and at least one approval, and is merged with **squash and merge**. While a single member works on the repository, approvals are not required, because GitHub does not let authors approve their own pull requests (see the [GitHub setup guide](../guides/github-setup.md#2-branch-rulesets--settings--rules--rulesets-required)).

## Exception: the first commit

The repository started with a single commit pushed directly to `main` and `develop`, containing the project skeleton. A pull request needs a base branch to compare against, so the very first commit cannot go through one. Every change after it follows the rules above.

## Enforcement

The [`PR conventions`](../../.github/workflows/pr-conventions.yml) workflow checks every pull request:

| Check            | Rule                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Branch name`    | `feature/`, `fix/`, `chore/` or `docs/` + lowercase words separated by hyphens; PRs target `develop`, and only `develop` may target `main`      |
| `PR title`       | Conventional Commits (`type(scope): description`), at most 72 characters, no final period. The title becomes the commit message on squash merge |
| `Commit authors` | See [0004](0004-commit-authorship.md)                                                                                                           |

The rules live in [`check-pr-conventions.cjs`](../../.github/scripts/check-pr-conventions.cjs) and are covered by tests (`node --test '.github/scripts/*.test.cjs'`).

## Consequences

- `main` is always in a state that can be evaluated.
- The history reads as a list of features and fixes, each one traceable to its author and pull request.
- Small branches merged often avoid large conflicts.
