# Documentation

| Path                                                     | What it contains                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`architecture.md`](architecture.md)                     | How the pieces fit together: services, requests, folders and conventions.       |
| [`guides/setup.md`](guides/setup.md)                     | Preparing a computer on macOS, Linux (and the 42 campus) or Windows.            |
| [`guides/workflow.md`](guides/workflow.md)               | How work flows: issue, branch, PR, review, merge and release.                   |
| [`guides/scrum.md`](guides/scrum.md)                     | Roles, sprints, Definition of Ready and Done, estimation and the project board. |
| [`decisions/`](decisions/)                               | Architecture Decision Records (ADRs): one file per important decision.          |
| [`guides/database.md`](guides/database.md)               | Migrations, schema conventions and database commands.                           |
| [`guides/dependencies.md`](guides/dependencies.md)       | Adding and updating dependencies safely.                                        |
| [`guides/github-setup.md`](guides/github-setup.md)       | Every GitHub setting the repository relies on, labels and initial backlog.      |
| [`guides/testing.md`](guides/testing.md)                 | How to run, write and organise tests.                                           |
| [`guides/troubleshooting.md`](guides/troubleshooting.md) | Common problems and how to fix them.                                            |

## Writing a new ADR

When the team makes a technical decision that someone will later ask "why?" about, add a file `decisions/NNNN-short-title.md` with the next number. Use this outline:

- **Status:** proposed, accepted, or superseded by NNNN
- **Context:** the problem and constraints
- **Decision:** what we chose
- **Consequences:** what becomes easier or harder

Do not rewrite an accepted ADR. If a decision changes, write a new one that supersedes it.
