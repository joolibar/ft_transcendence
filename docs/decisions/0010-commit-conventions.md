# 0010 — Commit conventions: issue numbers, fixed types and scopes, clean squash commits

- **Status:** accepted
- **Date:** 2026-11-03
- **Extends:** [ADR 0003](0003-branching-and-commits.md)

## Context

[ADR 0003](0003-branching-and-commits.md) set Conventional Commits, four branch prefixes and squash merges, enforced by the `Branch name` and `PR title` checks. Reviewing it before the team starts programming showed five gaps that would make the history less useful:

- **Branches did not say which issue they belong to.** `feature/place-search` cannot be traced to its task without opening the PR.
- **The scope was free text.** `auth`, `authentication` and `login` would all appear for the same area, so the history could not be filtered by area.
- **Common types were missing** (`perf`, `build`, `ci`, `revert`), and nothing said which branch prefix takes which type.
- **Squash commits copied the branch's working commits** into their body ("Pull request title and commit details"), so messages like `wip` or `fix typo` would reach `develop`.
- **Commits inside a branch were only checked when the PR was opened**, through its title.

## Decision

- **Branch names** are `<prefix>/<issue>-<description>`, for example `feature/44-save-places`. Every change has an issue.
- **Types, branch prefixes and scopes** are fixed in one file, [`.github/conventions.json`](../../.github/conventions.json):
  - 11 types: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
  - Each branch prefix takes some types: `feature/` takes `feat` and `perf`; `fix/` takes `fix` and `revert`; `docs/` takes `docs`; `chore/` takes the rest.
  - A closed list of scopes by product area, cross-cutting concern, app, infrastructure and documentation. A new scope is added in its own PR.
- **The `PR title` check** enforces the type, the scope, the type for the branch prefix, a lowercase description, at most 72 characters and no final period. The `Branch name` check enforces the issue number.
- **Squash commits use the PR title only.** The commit in `develop` is one clean line with the PR number; the working commits stay in the PR, which the commit links to.
- **An optional commit hook** ([commitlint](https://commitlint.js.org/), `pnpm hooks:install`) checks every commit message locally with the same file. It is optional so that nobody is blocked by their own machine.
- **How to write a good message** (imperative, why in the body, footers, good and bad examples) is in the [workflow guide](../guides/workflow.md#commit-messages).

## Consequences

- Every commit in `develop` reads like a changelog line and links to its PR, and from there to its issue.
- The history can be filtered by area (`git log --grep '(plans)'`) and by type, and release notes group well.
- Every change needs an issue, including small ones: a minute of extra work that keeps the board and the history complete.
- The scope list has to be maintained: a new area means a small PR to `.github/conventions.json`.
- Reverts made with GitHub's "Revert" button do not follow the branch rule; revert in a `fix/<issue>-revert-…` branch with `git revert` instead.
