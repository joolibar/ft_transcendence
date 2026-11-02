# 0004 — Commits are authored by team members only

- **Status:** accepted
- **Date:** 2026-11-02

## Context

The subject evaluates the Git history: it must show commits from every team member and a fair distribution of work. Team members may use AI assistants. Some of these tools add themselves as co-authors (`Co-authored-by: …`) or commit under their own bot account, which makes them appear as contributors on GitHub and blurs who did the work.

The subject also asks us to describe honestly how AI was used.

## Decision

- Every commit is authored by a team member, with an email linked to their own GitHub account.
- No AI or bot identity appears in the history: no bot authors or committers, no AI `Co-authored-by` trailers, no "Generated with…" lines in commits or pull requests. Co-authoring between team members is allowed.
- AI usage is documented in the "Use of AI" section of the README.

It is enforced in three layers:

1. **Personal tool configuration:** each member configures their own assistants so they never add attribution. That configuration stays on their machine; tool-specific files are not committed.
2. **CI:** the `Commit authors` job ([`check-commit-authors.cjs`](../../.github/scripts/check-commit-authors.cjs)) fails any pull request that breaks the rule. It is a required check, so the PR cannot be merged.
3. **GitHub settings:** no AI GitHub Apps or coding agents are installed or enabled on the repository.

## Consequences

- Each member's contributions are visible under their own account, as the evaluation expects.
- A member whose Git email is not linked to their GitHub account gets a failing check until they fix `git config user.email`.
- If a commit with AI attribution slips into a branch, it must be reworded (`git commit --amend` or an interactive rebase) before the PR can be merged.
