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
