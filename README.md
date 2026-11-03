_This project has been created as part of the 42 curriculum by joolibar._

<!-- TODO: add every team member's 42 login to the line above, e.g. "by joolibar, login2, login3". -->

# Miga

## Description

**Miga** is a social web app to save, rate and choose places to eat and drink with your friends.

Saved restaurants usually end up scattered across notes, chats and maps, and when a group wants to go out nobody knows which places fit everyone's tastes and dietary needs. Miga keeps all of your places in one map, lets you review them and share them with friends, and helps a group decide together where to go, taking allergies, intolerances and diets into account.

### Key features (planned)

- **Your places:** save restaurants, bars and cafés, rate and review them, and keep a personal journal of past visits.
- **Friends:** add friends, see their reviews and photos in a friends-only feed.
- **Group plans:** create a plan with friends; Miga suggests places that fit the whole group and the group votes.
- **Dietary profile:** preferences, intolerances and allergies, used as hard filters in recommendations.
- **AI recommendations:** suggestions based on everyone's taste history, with a natural-language explanation of why each place fits.
- **Multilingual and accessible** from day one (Spanish, Catalan, English).

> Status: initial project setup. Features are listed as they are planned and will be updated as they are implemented.

## Instructions

### Prerequisites

| Tool             | Version | Needed for                     |
| ---------------- | ------- | ------------------------------ |
| Docker + Compose | 24+     | Running the project (required) |
| GNU Make         | any     | Running the project (required) |
| Node.js          | 24      | Local development only         |
| pnpm             | 12      | Local development only         |

### Run the project

```bash
make
```

The first run creates `.env` from `.env.example`. Change its passwords and secrets, then run `make re` to apply them.

Open **https://localhost:8443**. The certificate is self-signed, so the browser shows a warning the first time; accept it to continue.

| Command      | What it does                                             |
| ------------ | -------------------------------------------------------- |
| `make`       | Build and start every service                            |
| `make down`  | Stop every service (data is kept)                        |
| `make re`    | Restart everything from a fresh build                    |
| `make logs`  | Follow the logs                                          |
| `make ps`    | Show the state of every service                          |
| `make clean` | Stop everything and delete the database and local images |
| `make db`    | Start only the database, for local development           |

### Environment variables

All configuration lives in `.env` (ignored by Git). `.env.example` lists every variable with a description.

### Local development

See [CONTRIBUTING.md](CONTRIBUTING.md) for hot-reload development, branch and commit conventions, and the project structure. The architecture is described in [docs/architecture.md](docs/architecture.md).

## Team Information

<!-- TODO: one row per member. Roles defined by the subject: PO, PM, Tech Lead, Developers. -->

| Member   | Role(s)                  | Responsibilities                                            |
| -------- | ------------------------ | ----------------------------------------------------------- |
| joolibar | Product Owner, Developer | Product vision, UX/UI and design system, backlog priorities |
| _TBD_    | Project Manager          |                                                             |
| _TBD_    | Tech Lead                |                                                             |
| _TBD_    | Developer                |                                                             |
| _TBD_    | Developer                |                                                             |

## Project Management

We work in **Scrum** with two-week sprints. The process (roles, events, Definition of Ready and Done, estimation) is in the [Scrum guide](docs/guides/scrum.md), and the reasons in [ADR 0007](docs/decisions/0007-planning-with-scrum.md).

