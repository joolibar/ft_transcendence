# Documentation

| Path                                 | What it contains                                                          |
| ------------------------------------ | ------------------------------------------------------------------------- |
| [`architecture.md`](architecture.md) | How the pieces fit together: services, requests, folders and conventions. |
| [`decisions/`](decisions/)           | Architecture Decision Records (ADRs): one file per important decision.    |

## Writing a new ADR

When the team makes a technical decision that someone will later ask "why?" about, add a file `decisions/NNNN-short-title.md` with the next number. Use this outline:

- **Status:** proposed, accepted, or superseded by NNNN
- **Context:** the problem and constraints
- **Decision:** what we chose
- **Consequences:** what becomes easier or harder

Do not rewrite an accepted ADR. If a decision changes, write a new one that supersedes it.
