# GitHub repository setup

The repository rules in [`docs/decisions/`](../decisions/) only protect the project if GitHub enforces them. This guide lists every setting, so the repository can be configured (or checked) by anyone with admin access.

> Settings marked **required** are needed for the rules in ADR 0003 and 0004 to hold.

## 1. General — Settings → General

| Setting                            | Value                                         | Why                                                                                                           |
| ---------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Visibility                         | **Public** **(required)**                     | Needed for rulesets on a free plan (below)                                                                    |
| Default branch                     | `develop` **(required)**                      | PRs open against `develop` by default                                                                         |
| Allow merge commits                | ✅ on                                         | Used only for release PRs `develop` → `main`                                                                  |
| Allow squash merging               | ✅ on, default message **Pull request title** | One clean commit per PR; working commits stay in the PR ([ADR 0010](../decisions/0010-commit-conventions.md)) |
| Allow rebase merging               | ❌ off                                        | One merge style per case, no ambiguity                                                                        |
| Automatically delete head branches | ✅ on                                         | Merged branches do not pile up                                                                                |

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
  - Required approvals: **0 until the team starts programming, then 1.** While the pull requests are setup and documentation from the PO, waiting for a review would only slow them down. From the first development sprint every PR needs a teammate, because GitHub does not let authors approve their own PRs: set `required_approving_review_count` to `1` in both files and apply them.
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require conversation resolution before merging
  - Allowed merge methods: **Squash**
- ✅ Require code scanning results: tool **CodeQL**, security alerts **Medium or higher**, alerts **Errors**
- ✅ Require status checks to pass, with ✅ "Require branches to be up to date before merging", and these checks:

| Check                      | Workflow       | What it verifies                                                  |
| -------------------------- | -------------- | ----------------------------------------------------------------- |
| `Format and lint`          | CI             | Prettier and ESLint                                               |
| `API typecheck and build`  | CI             | The API compiles                                                  |
| `Web typecheck and build`  | CI             | The web app compiles                                              |
| `Tests`                    | CI             | Every test passes against PostgreSQL                              |
| `Docker images build`      | CI             | `make` would be able to build the images                          |
| `PR title`                 | PR conventions | Conventional Commits title                                        |
| `Branch name`              | PR conventions | Allowed prefix and target branch                                  |
| `Commit authors`           | PR conventions | Team members only, no AI attribution                              |
| `Convention scripts tests` | PR conventions | The tests of the rules above pass                                 |
| `Dependency review`        | Security       | No new dependency with a known vulnerability (moderate or higher) |

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

| Setting                                                    | Value                                                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Dependabot alerts                                          | ✅ on (alerts only, no commits)                                                                                 |
| Dependabot security updates                                | ❌ off (see section 4)                                                                                          |
| Secret scanning                                            | ✅ on (free on public repositories)                                                                             |
| Push protection                                            | ✅ on: a push containing a secret is rejected                                                                   |
| Private vulnerability reporting                            | ✅ on: the channel described in [`SECURITY.md`](../../.github/SECURITY.md)                                      |
| Code scanning (CodeQL)                                     | ✅ on, **Default setup** (JavaScript/TypeScript and GitHub Actions)                                             |
| Secret scanning: non-provider patterns and validity checks | Not available on our plan (GitHub Secret Protection); the standard secret scanning above covers known providers |

**CodeQL** analyses the code of every pull request and of `develop` looking for security problems: injections, cross-site scripting, unvalidated input, workflows with too many permissions. Its default setup is managed by GitHub, so there is no workflow file in the repository. It shows up in pull requests as the `CodeQL` check, and the rulesets block the merge while a PR has a CodeQL security alert of medium severity or higher (rule **Require code scanning results**). Alerts are listed in **Security → Code scanning**; fix them in a `fix/` branch, or dismiss one only with a written reason when it is a false positive.

Everything in a public repository can be read by anyone, forever: a secret pushed once must be considered leaked even if the commit is removed. Push protection stops most of them before they reach GitHub; if one gets through, rotate it (change the password or key) first, then remove it.

## 6. Collaborators — Settings → Collaborators and teams

Add every team member with the **Write** role. Admin access only for whoever maintains these settings. Then add each member to [`.github/CODEOWNERS`](../../.github/CODEOWNERS) for the areas they own.

## 7. Labels — Issues → Labels

Issue templates apply `feature`, `bug` and `module` automatically; GitHub silently ignores labels that do not exist, so create them first. Each one can be created (or updated) with `gh label create "<name>" --color <color> --description "<description>" --force`.

GitHub creates some default labels with every repository. We deleted the ones that duplicate ours or only make sense for open-source projects (`documentation`, `enhancement`, `good first issue`, `help wanted`) and kept the rest, listed in the second table. The repository must have exactly the labels of both tables.

Our labels, which match the branch prefixes and commit types:

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
| `epic`        | `#3E4B9E` | Large piece of work, split into sub-issues                  |
| `spike`       | `#FBCA04` | Timeboxed research that ends in a decision                  |
| `design`      | `#FF5470` | UX/UI research, flows, screens and prototype                |

GitHub defaults we keep, mostly to say why an issue was closed without changes:

