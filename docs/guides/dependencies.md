# Dependencies guide

## Adding a dependency

Install it in the workspace that uses it, never at the root unless it is a repository-wide tool:

```bash
pnpm --filter @miga/web add some-library
pnpm --filter @miga/api add --save-dev some-tool
```

Before adding one, check that it is maintained (recent releases, open issues answered), widely used, and that we really need it. Every dependency is code we are responsible for.

Versions are pinned exactly (`"zod": "4.6.7"`, not `"^4.6.7"`): everyone, CI and Docker install the same thing, recorded in `pnpm-lock.yaml`.

## Release age protection

pnpm refuses package versions published too recently. Most malicious releases are detected and removed within hours, so waiting protects the project from supply-chain attacks. If an install fails because a version is too new, use the previous version instead of disabling the protection.

## Build scripts

pnpm does not run install scripts of dependencies unless they are listed under `allowBuilds` in [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml). Add a package there only when it needs to download or compile a native binary (Prisma, esbuild), and say why in the PR.

## Updating dependencies

Updates are done by a team member, never by a bot (see [ADR 0004](../decisions/0004-commit-authorship.md)). Once a month, or when GitHub shows a Dependabot security alert:

1. Create a branch: `chore/update-dependencies`.
2. See what is outdated:
   ```bash
   pnpm outdated --recursive
   ```
3. Update patch and minor versions together. Update **major** versions one per PR, after reading their changelog for breaking changes.
4. Run everything: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && make re`.
5. Open the PR listing what changed and anything that needed fixing.

## Security alerts and overrides

Two things watch the dependencies:

- **Dependabot alerts** (Security tab on GitHub) report known vulnerabilities in what is already in `develop`. They never open pull requests: a team member fixes each alert in a `chore/` branch.
- The **`Dependency review`** check blocks a pull request that adds or updates a dependency with a known vulnerability of moderate severity or higher. Choose another version or another package instead.

`pnpm audit` shows the same information locally.

When the vulnerable package is not ours but a dependency of a dependency, and its parent has not released a fix yet, force the patched version with an entry under `overrides` in [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml). Every entry needs a comment with the advisory and who uses the package, and must be removed once the parent depends on a fixed version. After adding one, check that the tools using that package still work (for example, that `pnpm lint` still reports errors in a file with a mistake).

| Override    | Advisory                                                                 | Used by | Remove when                      |
| ----------- | ------------------------------------------------------------------------ | ------- | -------------------------------- |
| `minimatch` | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | ESLint  | ESLint depends on `minimatch` 11 |

## Runtime versions

Node, pnpm, PostgreSQL and nginx are pinned to **exact** versions, so every computer, the CI and the evaluation run the same thing. A tag like `node:24` moves every time a new release comes out: two people building a week apart would get different versions, and the bugs that causes look like "it works on my machine".

| What       | Version   | Where it is pinned                                                                                  |
| ---------- | --------- | --------------------------------------------------------------------------------------------------- |
| Node       | `24.22.2` | `.nvmrc`, `engines` in `package.json`, `FROM` in `apps/api/Dockerfile` and `infra/nginx/Dockerfile` |
| pnpm       | `12.9.1`  | `packageManager` in `package.json`, `npm install --global` in both Dockerfiles                      |
| PostgreSQL | `17.11`   | `docker-compose.yml` and the `Tests` job in `.github/workflows/ci.yml`                              |
| nginx      | `1.29.8`  | `FROM` in `infra/nginx/Dockerfile`                                                                  |

Docker tags also pin the Linux release underneath, because the base system changes too: Debian 13 (`-trixie`) for Node and PostgreSQL, Alpine 3.23 (`-alpine3.23`) for nginx. [ADR 0006](../decisions/0006-debian-base-images.md) explains why each one.

`engineStrict: true` in `pnpm-workspace.yaml` makes `pnpm install` stop with "Unsupported engine" when your Node does not match `engines`, instead of failing in strange ways later.

To update one of them, in a `chore/` branch:

1. Find the new exact tag on Docker Hub ([node](https://hub.docker.com/_/node), [postgres](https://hub.docker.com/_/postgres), [nginx](https://hub.docker.com/_/nginx)). Stay on the same major version unless the PR is about upgrading it.
2. Change it in **every** place listed in the table.
3. For Node, run `nvm install` (it reads `.nvmrc`) and reinstall pnpm for that Node: `npm install --global pnpm@12.9.1`.
4. Rebuild from scratch and run everything: `make clean && make`, then `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
