# 0005 — Releases and versioning

- **Status:** accepted
- **Date:** 2026-11-02

## Context

[ADR 0003](0003-branching-and-commits.md) says that `main` holds the stable, evaluable version and only receives pull requests from `develop`, but not when that happens or how a version is identified. The roadmap is split into phases, each ending with an internal demo. During the evaluation we must be able to say exactly which version is being shown.

## Decision

- **A release happens at the end of each phase**, after its internal demo works from a clean start (`make clean && make`). Releases are not tied to a calendar.
- A release is a pull request from `develop` into `main`, titled `chore(release): vX.Y.Z`, merged with a **merge commit**. Squashing is not allowed into `main`, because it would leave `main` and `develop` with different histories and every later release would conflict.
- Every release is tagged on `main` with an annotated tag and published as a GitHub Release with generated notes.
- **Version numbers** follow [Semantic Versioning](https://semver.org/) adapted to the project:
  - `v0.<phase>.0` for the release that closes a roadmap phase (`v0.1.0`, `v0.2.0`…).
  - `v0.<phase>.<n>` for a fix released between phases (`v0.2.1`).
  - `v1.0.0` for the version presented in the evaluation.
- There are no hotfix branches into `main`. Bugs are fixed in `develop` and shipped with the next release.

## Consequences

- `main` only moves a few times, and each move is a tested, demonstrated state with a name.
- The tag list doubles as a record of the project's progress for the README's "Project Management" section.
- An urgent fix still goes through review and CI in `develop` first, which is slower but never skips the checks.

The step-by-step procedure is in the [workflow guide](../guides/workflow.md#8-release-to-main).
