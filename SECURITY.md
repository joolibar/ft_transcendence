# Security policy

Miga is a student project built as part of the 42 curriculum. It is not running in production, but we take security seriously and want to hear about any vulnerability you find.

## Reporting a vulnerability

**Please do not open a public issue.** Anyone can read issues, so the problem would be visible before it is fixed.

Report it privately instead: go to the [Security tab](https://github.com/joolibar/ft_transcendence/security) of the repository and click **Report a vulnerability**. Only the maintainers can see the report.

Include, as far as you can:

- What the problem is and what an attacker could do with it.
- The steps to reproduce it, or a proof of concept.
- The commit or version where you found it.

## What happens next

- We confirm that we received the report within **7 days**.
- We tell you whether we consider it a vulnerability and, if so, when we expect to fix it.
- Once it is fixed, we publish the advisory on GitHub and credit you, unless you prefer to stay anonymous.

## Supported versions

Only the latest version is maintained: the `develop` branch and the most recent release on `main`. Older releases do not receive fixes.

## Scope

In scope: the code in this repository (web app, API, database schema, Docker and nginx configuration, CI workflows).

Out of scope: vulnerabilities in third-party services or dependencies that are already publicly known (we track those through Dependabot), and attacks that need physical access to a user's device.
