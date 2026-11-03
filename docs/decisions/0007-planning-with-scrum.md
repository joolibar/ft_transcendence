# 0007 — Planning with Scrum on a GitHub Project

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Several people will work on Miga in parallel, from different computers and with different timetables. The subject asks for defined roles (Product Owner, Project Manager, Tech Lead, Developers), clear distribution of work and evidence of how the project was managed. We need one place where anyone can see what is being done, by whom, what comes next and how far each module we claim has got.

[ADR 0005](0005-releases-and-versioning.md) already splits the project into phases that end in releases, but did not define the phases or how work inside them is planned.

## Decision

- **Scrum with two-week sprints**, adapted to a student team: planning, a short daily (it can be async), refinement, review with a demo and retrospective. The Project Manager acts as Scrum Master. The full process is in the [Scrum guide](../guides/scrum.md).
- **A GitHub Project** ([Miga](https://github.com/users/joolibar/projects/7)) is the single board, instead of an external tool. It lives next to the code: issues, pull requests, reviews and merges move cards automatically, and the history stays in one place.
- **Four levels of work:**
  - **Phase**, as a GitHub milestone: a group of epics that ends in a release (`v0.<phase>.0`, `v1.0.0` for the evaluation). Phases are not tied to dates.
  - **Epic**, an issue labelled `epic`: usually one subject module.
  - **Issue**, a sub-issue of an epic: work that fits in one sprint.
  - **Pull request**, which closes its issue.
- **Custom fields** on the board: `Module` (which subject module the work counts for), `Priority` (`P0`–`P2`), `Sprint` (iteration) and `Estimate` (story points).
- **The roadmap** is in the [Scrum guide](../guides/scrum.md#roadmap). Its order follows dependencies: accounts and data before the features that use them, real time before the AI that suggests places for a group, bonus modules last so they can be cut without hurting the core.

## Consequences

- Anyone can answer "what is left for module X?" from the **By module** and **Epics** views, which is also what the evaluation will ask.
- Moving cards depends on discipline: the [Definition of Ready and Done](../guides/scrum.md#definition-of-ready) and the workflows that move cards on merge reduce the manual work, but the PM still checks the board at every daily.
- Some board settings (grouping, sorting, column limits, workflows) cannot be set through the API and are documented as manual steps in the [GitHub setup guide](../guides/github-setup.md#8-project-board--miga-project).
- The board is owned by a user, so its access list is separate from the repository's: every new member must be invited to both.
- The roadmap is a plan, not a contract. It is reviewed at the end of each phase; changing it means moving epics between milestones and updating the roadmap table.