- **Board:** the [Miga GitHub Project](https://github.com/users/joolibar/projects/7), with views for the current sprint, the backlog, epics, the roadmap and progress per module.
- **Planning:** phases (milestones, each ending in a release) → epics (one per subject module) → issues → pull requests. See the [roadmap](docs/guides/scrum.md#roadmap).
- **Workflow:** feature branches → pull request into `develop` → review + CI → merge; a release to `main` at the end of each phase. See the [workflow guide](docs/guides/workflow.md).
- **Design:** Figma (wireframes and the Miga design system).
- **Meetings:** sprint planning, daily, refinement, review and retrospective; days and times _TBD_.
- **Communication:** _TBD_

## Technical Stack

| Layer      | Technology                            | Why                                                                  |
| ---------- | ------------------------------------- | -------------------------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS | Most widely used framework, large ecosystem, fast dev server         |
| Backend    | Fastify, TypeScript                   | Strong TypeScript support, built-in schema validation, fast          |
| Database   | PostgreSQL                            | Our data is relational: users, places, reviews, friendships, plans   |
| ORM        | Prisma                                | Type-safe queries and versioned migrations                           |
| Validation | Zod (shared between web and API)      | One schema validates input on both sides                             |
| Real-time  | Socket.io                             | Live updates for group plans, notifications and chat                 |
| Web server | nginx                                 | Single HTTPS entry point, serves the app, proxies API and WebSockets |
| Deployment | Docker Compose                        | Whole project starts with one command                                |

The full reasoning is in [docs/decisions/0002-tech-stack.md](docs/decisions/0002-tech-stack.md).

## Database Schema

_To be completed as models are added to [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma)._

Main entities planned: User, DietaryRestriction, Place, Review, List, Friendship, GroupPlan, Notification.

## Features List

_To be completed as features are implemented, with the team member(s) responsible for each._

| Feature | Description | Team member(s) |
| ------- | ----------- | -------------- |
|         |             |                |

## Modules

_Planned selection from the product brief, to be confirmed by the team. Who works on each module will be added once tasks are assigned._

**Subject rules:** 14 points are required; each Major is worth 2 points and each Minor 1. Bonus points only count once the 14 mandatory points are validated, up to 5 extra. Every module must be fully working, add real value to the product and be justified here.

### Core — 14 points

| Category        | Module                                            | Type  | Points | What covers it in Miga                                 |
| --------------- | ------------------------------------------------- | ----- | ------ | ------------------------------------------------------ |
| Web             | Use a framework for both the frontend and backend | Major | 2      | React and Fastify across the whole app                 |
| User Management | Standard user management and authentication       | Major | 2      | Profiles, avatars, friends and online status           |
| Web             | Allow users to interact with other users          | Major | 2      | Group plan chat, direct messages, profiles and friends |
| Web             | Real-time features using WebSockets               | Major | 2      | Group voting, chat and live updates                    |
| AI              | Recommendation system using machine learning      | Major | 2      | Place suggestions for a group and "Surprise me"        |
| AI              | Complete LLM system interface                     | Major | 2      | Streamed explanation of every suggestion               |
| Web             | Use an ORM for the database                       | Minor | 1      | Prisma                                                 |
| User Management | Remote authentication with OAuth 2.0              | Minor | 1      | Sign in with Google and with 42                        |

### Bonus — 10 points planned

| Category                               | Module                                               | Type  | Points | What covers it in Miga                              |
| -------------------------------------- | ---------------------------------------------------- | ----- | ------ | --------------------------------------------------- |
| Accessibility and Internationalization | Complete accessibility compliance (WCAG 2.1 AA)      | Major | 2      | The whole interface                                 |
| Web                                    | Public API with a secured API key and rate limiting  | Major | 2      | Our own API for places, collections and group plans |
| Accessibility and Internationalization | Support for multiple languages                       | Minor | 1      | Spanish, Catalan and English                        |
| Web                                    | Custom-made design system with reusable components   | Minor | 1      | Tokens, icons, 10+ components, light and dark mode  |
| Data and Analytics                     | GDPR compliance features                             | Minor | 1      | Data export and deletion, confirmation emails       |
| Gaming and user experience             | Gamification system                                  | Minor | 1      | Map to reveal, passport, levels and friends ranking |
| Web                                    | Advanced search with filters, sorting and pagination | Minor | 1      | Searching places                                    |
| Web                                    | File upload and management                           | Minor | 1      | Check-in photos with preview and progress           |

### Reserve — not planned

Progressive Web App, sentiment analysis, data import, a complete notification system and AI content moderation (Minor, 1 point each). Only if there is time left: 24 planned points already exceed what counts.

### Points

| Block                        | Points |
| ---------------------------- | ------ |
| Core                         | 14     |
| Bonus planned                | 10     |
| **Total planned**            | **24** |
| Maximum that counts (14 + 5) | 19     |
| Safety margin                | 5      |

The margin covers modules that might not be validated in the evaluation: if a core module fails, a bonus module takes its place. If scope has to be cut, the Public API goes first (2 points, least value for users), then advanced search.

_Justification and implementation details for each module will be added as they are built._

## Individual Contributions

_To be completed by each team member._

## Resources

- [ft_transcendence subject](https://projects.intra.42.fr/) (42 intranet)
- [React documentation](https://react.dev/)
- [Fastify documentation](https://fastify.dev/docs/latest/)
- [Prisma documentation](https://www.prisma.io/docs)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [Socket.io documentation](https://socket.io/docs/v4/)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Use of AI

AI assistants are used as tools; every commit is authored and reviewed by a team member under their own GitHub account (see [docs/decisions/0004-commit-authorship.md](docs/decisions/0004-commit-authorship.md)).

- **Planning:** an AI assistant was used to compare technical stacks, discuss module choices against the subject, and structure the product scope.
- **Project setup:** an AI assistant generated the initial monorepo skeleton (configuration, Docker Compose, nginx, CI, templates and this README structure). The team reviewed it before building on it.
- _Add further uses here as the project progresses (which tasks, which parts of the code)._