| Label           | Color     | Use it for                                             |
| --------------- | --------- | ------------------------------------------------------ |
| `question`      | `#D876E3` | Asking for information or a decision, not a task       |
| `duplicate`     | `#CFD3D7` | Closed: another issue or PR already covers it          |
| `invalid`       | `#E4E669` | Closed: not a real problem, or not reproducible        |
| `wontfix`       | `#FFFFFF` | Closed: we decided not to do it (say why in a comment) |
| `accessibility` | `#F143AB` | A barrier for people with disabilities (WCAG module)   |

## 8. Project board — [Miga project](https://github.com/users/joolibar/projects/7)

The board is a GitHub Project owned by `joolibar` and linked to the repository. How the team uses it is in the [Scrum guide](scrum.md); this section lists how it is configured. Fields and views were created with `gh project` and the GraphQL API (needs `gh auth refresh -s project`).

**Status** (the columns):

| Column      | Meaning                                          |
| ----------- | ------------------------------------------------ |
| Backlog     | Not ready to start: needs details or decisions   |
| Ready       | Clear acceptance criteria; anyone can pick it up |
| In progress | Someone is working on it in a branch             |
| In review   | Pull request open, waiting for review and CI     |
| Done        | Merged into `develop`                            |

**Custom fields:**

| Field      | Type          | Values                                                                                                 |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `Module`   | Single select | Each subject module we claim (as in the README), plus `Mandatory`, `Core product` and `Infrastructure` |
| `Priority` | Single select | `P0` blocks the evaluation or other work, `P1` needed this phase, `P2` can wait                        |
| `Sprint`   | Iteration     | Two weeks, starting on Mondays; add new sprints in the field settings                                  |
| `Estimate` | Number        | Story points: 1, 2, 3, 5, 8 (13 means split it)                                                        |

GitHub's own fields are also used: `Milestone` (the phase), `Parent issue` and `Sub-issues progress` (epics), `Linked pull requests`, `Reviewers`.

**Milestones** (Issues → Milestones): one per phase, `Phase N — Name (vX.Y.Z)`, with no due date, as listed in the [roadmap](scrum.md#roadmap). Phase 1 holds the pull requests that set up the project.

**Views** (filters and visible fields already set by API). We keep only four while the team learns the board:

| View    | Layout | Filter                      | Visible fields                                           | Set by hand                                                                  |
| ------- | ------ | --------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Board   | Board  | `-label:epic`               | Assignees, Priority                                      | Column limit of 5 (one per member) on **In progress** (column ⋯ → Set limit) |
| Backlog | Table  | `-label:epic -status:Done`  | Status, Priority, Estimate, Sprint, Milestone, Assignees | Group by `Milestone`; manual order inside each group (the PO drags rows)     |
| Epics   | Table  | `label:epic`                | Sub-issues progress, Module, Milestone                   | Group by `Milestone`                                                         |
| My work | Table  | `assignee:@me -status:Done` | Status, Priority, Sprint                                 | Sort by `Priority`                                                           |

**Workflows** (⋯ → Workflows): GitHub's built-in automations move the cards, so no GitHub Actions are needed for the board. The API can list them but not turn them on, so they are set by hand. All of them are configured as follows:

| Workflow                       | Setting                                           | Why                                                                                                                                 |
| ------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Auto-add to project            | On, filter `is:issue,pr is:open`, this repository | Every new issue and PR lands on the board                                                                                           |
| Auto-add sub-issues to project | On                                                | Issues created under an epic appear too                                                                                             |
| Item added to project          | On, status `Backlog`                              | New work starts unrefined                                                                                                           |
| Pull request linked to issue   | On, status `In review`                            | Opening the PR moves its issue                                                                                                      |
| Code changes requested         | On, status `In progress`                          | The work goes back to its author                                                                                                    |
| Pull request merged            | On, status `Done`                                 |                                                                                                                                     |
| Item closed                    | On, status `Done`                                 |                                                                                                                                     |
| Item reopened                  | On, status `Ready`                                | It was not really done; someone picks it up again                                                                                   |
| Auto-archive items             | On, filter `is:closed updated:<@today-14d`        | Keeps **Done** short; items closed this sprint stay for the review. Archived items are not deleted and still count in epic progress |
| Code review approved           | Off                                               | There is no "approved" column: the author merges, and _Pull request merged_ moves the card                                          |
| Auto-close issue               | Off (GitHub shows it with a red icon)             | An issue is closed by its PR, never by moving its card                                                                              |

Moving a card to **In progress** stays manual: it is the signal that someone has taken the issue.

We decided against GitHub Actions for the board: a project owned by a user can only be changed by an Action with a personal access token stored as a secret, which is one more credential to protect for something the built-in workflows already do.

**Access:** a project owned by a user has its own access list, separate from the repository's. Giving someone access to the repository does **not** give them the board: invite each team member in ⋯ → Settings → Manage access with the **Write** role. The project is private; the repository is public.

The board, issues and PRs are the evidence for the README's "Project Management" section.

## 9. Initial backlog

These issues were created first (#16–#23), together with one epic per subject module (#25–#41) that groups them. The ones marked `mandatory` block the evaluation if missing. Later issues and epics (from #44 on) came from the roadmap and the product brief; the [roadmap](scrum.md#roadmap) lists them by phase, and the board is always the up-to-date list. The full backlog was written on 2026-11-03 from the product brief: one sub-issue per piece of work under every epic, plus the design epic (#66).

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
