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

Every piece of work starts as a GitHub issue, created with one of the templates (feature, bug or subject module task). The issue says **what** and **why**, and has acceptance criteria a reviewer can check. It belongs to an epic and a phase; how issues are planned into sprints is in the [Scrum guide](scrum.md).

- Take it from **Ready** in the current sprint, assign it to yourself and move it to **In progress** on the project board.
- One issue = one branch = one pull request. If the work turns out to be bigger, split the issue.
- Small fixes found along the way that are unrelated to your issue get their own issue, not a sneaky commit in your branch.

## 2. Create a branch

```bash
git switch develop
git pull
git switch -c feature/place-search
```

Pick the prefix by **what the change is**, not by who makes it:

| Prefix     | Use it for                                                                 | Examples                                                            |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `feature/` | Something a user or developer can now do that they could not before        | `feature/auth-signup`, `feature/group-voting`, `feature/places-api` |
| `fix/`     | Something that should work and does not                                    | `fix/review-form-validation`, `fix/chat-reconnect`                  |
| `chore/`   | Tooling, configuration, CI, dependencies, refactors with no visible change | `chore/update-dependencies`, `chore/ci-cache`                       |
| `docs/`    | Only documentation changes                                                 | `docs/database-schema`, `docs/readme-team`                          |

The name is lowercase words separated by hyphens. The `Branch name` check rejects anything else.

**What does not go in a branch:** changes for another issue, formatting of files you did not touch, "while I was here" refactors. They make the review harder and the history unclear.

## 3. Commit as you work

Commit small, coherent steps, each with a [Conventional Commit](https://www.conventionalcommits.org/) message:

```bash
git add apps/api/src/modules/places
git commit -m "feat(places): add search endpoint with filters"
```

- Each commit should leave the project working (it compiles and its tests pass).
- Add or update tests in the same commit as the behaviour they cover. See the [testing guide](testing.md).
- Commit only your own work, under your own GitHub account ([ADR 0004](../decisions/0004-commit-authorship.md)).

Your commits will be squashed into one when the PR is merged, so they are mainly for you and for the reviewer. Make them readable anyway: reviewers often go commit by commit.

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

## 5. Open the pull request

```bash
git push -u origin feature/place-search
gh pr create --base develop
```

- **Title:** Conventional Commits format, at most 72 characters. It becomes the commit message in `develop`.
- **Description:** fill in the template: what changes, how to test it, and the checklist. Write `Closes #42` to close the issue automatically when the PR is merged.
- **Labels:** the type (`feature`, `bug`, `chore`, `docs`) and the areas it touches (`area: web`, `area: api`, `area: infra`).
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

Click **Squash and merge**. The commit message is the PR title plus the list of its commits. The branch is deleted automatically and the issue moves to **Done**.

Then clean up locally:

```bash
git switch develop
git pull
git branch -D feature/place-search   # -D because squashed commits look unmerged to Git
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

## A bug in `main`

There is no direct path into `main`. Fix it like any other bug, in a `fix/` branch from `develop`, then make a release with the next patch version (for example `v0.2.1`). If the evaluation is close, that release can be made right after the fix is merged.

## Quick reference

| I want to…               | Do                                                                        |
| ------------------------ | ------------------------------------------------------------------------- |
| Start new work           | Issue → `git switch develop && git pull && git switch -c <prefix>/<name>` |
| Save progress            | `git commit -m "<type>(<scope>): <description>"`                          |
| Get the latest `develop` | `git fetch origin && git merge origin/develop`                            |
| Ask for review           | `git push` → `gh pr create --base develop`                                |
| Review someone's PR      | `gh pr checkout <number>`                                                 |
| Finish after merge       | `git switch develop && git pull && git branch -D <branch>`                |
| Release a phase          | PR `develop` → `main`, merge commit, tag, `gh release create`             |
