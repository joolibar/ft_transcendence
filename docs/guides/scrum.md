# Scrum guide

How the team plans and tracks work. The [workflow guide](workflow.md) explains what happens to one task in Git; this guide explains how tasks are chosen, sized and followed on the [project board](https://github.com/users/joolibar/projects/7).

## Roles

The subject asks for these roles; this is what each one does in our Scrum process.

| Role                      | In Scrum      | Responsibilities                                                                                                                           |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Product Owner (PO)        | Product Owner | Owns the backlog: writes and orders epics and issues, decides what "done" means for the product, accepts the work at the sprint review.    |
| Project Manager (PM)      | Scrum Master  | Runs the events, keeps the board truthful, watches the sprint and removes blockers, protects the team from work that is not in the sprint. |
| Tech Lead                 | Developer     | Technical decisions and ADRs, architecture and code quality, splits technical work, reviews the hardest PRs.                               |
| Developers (every member) | Developers    | Estimate, pick work from the sprint, build, test, review each other's PRs.                                                                 |

Everybody is a developer: the PO, PM and Tech Lead also take issues.

## How the backlog is organised

```
Phase (milestone)        Phase 3 — Places and friends (v0.3.0)
 └─ Epic (issue + label `epic`)      Epic: Profiles, friends and messages
     └─ Issue (sub-issue)            Send and accept friend requests
         └─ Pull request             feat(friends): add friend requests  (Closes #NN)
```

- **Phases** are GitHub milestones. Each one ends with an internal demo and a release (`v0.<phase>.0`, see [ADR 0005](../decisions/0005-releases-and-versioning.md)); the last one is `v1.0.0` for the evaluation. Phases are not tied to dates: a phase ends when its scope is done.
- **Epics** are large pieces of work, usually one per subject module, labelled `epic`. They are never worked on directly: they are split into sub-issues, and the board shows their progress from them. Create them with the **Epic** issue template.
- **Issues** are the work itself. Each one fits in a sprint, has acceptance criteria, belongs to an epic (set its parent in the issue sidebar) and to the epic's milestone.
- **Pull requests** close issues with `Closes #NN` in their description.

## Sprints

Sprints last **two weeks** and start on Mondays (field `Sprint` on the board). Add the next sprints in the field's settings when they are planned.

| Event              | When                       | Length          | What happens                                                                                                                                                            |
| ------------------ | -------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint planning    | First day of the sprint    | 1 hour          | The PO presents the top of the backlog. The team estimates what is not estimated, agrees a sprint goal, and moves issues into the sprint until its capacity is reached. |
| Daily              | Every working day          | 15 min or async | Each person: what I finished, what I will do, what blocks me. Blockers are solved after the daily, not during it. It can be a message in the team chat.                 |
| Backlog refinement | Middle of the sprint       | 45 min          | Split epics into issues, write acceptance criteria, estimate, move issues from Backlog to Ready.                                                                        |
| Sprint review      | Last day of the sprint     | 30 min          | Demo of what is Done, on a fresh `make clean && make`. The PO accepts it or sends it back. At the end of a phase this demo is the release demo.                         |
| Retrospective      | Last day, after the review | 30 min          | What went well, what did not, what we change. Each change becomes an issue with an owner, so it does not get forgotten.                                                 |

The PM writes a short note of each planning, review and retrospective in the team's shared notes; together with the board, they are the evidence for the README's "Project Management" section.

## Definition of Ready

An issue can move from **Backlog** to **Ready** when:

- [ ] Its goal says what and why, from the user's point of view when it is a feature.
- [ ] It has acceptance criteria a reviewer can check.
- [ ] It has an estimate of 8 points or less (bigger ones are split).
- [ ] It has a parent epic, a milestone, a `Module` and a `Priority`.
- [ ] Its dependencies are done or in the same sprint, and its design (Figma) is ready if it has a screen.

## Definition of Done

An issue is **Done** when:

- [ ] Every acceptance criterion is met.
- [ ] The code is merged into `develop` through a reviewed PR with every check green.
- [ ] New behaviour has tests, and coverage is still above the minimum.
- [ ] Inputs are validated in the web app and in the API.
- [ ] The interface is usable with the keyboard and works in the three languages, once those modules exist.
- [ ] The documentation is updated (guides, ADRs, README modules table if it changes).
- [ ] No errors or warnings in the browser console.

GitHub moves the card to Done when the PR that closes the issue is merged.

## Estimation

We estimate with **story points**: a measure of effort, complexity and uncertainty compared with other issues, not hours.

| Points | Rough meaning                                           |
| ------ | ------------------------------------------------------- |
| 1      | Trivial, a few lines, no unknowns                       |
| 2      | Small and clear                                         |
| 3      | A normal task: some code, tests, maybe a small decision |
| 5      | Bigger, several files or one unknown                    |
| 8      | Large, several unknowns: consider splitting it          |
| 13     | Too big for one issue: split it before the sprint       |

- Estimate together with **planning poker**: everyone picks a number in secret and shows it at the same time; the highest and lowest explain why, then vote again. The discussion is the useful part.
- Write the result in the `Estimate` field. Epics are not estimated; their issues are.
- **Velocity** is the sum of points Done in a sprint. After two or three sprints, plan each sprint with the average velocity instead of guessing.

## Priority

| Priority | Meaning                                                            |
| -------- | ------------------------------------------------------------------ |
| `P0`     | Blocks the evaluation or other work. Do it first.                  |
| `P1`     | Needed for the current phase.                                      |
| `P2`     | Nice to have; can move to a later phase. Bonus modules start here. |

Inside the same priority, the PO orders the **Backlog** view by dragging rows: higher in the list means sooner.

## Working with the board

- **Pull, do not push:** when you finish something, take the highest issue in **Ready** in the current sprint, assign yourself and move it to **In progress**.
- **Limit work in progress:** at most one issue **In progress** per person, two if one is blocked. Finishing beats starting.
- **Reviews first:** before starting new work, check the **In review** view. A PR waiting for days blocks someone else.
- **Blocked:** add the `blocked` label and say in a comment what you are waiting for. The PM follows it up.
- **Keep it truthful:** the board is the only source of what is going on. If a card is in the wrong column, move it.

## Board views

| View               | Layout  | Shows                                     | Use it for                                         |
| ------------------ | ------- | ----------------------------------------- | -------------------------------------------------- |
| **Board**          | Board   | Every issue and PR, without epics         | The day-to-day view                                |
| **Current sprint** | Board   | Only the current sprint                   | The daily, and choosing what to do next            |
| **Backlog**        | Table   | Everything not done, without epics        | Planning and refinement; the PO orders it          |
| **Epics**          | Table   | Only epics, with their sub-issue progress | Following each module and phase                    |
| **Roadmap**        | Roadmap | Issues on the sprint timeline             | Seeing what lands when                             |
| **By module**      | Table   | Issues grouped by subject module          | Checking that every module we claim is progressing |
| **In review**      | Table   | Items waiting for review                  | Reviewing before starting new work                 |
| **My work**        | Table   | What is assigned to you and not done      | Your own to-do list                                |

The filters and visible fields of each view are already set. Grouping, sorting, column limits and the roadmap's date field can only be set in the web interface; [section 8 of the GitHub setup guide](github-setup.md#8-project-board--miga-project) lists them.

## Phases and releases

1. During a phase, sprints follow one another and issues of that milestone get done.
2. When every issue of the milestone is closed, the sprint review becomes the **phase demo**, on a fresh clone.
3. The release follows [workflow step 8](workflow.md#8-release-to-main), and the milestone is closed.
4. The retrospective of that sprint also looks back at the whole phase.
