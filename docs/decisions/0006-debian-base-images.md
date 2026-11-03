# 0006 — Debian base images for Node and PostgreSQL

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Every service runs from an official Docker image, and most official images come in two flavours of Linux:

- **Alpine:** very small, built on the **musl** C library.
- **Debian:** larger, built on **glibc**, the C library almost every Linux program is compiled and tested against.

We started with Alpine for everything because it is small. Before writing features we checked what that means for the modules we plan:

- **Native Node modules.** Password hashing (`argon2`), image processing for file uploads (`sharp`) and Prisma ship compiled code. Their musl builds are less tested, and when one is missing it has to be compiled during the build or fails at runtime.
- **Node support.** The Node.js project treats musl binaries as experimental; glibc is its first-class platform.
- **Text ordering in PostgreSQL.** PostgreSQL sorts text with the system C library. With musl, accented letters are sorted after every unaccented one. We measured it with the same list on both images:

  | Image  | `ORDER BY name`                                                  |
  | ------ | ---------------------------------------------------------------- |
  | Alpine | Bilbao, Ebro, Nube, Oca, Zaragoza, **Ávila**, **Ñam**, **éxito** |
  | Debian | **Ávila**, Bilbao, Ebro, **éxito**, **Ñam**, Nube, Oca, Zaragoza |

  Miga lists places by name in Spanish, Catalan and English, so the Alpine result would be visible to users.

## Decision

| Service                  | Image                         | Why                                                                            |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------ |
| API and web build (Node) | `node:<version>-trixie-slim`  | glibc: native modules and Prisma work without surprises; `slim` keeps it small |
| Database (PostgreSQL)    | `postgres:<version>-trixie`   | Correct ordering of accented text by default                                   |
| Web server (nginx)       | `nginx:<version>-alpine<x.y>` | Only serves static files and proxies requests: musl does not affect it         |

`trixie` is Debian 13. Exact versions are listed in the [dependencies guide](../guides/dependencies.md#runtime-versions).

We did not choose **distroless** images (only Node, no shell): they are even smaller, but the API container needs a shell to apply migrations before starting, and debugging without one is much harder for a student team.

## Consequences

- The Node and PostgreSQL images take about 350 MB more disk space in total. This matters on campus computers with a small disk quota, so the [setup guide](../guides/setup.md#on-the-42-campus-computers) explains how to free space.
- A database volume created by the Alpine image must be recreated once (`make clean && make`), because the stored text order depends on the C library. There were no tables yet when we switched, so no data was lost.
- Debian follows general Unicode rules, not those of a specific language: "Ñ" is sorted next to "N" instead of after it. Where a column must follow Spanish rules exactly, use an ICU collation, as explained in the [database guide](../guides/database.md#sorting-text).
- When Debian 14 is released, moving to it is a deliberate update in its own PR, like any other version change.
