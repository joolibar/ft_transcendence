# GitHub repository setup

The repository rules in [`docs/decisions/`](../decisions/) only protect the project if GitHub enforces them. This guide lists every setting, so the repository can be configured (or checked) by anyone with admin access.

> Settings marked **required** are needed for the rules in ADR 0003 and 0004 to hold.

## 1. General — Settings → General

| Setting                            | Value                                                            | Why                                          |
| ---------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| Visibility                         | **Public** **(required)**                                        | Needed for rulesets on a free plan (below)   |
| Default branch                     | `develop` **(required)**                                         | PRs open against `develop` by default        |
| Allow merge commits                | ✅ on                                                            | Used only for release PRs `develop` → `main` |
| Allow squash merging               | ✅ on, default message **Pull request title and commit details** | Feature PRs become one clean commit          |
| Allow rebase merging               | ❌ off                                                           | One merge style per case, no ambiguity       |
| Automatically delete head branches | ✅ on                                                            | Merged branches do not pile up               |

## 2. Branch rulesets — Settings → Rules → Rulesets **(required)**

> **Plan requirement:** GitHub only enforces rulesets on **public** repositories or on private repositories owned by a **GitHub Pro** account. On a free plan with a private repository, the API answers "Upgrade to GitHub Pro or make this repository public".
>
> We made the repository public for this reason. Before doing so we checked that the whole history, including the refs GitHub keeps for every pull request, contains no secrets (`.env`, keys, certificates, tokens). Public repositories also get unlimited GitHub Actions minutes and free secret scanning. If it ever goes back to private, the rulesets stop being enforced until the owner has GitHub Pro (free for students with the [GitHub Student Developer Pack](https://education.github.com/pack)).

The two rulesets are stored as code in [`.github/rulesets/`](../../.github/rulesets/), so they can be reviewed in PRs and applied with one command each:

```bash
gh api -X POST repos/joolibar/ft_transcendence/rulesets --input .github/rulesets/develop.json
gh api -X POST repos/joolibar/ft_transcendence/rulesets --input .github/rulesets/main.json
```

To change an existing ruleset, edit its file and replace `POST …/rulesets` with `PUT …/rulesets/<id>` (`gh api repos/joolibar/ft_transcendence/rulesets` lists the ids).

What they contain, for reference or to create them by hand with **Enforcement status: Active**:

### Ruleset `develop`

Target: branch `develop`.

- ✅ Restrict deletions
- ✅ Block force pushes
- ✅ Require a pull request before merging
  - Required approvals: **0 while one person works on the repository, 1 as soon as the team joins.** GitHub does not let authors approve their own PRs, so requiring 1 approval with a single member would block every merge. When the second member joins, set `required_approving_review_count` to `1` in both files and apply them.
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require conversation resolution before merging
  - Allowed merge methods: **Squash**
- ✅ Require status checks to pass, with ✅ "Require branches to be up to date before merging", and these checks:

| Check                      | Workflow       | What it verifies                         |
| -------------------------- | -------------- | ---------------------------------------- |
| `Format and lint`          | CI             | Prettier and ESLint                      |
| `API typecheck and build`  | CI             | The API compiles                         |
| `Web typecheck and build`  | CI             | The web app compiles                     |
| `Tests`                    | CI             | Every test passes against PostgreSQL     |
| `Docker images build`      | CI             | `make` would be able to build the images |
| `PR title`                 | PR conventions | Conventional Commits title               |
| `Branch name`              | PR conventions | Allowed prefix and target branch         |
| `Commit authors`           | PR conventions | Team members only, no AI attribution     |
| `Convention scripts tests` | PR conventions | The tests of the rules above pass        |

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

| Setting                     | Value                                         |
| --------------------------- | --------------------------------------------- |
| Dependabot alerts           | ✅ on (alerts only, no commits)               |
| Dependabot security updates | ❌ off (see section 4)                        |
| Secret scanning             | ✅ on (free on public repositories)           |
| Push protection             | ✅ on: a push containing a secret is rejected |

Everything in a public repository can be read by anyone, forever: a secret pushed once must be considered leaked even if the commit is removed. Push protection stops most of them before they reach GitHub; if one gets through, rotate it (change the password or key) first, then remove it.

## 6. Collaborators — Settings → Collaborators and teams

Add every team member with the **Write** role. Admin access only for whoever maintains these settings. Then add each member to [`.github/CODEOWNERS`](../../.github/CODEOWNERS) for the areas they own.

## 7. Labels — Issues → Labels

Issue templates apply `feature`, `bug` and `module` automatically; GitHub silently ignores labels that do not exist, so create them first. Each one can be created (or updated) with `gh label create "<name>" --color <color> --description "<description>" --force`.

GitHub also adds its default labels (`documentation`, `enhancement`, `question`…). Prefer the ones below, which match our branch prefixes and commit types.

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
