# 0008 — Roadmap in vertical slices

- **Status:** accepted
- **Date:** 2026-11-03
- **Supersedes:** the roadmap order in [ADR 0007](0007-planning-with-scrum.md)

## Context

The first roadmap ([ADR 0007](0007-planning-with-scrum.md)) ordered the phases by technical dependency: foundations first, then places and friends, group plans, AI, and bonus modules with the evaluation at the end. Reviewing it as a product plan showed four problems:

- **The riskiest work came last.** The two AI modules are 4 of the 14 core points and the most uncertain part of the project, and they were in phase 5 of 6. A problem there would show up with no time left to react.
- **Points arrived late.** The 14 core points the subject requires were only complete at the end of phase 5.
- **The first phase had nothing to show.** "Foundations" grouped five technical epics; a user could not do anything with its release.
- **Phases were too large.** Each one could last two or three sprints without a release, which means late feedback and little evidence of progress.

The evaluation date is not known yet, and the team has five members.

## Decision

The roadmap follows four principles, in this order:

1. **Risk first.** Uncertain work is explored early with timeboxed **spikes** (label `spike`): research that ends in a decision and an ADR, not in features.
2. **Vertical slices.** Every phase delivers something a user can do from start to end, however small, and ends with a demo and a release.
3. **Core points first.** The 14 core points are complete before any bonus module starts.
4. **Small phases.** One or two sprints each, so there is a release at least every month.

The phases are now:

| Phase                | Release  | Sprints | Core points after it |
| -------------------- | -------- | ------- | -------------------- |
| 1 — Project setup    | `v0.1.0` | —       | —                    |
| 2 — Walking skeleton | `v0.2.0` | 1       | 3                    |
| 3 — Social core      | `v0.3.0` | 2       | 8                    |
| 4 — Group plans      | `v0.4.0` | 2       | 12                   |
| 5 — Recommendations  | `v0.5.0` | 1–2     | 14                   |
| 6 — Bonus            | `v0.6.0` | 2       | 14 + up to 5 bonus   |
| 7 — Evaluation       | `v1.0.0` | 1       | —                    |

Changes from the first roadmap: OAuth moves next to sign-in (it is cheap once accounts exist); the LLM moves to phase 4, because explaining a place does not need group plans and can be built in parallel with WebSockets; two spikes on the AI modules happen in phase 3; the last phase is reserved for the accessibility audit, a bug bash and a rehearsal of the evaluation, with no new features.

**An epic's milestone is the phase in which it closes**, and its sub-issues can belong to earlier phases. For example, the user management epic closes in phase 3, while its first issue (sign up and log in) is in phase 2.

The full table with the epics of each phase is in the [Scrum guide](../guides/scrum.md#roadmap).

## Consequences

- There is a usable product from phase 2 on, and every later phase adds to it. If time runs out, what exists still works.
- The AI uncertainty is resolved by the middle of the project, while there is still time to change the approach.
- With about 10 sprints in total, the plan needs roughly five months. When the evaluation date is known, the PM maps phases to sprints; if there is less time, phase 6 shrinks first, in the order the README gives (public API first, then advanced search).
- More releases mean more release PRs, tags and demos: a small cost for much more frequent feedback.
