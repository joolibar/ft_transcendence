# Contributing to Miga

## Setup

1. Install **Docker**, **Node 24** (`nvm use` reads `.nvmrc`) and **pnpm 12** (`npm install --global pnpm@12`).
2. Make sure Git signs your commits with **the email of your GitHub account** (check it in GitHub → Settings → Emails):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. Clone the repo and install dependencies:
   ```bash
   pnpm install
   ```
4. Run the whole app the way it is evaluated:
   ```bash
   make
   ```
   Open https://localhost:8443 and accept the self-signed certificate warning. `make help` lists every command.

### Day-to-day development (hot reload)

```bash
docker compose up --detach db   # only the database
pnpm dev                        # API on :3000, web on http://localhost:5173
```

Use **pnpm only**. Do not run `npm install` or `yarn`: mixing package managers breaks the lockfile.

## Documentation map

| Need                                   | Read                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| How the project is built and organised | [docs/architecture.md](docs/architecture.md)                     |
| Why things are the way they are        | [docs/decisions/](docs/decisions/)                               |
| Working with the database              | [docs/guides/database.md](docs/guides/database.md)               |
| Adding or updating dependencies        | [docs/guides/dependencies.md](docs/guides/dependencies.md)       |
| Something does not work                | [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md) |
| Configuring the GitHub repository      | [docs/guides/github-setup.md](docs/guides/github-setup.md)       |

## Branches

| Branch      | Purpose                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `main`      | Stable, evaluable version. Protected: only updated by a PR from `develop`. |
| `develop`   | Integration branch and default branch. Protected: only updated by PRs.     |
| `feature/*` | New functionality, e.g. `feature/auth-signup`                              |
| `fix/*`     | Bug fixes, e.g. `fix/review-form-validation`                               |
| `chore/*`   | Tooling, config, dependencies, e.g. `chore/ci-cache`                       |
| `docs/*`    | Documentation only, e.g. `docs/database-schema`                            |

The `Branch name` check rejects any other name, and only `develop` can open a PR into `main`.

Always branch from an up-to-date `develop`:

```bash
git switch develop && git pull
git switch -c feature/short-description
```

The reasoning is in [docs/decisions/0003-branching-and-commits.md](docs/decisions/0003-branching-and-commits.md).

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/), in English:

```
feat(auth): add email sign-up endpoint
fix(web): show error when login fails
chore: update dependencies
docs: describe database schema
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`. Because PRs are squash-merged, **the PR title becomes the commit** in `develop`, so the `PR title` check applies the same format to it. The scope in parentheses is the domain or app (`auth`, `reviews`, `web`, `api`). Keep commits small and focused. The subject evaluates that **every team member** has clear commits, so commit your own work.

## Pull requests

1. Push your branch and open a PR into `develop`, filling in the template.
2. CI must be green: PR title, branch name, commit authors, format and lint, API build, web build, tests, Docker build.
3. At least one teammate approves.
4. Squash and merge, then delete the branch.

## AI tools

You may use AI assistants, but **you** are the author of everything you commit and must be able to explain it in the evaluation.

- Commit with your own GitHub account. Never let a tool commit, push or open PRs under its own identity.
- No AI `Co-authored-by` trailers or "Generated with…" lines in commits or PRs. The `Commit authors` CI check rejects them.
- Write down what you used AI for in the "Use of AI" section of the README.

The reasoning is in [docs/decisions/0004-commit-authorship.md](docs/decisions/0004-commit-authorship.md).

## Where code goes

The full layout and its rules are in [docs/architecture.md](docs/architecture.md). In short:

| You are adding…                            | Put it in                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| An API endpoint                            | `apps/api/src/modules/<domain>/<domain>.routes.ts`                                          |
| Business logic or database queries         | `apps/api/src/modules/<domain>/<domain>.service.ts`                                         |
| A database table                           | `apps/api/prisma/schema.prisma` + a migration                                               |
| A request/response shape or validation     | `packages/shared/src/<domain>.ts`                                                           |
| A screen                                   | `apps/web/src/pages/`                                                                       |
| Components, hooks or API calls of a domain | `apps/web/src/features/<domain>/`                                                           |
| A generic UI component (Button, Modal…)    | `apps/web/src/components/ui/`                                                               |
| A test                                     | Next to the file it tests, as `*.test.ts` (see the [testing guide](docs/guides/testing.md)) |

Create a folder when you add its first file, not before.

## Useful commands

| Command                              | What it does                          |
| ------------------------------------ | ------------------------------------- |
| `pnpm dev`                           | Run web and API with hot reload       |
| `pnpm test`                          | Run every test (needs the database)   |
| `pnpm test:coverage`                 | Tests plus a coverage report          |
| `pnpm lint` / `pnpm typecheck`       | Same checks as CI                     |
| `pnpm format`                        | Format all files with Prettier        |
| `pnpm --filter @miga/api db:migrate` | Create and apply a database migration |
| `pnpm --filter @miga/api db:studio`  | Browse the database in the browser    |
