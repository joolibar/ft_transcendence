# Workflow guide

How a piece of work travels from an idea to the version that is evaluated. The rules behind it are in [ADR 0003](../decisions/0003-branching-and-commits.md) (branches and commits) and [ADR 0005](../decisions/0005-releases-and-versioning.md) (releases).

## The big picture

```
 Issue ──► Branch from develop ──► Commits ──► Pull request ──► Review + CI ──► Squash into develop
                                                                                       │
                                     At the end of each phase: release PR develop ──► main + tag
```

| Branch      | Lives   | Receives changes from                    | Merge method |
| ----------- | ------- | ---------------------------------------- | ------------ |
| `main`      | Forever | Release PRs from `develop` only          | Merge commit |
| `develop`   | Forever | PRs from work branches                   | Squash       |
| Work branch | Days    | Your own commits (and `develop` updates) | —            |

## 1. Start from an issue

Every piece of work starts as a GitHub issue, created with one of the templates (feature, bug or subject module task; the epic template is for the PO). The issue says **what** and **why**, and has acceptance criteria a reviewer can check. It belongs to an epic and a phase; how issues are planned into sprints is in the [Scrum guide](scrum.md).

- First time? Set up your computer with [CONTRIBUTING](../../.github/CONTRIBUTING.md#setup) and turn on the [commit hook](#check-your-messages-before-committing).
- Take it from **Ready** in the current sprint, assign it to yourself and move it to **In progress** on the project board.
- One issue = one branch = one pull request. If the work turns out to be bigger, split the issue.
- Small fixes found along the way that are unrelated to your issue get their own issue, not a sneaky commit in your branch.

## 2. Create a branch

```bash
git switch develop
git pull
git switch -c feature/44-save-places
```

The name is **`<prefix>/<issue>-<description>`**: the prefix, the number of the issue it closes and a few lowercase words separated by hyphens. The `Branch name` check rejects anything else.

Pick the prefix by **what the change is**, not by who makes it. Each prefix takes some commit types (see [Commit messages](#commit-messages)):

| Prefix     | Use it for                                                          | Commit types it takes                                                 | Examples                                                   |
| ---------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `feature/` | Something a user or developer can now do that they could not before | `feat`, `perf`                                                        | `feature/18-email-sign-up`, `feature/99-live-voting`       |
| `fix/`     | Something that should work and does not                             | `fix`, `revert`                                                       | `fix/301-review-form-validation`, `fix/302-chat-reconnect` |
| `chore/`   | Tooling, CI, dependencies, refactors, tests with no product change  | `chore`, `refactor`, `test`, `style`, `build`, `ci`, `perf`, `revert` | `chore/62-postgis`, `chore/61-accessibility-checks`        |
| `docs/`    | Only documentation                                                  | `docs`                                                                | `docs/23-readme-team`                                      |

Every change has an issue, even a small one: it is what the board, the history and the evaluation follow. If the work has none, create it first (it takes a minute).

**What does not go in a branch:** changes for another issue, formatting of files you did not touch, "while I was here" refactors. They make the review harder and the history unclear.

## 3. Commit as you work

Commit small, coherent steps, each with a message that follows the [commit conventions](#commit-messages):

```bash
git add backend/src/modules/places
git commit -m "feat(places): add the save place endpoint"
```

- Each commit should leave the project working (it compiles and its tests pass).
- Add or update tests in the same commit as the behaviour they cover. See the [testing guide](testing.md).
- Commit only your own work, under your own GitHub account ([ADR 0004](../decisions/0004-commit-authorship.md)).

Your commits stay in the pull request, and only the PR title reaches `develop` (see step 7). They are for you and for the reviewer, who often goes commit by commit, so write them as carefully as the title. The optional [commit hook](#check-your-messages-before-committing) checks them for you.

## 4. Keep your branch up to date

When `develop` moves while you work, bring its changes into your branch. GitHub also requires the branch to be up to date before merging.

```bash
git fetch origin
git merge origin/develop
```

Or click **Update branch** on the pull request page.

Use **merge**, not rebase, once the branch has been pushed: merging never rewrites published history, so it never needs a force push. The extra merge commits disappear when the PR is squashed.

### Resolving conflicts

A conflict means you and someone else changed the same lines. Git marks them in the file:

```
<<<<<<< HEAD
your version
=======
the version in develop
>>>>>>> origin/develop
```

1. Open each conflicted file (`git status` lists them) and decide what the result must be: often a combination of both.
2. Delete the markers, then run the checks: `pnpm lint && pnpm typecheck && pnpm test`.
3. `git add` the files and `git commit` to finish the merge.
4. If you do not understand the other change, ask its author before choosing.

## 5. Run the checks, then open the pull request

Before pushing, run locally what CI will run. It takes a minute and saves a red check and a second round of review. The tests need the database (`make db`).

```bash
pnpm format                          # fix the formatting
pnpm lint && pnpm typecheck          # same rules as CI
pnpm test:coverage                   # every test, and the 80 % coverage minimum
pnpm build                           # backend and frontend compile
```

| Local command        | CI check it matches                                         |
| -------------------- | ----------------------------------------------------------- |
| `pnpm format:check`  | `Format and lint`                                           |
| `pnpm lint`          | `Format and lint`                                           |
| `pnpm typecheck`     | `API typecheck and build`, `Web typecheck and build`        |
| `pnpm build`         | `API typecheck and build`, `Web typecheck and build`        |
| `pnpm test:coverage` | `Tests`                                                     |
| `make clean && make` | `Docker images build` (only when you touch Docker or nginx) |
| The commit hook      | `PR title` checks the same rules on the title               |

The other checks (`Branch name`, `Commit authors`, `Dependency review`, `Convention scripts tests` and CodeQL) only run on GitHub. If one fails, [troubleshooting](troubleshooting.md#a-pr-check-fails) says what to do.

```bash
git push -u origin feature/44-save-places
gh pr create --base develop
```

- **Title:** a [commit message](#commit-messages) header, at most 72 characters, with a type that belongs to the branch prefix. It becomes the commit in `develop`.
- **Description:** fill in the template: what changes, how to test it, and the checklist. Write `Closes #42` to close the issue automatically when the PR is merged.
- **Labels:** the type (`feature`, `bug`, `chore`, `docs`) and the areas it touches: `area: web` for `frontend/`, `area: api` for `backend/`, `area: infra` for Docker, nginx and CI.
- Move the issue to **In review** on the board.
- Open it as a **draft** if you want early feedback before it is finished.

Keep PRs small: under about 400 changed lines is easy to review well. A big feature can arrive in several PRs, each one working on its own.

## 6. Review

**As the author:** read your own diff on GitHub before asking for a review; you will catch things. Answer every comment, either with a change or with an explanation.

**As the reviewer:**

- Pull the branch and try it: `gh pr checkout <number>`, then follow "How to test it".
- Check that it does what the issue asked, that new behaviour has tests, that inputs are validated in the web app and in the API, and that the documentation is updated.
- Check that files are where [the architecture](../architecture.md) says they go and follow the naming conventions.
- Comment on the code, not the person. Mark small preferences as "nit:" so the author knows they are optional.
- **Approve** when it is ready, or **Request changes** with a clear list of what is missing.

All conversations must be resolved and every check green before merging.

## 7. Merge

Click **Squash and merge**. The commit in `develop` is the PR title, with the PR number that GitHub adds at the end, for example `feat(places): add save places (#45)`; the working commits stay in the PR. The branch is deleted automatically and the issue moves to **Done**.

Then clean up locally:

```bash
git switch develop
git pull
git branch -D feature/44-save-places # -D because squashed commits look unmerged to Git
git fetch --prune                    # forget remote branches that no longer exist
```

## 8. Release to `main`

`main` only changes at the end of each phase of the roadmap, after the internal demo, following [ADR 0005](../decisions/0005-releases-and-versioning.md).

1. Make sure `develop` is green and the demo went well: `make clean && make` works from scratch.
2. Open the release PR:
   ```bash
   gh pr create --base main --head develop --title "chore(release): v0.2.0"
   ```
   In the description, list what the release contains (the squashed PR titles since the last release).
3. Merge it with **Create a merge commit** (never squash into `main`: it would make `main` and `develop` diverge).
4. Tag the release and publish it:
   ```bash
   git switch main && git pull
   git tag -a v0.2.0 -m "v0.2.0"
   git push origin v0.2.0
   gh release create v0.2.0 --generate-notes
   ```
5. Close the phase's milestone (Issues → Milestones → Close).

## A bug in `main`

There is no direct path into `main`. Fix it like any other bug, in a `fix/<issue>-…` branch from `develop`, then make a release with the next patch version (for example `v0.2.1`). If the evaluation is close, that release can be made right after the fix is merged.

## Quick reference

| I want to…               | Do                                                                                |
| ------------------------ | --------------------------------------------------------------------------------- |
| Start new work           | Issue → `git switch develop && git pull && git switch -c <prefix>/<issue>-<name>` |
| Save progress            | `git commit -m "<type>(<scope>): <description>"`                                  |
| Get the latest `develop` | `git fetch origin && git merge origin/develop`                                    |
| Check before pushing     | `pnpm format && pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build`  |
| Ask for review           | `git push` → `gh pr create --base develop`                                        |
| Review someone's PR      | `gh pr checkout <number>`                                                         |
| Finish after merge       | `git switch develop && git pull && git branch -D <branch>`                        |
| Release a phase          | PR `develop` → `main`, merge commit, tag, `gh release create`                     |

## Commit messages

Every commit, and every PR title, follows [Conventional Commits](https://www.conventionalcommits.org/) with our own types and scopes. They live in [`.github/conventions.json`](../../.github/conventions.json), which the `PR title` check and the commit hook both read ([ADR 0010](../decisions/0010-commit-conventions.md)).

```
<type>(<scope>): <description>

<body: why the change was needed, and anything the reviewer should know>

Closes #44
```

**The header (first line)**

- **Type:** what kind of change it is (table below). It must belong to the branch prefix.
- **Scope** (optional, recommended): the part of Miga it touches, from the list below. When it touches several, use the main one or leave it out.
- **Description:** in English, in the imperative, starting with a lowercase letter and without a final period: "add", "fix", "remove", as in "this commit will _add_ …". At most 72 characters for the whole line.
- **Breaking change:** a `!` before the colon (`refactor(api)!: rename review routes`) and a `BREAKING CHANGE:` line in the footer explaining what breaks.

**The body (optional):** after a blank line, explain **why**, not what: the diff already shows what. Wrap lines at about 72 characters.

**The footer (optional):** `Closes #44` closes the issue when it lands in `develop`, `Co-authored-by: Name <email>` credits a teammate who worked with you.

**Types**

| Type       | Use it for                                                                |
| ---------- | ------------------------------------------------------------------------- |
| `feat`     | Something a user can now do that they could not before                    |
| `fix`      | Something that should work and did not                                    |
| `perf`     | Same behaviour, faster or lighter                                         |
| `refactor` | Code changed without changing behaviour                                   |
| `test`     | Tests added or fixed, no product change                                   |
| `docs`     | Documentation only                                                        |
| `style`    | Formatting only (Prettier, whitespace), no logic                          |
| `build`    | Dependencies, Docker images, the build                                    |
| `ci`       | GitHub Actions workflows and checks                                       |
| `chore`    | Anything else that does not touch the product (tooling, config, releases) |
| `revert`   | Undo an earlier commit                                                    |

**Scopes**

| Area           | Scopes                                                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product        | `auth`, `users`, `places`, `collections`, `reviews`, `friends`, `messages`, `plans`, `notifications`, `recommendations`, `llm`, `search`, `uploads`, `game`, `diary`, `feed`, `moderation`, `gdpr`, `public-api`, `analytics` |
| Cross-cutting  | `ui`, `i18n`, `a11y`, `realtime`, `security`                                                                                                                                                                                  |
| Code and data  | `web`, `api`, `shared`, `db`                                                                                                                                                                                                  |
| Infrastructure | `infra`, `ci`, `deps`, `release`                                                                                                                                                                                              |
| Documentation  | `readme`, `guides`, `adr`, `scrum`, `github`                                                                                                                                                                                  |

The code scopes follow the folders: `web` is `frontend/`, `api` is `backend/`, `shared` is `shared/` and `db` is `backend/prisma/` ([ADR 0013](../decisions/0013-code-folders.md) keeps the short names).

A new area needs a new scope: add it to `.github/conventions.json` and to this table in its own small PR.

**Good and bad examples**

| ❌ Avoid                           | ✅ Write                                         | Why                                       |
| ---------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| `Added login`                      | `feat(auth): add email and password log-in`      | Type, scope, imperative, says what        |
| `fix: bug`                         | `fix(plans): close the vote when everyone voted` | Says which bug, from the user's side      |
| `feat(Places): Add search.`        | `feat(places): add search with filters`          | Lowercase scope and verb, no final period |
| `chore: changes`                   | `build(deps): update fastify to 5.3`             | The right type, and what changed          |
| `wip`, `fix typo`, `final version` | One commit per coherent step, each with a header | Commits are read in the review            |
| `feat(authentication): …`          | `feat(auth): …`                                  | Only scopes from the list                 |

**One change, one commit**: if the description needs "and", it is probably two commits (or two PRs).

### Check your messages before committing

The `PR title` check only sees the title. To check every commit as you write it, turn on the commit hook once per clone:

```bash
pnpm hooks:install
```

From then on, `git commit` runs [commitlint](https://commitlint.js.org/) with the same types and scopes, and refuses a message that does not follow them, telling you why. It is optional, so nobody is blocked by their own machine, but it saves a red check later. To skip it once (for example, a merge with a generated message), use `git commit --no-verify`.
