# GitHub repository setup

The repository rules in [`docs/decisions/`](../decisions/) only protect the project if GitHub enforces them. This guide lists every setting, so the repository can be configured (or checked) by anyone with admin access.

> Settings marked **required** are needed for the rules in ADR 0003 and 0004 to hold.

## 1. General — Settings → General

| Setting                            | Value                                                            | Why                                          |
| ---------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| Default branch                     | `develop` **(required)**                                         | PRs open against `develop` by default        |
| Allow merge commits                | ✅ on                                                            | Used only for release PRs `develop` → `main` |
| Allow squash merging               | ✅ on, default message **Pull request title and commit details** | Feature PRs become one clean commit          |
| Allow rebase merging               | ❌ off                                                           | One merge style per case, no ambiguity       |
| Automatically delete head branches | ✅ on                                                            | Merged branches do not pile up               |

## 2. Branch rulesets — Settings → Rules → Rulesets **(required)**

Create two branch rulesets with **Enforcement status: Active**.

### Ruleset `develop`

Target: branch `develop`.

- ✅ Restrict deletions
- ✅ Block force pushes
- ✅ Require a pull request before merging
  - Required approvals: **1**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require conversation resolution before merging
  - Allowed merge methods: **Squash**
- ✅ Require status checks to pass, with ✅ "Require branches to be up to date before merging", and these checks:

| Check                     | Workflow       | What it verifies                         |
| ------------------------- | -------------- | ---------------------------------------- |
| `Format and lint`         | CI             | Prettier and ESLint                      |
| `API typecheck and build` | CI             | The API compiles                         |
| `Web typecheck and build` | CI             | The web app compiles                     |
| `Tests`                   | CI             | Every test passes against PostgreSQL     |
| `Docker images build`     | CI             | `make` would be able to build the images |
| `PR title`                | PR conventions | Conventional Commits title               |
| `Branch name`             | PR conventions | Allowed prefix and target branch         |
| `Commit authors`          | PR conventions | Team members only, no AI attribution     |

A check only appears in the search box after it has run at least once in the repository.

### Ruleset `main`

Target: branch `main`. Same as `develop`, except:

- Allowed merge methods: **Merge** (a merge commit keeps `main` and `develop` sharing the same history; squashing would make them diverge).
- The `Branch name` check already rejects any PR into `main` that does not come from `develop`.

**Bypass list:** leave it empty. Nobody, including admins, should push to these branches directly.

## 3. Actions — Settings → Actions → General

| Setting                                                  | Value                                                 |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Actions permissions                                      | Allow all actions and reusable workflows              |
| Workflow permissions                                     | **Read repository contents and packages permissions** |
| Allow GitHub Actions to create and approve pull requests | ❌ off                                                |

## 4. AI tools and bots (required, see ADR 0004)

- **Settings → Integrations → GitHub Apps:** do not install AI apps or coding agents that commit or open pull requests under their own account.
- **Settings → Copilot** (if available): turn the coding agent off for this repository.
- **No Dependabot version or security update PRs:** they are commits by a bot account and would fail `Commit authors`. Dependencies are updated by team members instead (see [dependencies guide](dependencies.md)).

## 5. Security — Settings → Advanced Security

| Setting                           | Value                                         |
| --------------------------------- | --------------------------------------------- |
| Dependabot alerts                 | ✅ on (alerts only, no commits)               |
| Dependabot security updates       | ❌ off (see section 4)                        |
| Secret scanning / push protection | ✅ on, if available for the repository's plan |

## 6. Collaborators — Settings → Collaborators and teams

Add every team member with the **Write** role. Admin access only for whoever maintains these settings. Then add each member to [`.github/CODEOWNERS`](../../.github/CODEOWNERS) for the areas they own.

## 7. Labels — Issues → Labels

Issue templates apply `feature`, `bug` and `module` automatically; GitHub silently ignores labels that do not exist, so create them first.

| Label         | Color     | Description                                                 |
| ------------- | --------- | ----------------------------------------------------------- |
| `feature`     | `#1D76DB` | New functionality or improvement                            |
| `bug`         | `#D73A4A` | Something is not working                                    |
| `module`      | `#5319E7` | Work towards a subject module we claim                      |
| `docs`        | `#0075CA` | Documentation only                                          |
| `chore`       | `#BFD4F2` | Tooling, configuration, dependencies                        |
| `mandatory`   | `#B60205` | Required by the subject: the project is rejected without it |
| `area: web`   | `#C2E0C6` | Frontend                                                    |
| `area: api`   | `#C2E0C6` | Backend                                                     |
| `area: infra` | `#C2E0C6` | Docker, nginx, CI                                           |
| `blocked`     | `#000000` | Waiting on something else                                   |

## 8. Project board — Projects → New project → Board

Columns: **Backlog → Ready → In progress → In review → Done**. Link the repository so new issues land in Backlog. Useful custom fields: `Module` (single select) and `Sprint` (iteration).

The board, issues and PRs are the evidence for the README's "Project Management" section.

## 9. Initial backlog

Create these issues first. The ones marked `mandatory` block the evaluation if missing.

| Issue                                                           | Labels                                          |
| --------------------------------------------------------------- | ----------------------------------------------- |
| Privacy Policy page with real content, linked from the footer   | `mandatory`, `feature`, `area: web`             |
| Terms of Service page with real content, linked from the footer | `mandatory`, `feature`, `area: web`             |
| Sign up and log in with email and hashed passwords              | `mandatory`, `module`, `area: api`, `area: web` |
| Validate every form in the web app and every request in the API | `mandatory`, `feature`                          |
| Database schema: users, places, reviews, friendships, plans     | `feature`, `area: api`                          |
| Layout: header, navigation and footer                           | `feature`, `area: web`                          |
| Internationalisation setup (es, ca, en)                         | `module`, `area: web`                           |
| Fill in team, roles and project management in the README        | `docs`                                          |
