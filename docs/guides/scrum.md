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
Phase (milestone)        Phase 3 — Social core (v0.3.0)
 └─ Epic (issue + label `epic`)      Epic: Profiles, friends and messages
     └─ Issue (sub-issue)            Send and accept friend requests
         └─ Pull request             feat(friends): add friend requests  (Closes #NN)
```

- **Phases** are GitHub milestones. Each one ends with an internal demo and a release (`v0.<phase>.0`, see [ADR 0005](../decisions/0005-releases-and-versioning.md)); the last one is `v1.0.0` for the evaluation. Phases are not tied to dates: a phase ends when its scope is done.
- **Epics** are large pieces of work, usually one per subject module, labelled `epic`. They are never worked on directly: they are split into sub-issues, and the board shows their progress from them. Create them with the **Epic** issue template.
- **Issues** are the work itself. Each one fits in a sprint, has acceptance criteria and belongs to an epic (set its parent in the issue sidebar).
- **Milestones:** an issue's milestone is the phase in which it is done; an epic's milestone is the phase in which it closes. So an epic can have sub-issues in earlier phases: the user management epic closes in phase 3, but sign up and log in is in phase 2.
- **Refinement depth:** issues of the current and the next phase have full acceptance criteria and are ready to estimate. Later phases also have their issues, so the scope and the epics' progress are visible from the start, but they are refined again before their phase: what we learn while building changes them.
- **Estimates** are not written in advance: the team sets them together at planning poker (see [Estimation](#estimation)).
- **Spikes** (label `spike`) are timeboxed research for the most uncertain work. They end in a decision written as an ADR and in new issues, never in production code.
- **Pull requests** close issues with `Closes #NN` in their description.

## Roadmap

Each phase is a milestone of one or two sprints and ends with a demo and a release. The order follows four principles, explained in [ADR 0008](../decisions/0008-roadmap-in-vertical-slices.md): **risk first** (spikes on the uncertain work), **vertical slices** (every phase adds something a user can do), **core points first** (the 14 the subject requires before any bonus) and **small phases**.

| Phase                | Release  | Sprints | Demo                                                               | Epics and key issues                                                                                                                                                                                                              | Core points |
| -------------------- | -------- | ------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1 — Project setup    | `v0.1.0` | —       | `make` starts everything                                           | Monorepo, Docker, CI, rules, security, docs                                                                                                                                                                                       | —           |
| 2 — Walking skeleton | `v0.2.0` | 1       | Sign up, log in and save a place, in three languages               | Data model (#27), languages (#29); issues: sign-up (#18), places from OpenStreetMap (#59), first places slice (#44), PostGIS (#62), layout (#21), legal pages (#16, #17, #58), validation (#19), accessibility checks in CI (#61) | 3           |
| 3 — Social core      | `v0.3.0` | 2       | Reviews, profiles, friends, messages, sign in with 42 and Google   | User management (#26), places and reviews (#30), profiles, friends and messages (#31), OAuth (#35), moderation and safety (#54), onboarding (#60); AI spikes (#45, #46)                                                           | 8           |
| 4 — Group plans      | `v0.4.0` | 2       | A group votes and chats live; the LLM explains each place          | Group plans with live voting and chat (#34), LLM explanations (#37)                                                                                                                                                               | 12          |
| 5 — Recommendations  | `v0.5.0` | 1–2     | The group gets suggestions from the model                          | Group recommendations with machine learning (#36)                                                                                                                                                                                 | 14          |
| 6 — Bonus            | `v0.6.0` | 2       | Search, photos, gamification, data export and deletion, public API | Search (#32), photos (#33), gamification (#40), GDPR (#39), public API (#41), design system completion (#28), analytics (#55), diary (#56), friends feed (#57)                                                                    | +5 bonus    |
| 7 — Evaluation       | `v1.0.0` | 1       | The evaluation, rehearsed                                          | Accessibility audit (#38), mandatory requirements (#25), rehearsal and bug bash (#47). No new features                                                                                                                            | —           |

**Design runs one phase ahead.** The product brief's phase 0 (research, user flows, wireframes, design system and prototype) does not end: the screens of the next phase are designed and tested in Figma while the current one is built, and an issue with a screen is only **Ready** when its design is (Definition of Ready).

This work lives in the **UX/UI design and prototype** epic (#66). Its sub-issues are titled `Design: …`, labelled `design` and assigned to the PO, and each one sits in the milestone of the phase **during** which it is done, one phase before the screens are built: the phase 3 screens are a phase 2 issue. The design of the phase 2 screens (#70) is the exception: it has to be finished before the first sprint planning, or sprint 1 starts with the issues that have no screen (data model, PostGIS, the OpenStreetMap import, languages, accessibility checks).

**The product brief** is the source of the product's scope and its MoSCoW priorities. Its Must items are epics or issues on the board; its Should items are in phase 6; its Could items stay out until there is time.

**Five people, three streams.** Each phase is planned so that about three lines of work run in parallel, for example in phase 3: accounts and OAuth, places and reviews, friends and messages plus the spikes.

**Without a date yet**, the plan needs about 10 sprints (five months). When the evaluation date is known, the PM maps phases to sprints; with less time, phase 6 shrinks in the order the README gives.

Accessibility and the three languages are not left for the end: the Definition of Done applies them to every screen from phase 2, and phase 7 only audits them.

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
- **Reviews first:** before starting new work, look at the **In review** column. A PR waiting for days blocks someone else.
- **Blocked:** add the `blocked` label and say in a comment what you are waiting for. The PM follows it up.
- **Keep it truthful:** the board is the only source of what is going on. If a card is in the wrong column, move it.

## Board views

Four views, one per question. Most of the time you only need the first one.

| View        | Layout | Answers                                | Who uses it                                     |
| ----------- | ------ | -------------------------------------- | ----------------------------------------------- |
| **Board**   | Board  | What is everyone doing right now?      | Everyone, every day; the daily                  |
| **Backlog** | Table  | What comes next, and in which order?   | The PO and the team, in planning and refinement |
| **Epics**   | Table  | How far has each module and phase got? | The PO and the PM; the evaluation               |
| **My work** | Table  | What do I have to do?                  | Each person                                     |

The filters and visible fields are already set; grouping, sorting and the column limit are set by hand, as listed in [section 8 of the GitHub setup guide](github-setup.md#8-project-board--miga-project). More views (a roadmap, one per module) can be added later, when the team is used to the board and needs them.

## Phases and releases

1. During a phase, sprints follow one another and issues of that milestone get done.
2. When every issue of the milestone is closed, the sprint review becomes the **phase demo**, on a fresh clone.
3. The release follows [workflow step 8](workflow.md#8-release-to-main), and the milestone is closed.
4. The retrospective of that sprint also looks back at the whole phase.
