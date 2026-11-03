# 0009 — A design track ahead of development

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The product brief plans a phase 0 of design (research, user flows, wireframes, design system and prototype) that "runs one phase ahead" of development. The first backlog followed that literally: the screens of each phase were designed during the previous one.

When the team started, the state of the design was:

- Information architecture, user flows, round 1 wireframes and a first usability test were done.
- The design system (tokens and components) was half done, and no screen was in high fidelity yet.
- One person designs: the PO, who is also a developer.

Two extremes were considered:

- **Design one phase ahead, from the start.** The PO would design and review code at the same time for months, and the design system would grow in pieces, with rework every time a phase needs a new component.
- **Design everything first, then program.** This is a waterfall in disguise: the first working release would arrive weeks later, the team would wait, and the AI spikes, the first lines of code and the second usability test would arrive too late to change the design cheaply. Without an evaluation date, it would also spend time on bonus screens that might be cut.

## Decision

Design runs as its own track, **front-loaded and ahead of development**, inside the same sprints as everything else:

- **Front-loaded:** in the first sprints the PO does only design: the design system, the high-fidelity screens of the core phases (2 to 5), the clickable prototype of every flow and the second usability test. The PO takes no programming issues until then.
- **In parallel:** the rest of the team builds what has no screens (data model, PostGIS, the OpenStreetMap import, languages, validation, accessibility checks, real time, emails, the AI spikes), and each screen as soon as its design is closed.
- **Ahead:** after the front-loaded work, design stays at least one phase ahead of development.
- **Bonus screens** (phase 6) are designed as wireframes first; high fidelity only once the core points are on track and the bonus modules are confirmed.
- **Same process:** design issues are estimated, planned into sprints and shown at the review like any other issue. They are not a separate phase or milestone.

The design issues and their naming are described in the [Scrum guide](../guides/scrum.md#roadmap).

## Consequences

- A first release (`v0.2.0`) can still ship in the second sprint: phase 2 screens are the first ones designed.
- The design system is decided with almost every screen in view, so it is coherent and needs less rework.
- The whole product can be walked through and tested in the prototype before most of it is built.
- The PO is the bottleneck during the front-loaded sprints. The sprint reviews show whether design keeps the pace; if it does not, the team helps with the design system in code (#78 to #80) and the scope of the next phases is reviewed.
- Interviews were dropped: the usability tests validate the product hypotheses instead.
