# Contributing to Miga

New to the project? Set up your machine below, then read the [workflow guide](../docs/guides/workflow.md): it walks through a task from issue to release.

## Setup

On Linux, the 42 campus computers or Windows, read the [setup guide](../docs/guides/setup.md) first: Windows needs WSL2.

1. Install **Docker**, **Node 24.22.2** (`nvm install` reads `.nvmrc`) and **pnpm 12.9.1** (`npm install --global pnpm@12.9.1`). The exact versions are listed in the [dependencies guide](../docs/guides/dependencies.md#runtime-versions).
2. Make sure Git writes your commits with **the email of your GitHub account** (check it in GitHub → Settings → Emails):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. Accept the two invitations you received by email: the repository and the [project board](https://github.com/users/joolibar/projects/7) are shared separately.
4. Clone the repo and install dependencies:
   ```bash
   git clone git@github.com:joolibar/ft_transcendence.git
   cd ft_transcendence
   pnpm install
   ```
5. Run the whole app the way it is evaluated:
   ```bash
   make
   ```
   Open https://localhost:8443 and accept the self-signed certificate warning. `make help` lists every command.

### Day-to-day development (hot reload)

```bash
make db    # only the database, on localhost:5432
pnpm dev   # API on :3000, web on http://localhost:5173
```

Use **pnpm only**. Do not run `npm install` or `yarn`: mixing package managers breaks the lockfile.

## Documentation map

| Need                                            | Read                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| Preparing your computer (macOS, Linux, Windows) | [docs/guides/setup.md](../docs/guides/setup.md)                     |
| How the project is built and organised          | [docs/architecture.md](../docs/architecture.md)                     |
| How work flows, from issue to release           | [docs/guides/workflow.md](../docs/guides/workflow.md)               |
| How we plan: sprints, board, estimates          | [docs/guides/scrum.md](../docs/guides/scrum.md)                     |
| Why things are the way they are                 | [docs/decisions/](../docs/decisions/)                               |
| Working with the database                       | [docs/guides/database.md](../docs/guides/database.md)               |
| Writing and running tests                       | [docs/guides/testing.md](../docs/guides/testing.md)                 |
| Adding or updating dependencies                 | [docs/guides/dependencies.md](../docs/guides/dependencies.md)       |
| Something does not work                         | [docs/guides/troubleshooting.md](../docs/guides/troubleshooting.md) |
| Configuring the GitHub repository               | [docs/guides/github-setup.md](../docs/guides/github-setup.md)       |
| Reporting or handling a vulnerability           | [SECURITY.md](SECURITY.md)                                          |

## Branches

| Branch      | Purpose                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `main`      | Stable, evaluable version. Protected: only updated by a PR from `develop`. |
| `develop`   | Integration branch and default branch. Protected: only updated by PRs.     |
| `feature/*` | New functionality, e.g. `feature/18-email-sign-up`                         |
| `fix/*`     | Bug fixes, e.g. `fix/301-review-form-validation`                           |
| `chore/*`   | Tooling, config, dependencies, e.g. `chore/62-postgis`                     |
| `docs/*`    | Documentation only, e.g. `docs/23-readme-team`                             |

The `Branch name` check rejects any other name, and only `develop` can open a PR into `main`.

Always branch from an up-to-date `develop`:

```bash
git switch develop && git pull
git switch -c feature/<issue>-short-description
```

The reasoning is in [docs/decisions/0003-branching-and-commits.md](../docs/decisions/0003-branching-and-commits.md).

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/), in English, with our own types and scopes:

```
feat(auth): add email and password sign-up
fix(plans): close the vote when everyone has voted
build(deps): update fastify to 5.3
docs(guides): explain how to seed the database
```

The format is `type(scope): description`: an allowed type, a scope from the list, a description in the imperative starting with a lowercase letter, at most 72 characters and no final period. Because PRs are squash-merged, **the PR title becomes the commit** in `develop`, so the `PR title` check applies the same rules to it. The types, scopes, rules and good and bad examples are in [Commit messages](../docs/guides/workflow.md#commit-messages).

Turn on the optional commit hook once per clone, so every commit is checked as you write it: `pnpm hooks:install`.

Keep commits small and focused. The subject evaluates that **every team member** has clear commits, so commit your own work.

## Pull requests

1. Push your branch and open a PR into `develop`, filling in the template.
2. Run the checks locally first ([workflow guide, step 5](../docs/guides/workflow.md#5-run-the-checks-then-open-the-pull-request)). Every check must be green: PR title, branch name, commit authors, convention scripts tests, format and lint, API and web typecheck and build, tests, stack smoke test, dependency review and CodeQL (the full list is in the [GitHub setup guide](../docs/guides/github-setup.md#ruleset-develop)).
3. At least one teammate approves. GitHub does not let you approve your own PR, so ask for a review in the PR or in the team chat.
4. Squash and merge (the commit is the PR title), then delete the branch.

## AI tools

You may use AI assistants, but **you** are the author of everything you commit and must be able to explain it in the evaluation.

- Commit with your own GitHub account. Never let a tool commit, push or open PRs under its own identity.
- No AI `Co-authored-by` trailers or "Generated with…" lines in commits or PRs. The `Commit authors` CI check rejects them.
- Write down what you used AI for in the "Use of AI" section of the README.

The reasoning is in [docs/decisions/0004-commit-authorship.md](../docs/decisions/0004-commit-authorship.md).

## Where code goes

The full layout and its rules are in [docs/architecture.md](../docs/architecture.md). In short:

| You are adding…                            | Put it in                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| An API endpoint                            | `backend/src/modules/<domain>/<domain>.routes.ts`                                              |
| Business logic or database queries         | `backend/src/modules/<domain>/<domain>.service.ts`                                             |
| A database table                           | `backend/prisma/schema.prisma` + a migration                                                   |
| A request/response shape or validation     | `shared/src/<domain>.ts`                                                                       |
| A screen                                   | `frontend/src/pages/`                                                                          |
| Components, hooks or API calls of a domain | `frontend/src/features/<domain>/`                                                              |
| A generic UI component (Button, Modal…)    | `frontend/src/components/ui/`                                                                  |
| A hook used by several features            | `frontend/src/hooks/`                                                                          |
| An error type returned by the API          | `backend/src/errors/`                                                                          |
| A test                                     | Next to the file it tests, as `*.test.ts` (see the [testing guide](../docs/guides/testing.md)) |

Create a folder when you add its first file, not before.

## Useful commands

| Command                                  | What it does                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm dev`                               | Run web and API with hot reload                                                   |
| `pnpm test`                              | Run every test (needs the database)                                               |
| `pnpm test:coverage`                     | Tests plus a coverage report                                                      |
| `pnpm lint` / `pnpm typecheck`           | Same checks as CI                                                                 |
| `pnpm generate`                          | Build `@miga/shared` and the Prisma client (lint, tests and the editor need them) |
| `pnpm format`                            | Format all files with Prettier                                                    |
| `pnpm --filter @miga/backend db:migrate` | Create and apply a database migration                                             |
| `pnpm --filter @miga/backend db:studio`  | Browse the database in the browser                                                |
