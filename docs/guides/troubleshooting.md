# Troubleshooting

## The browser says the connection is not private

Expected. In local use nginx generates a self-signed certificate, which browsers cannot verify. Click **Advanced → Proceed to localhost**. The connection is still encrypted.

## `make` fails: port 8443 is already in use

Another program uses that port. Set a different one in `.env`, for example `HTTPS_PORT=9443`, then run `make re` and open `https://localhost:9443`.

## `make db` fails: port 5432 is already in use

A PostgreSQL is already running on your machine (installed locally or from another project). Stop it, or stop the other project's containers (`docker ps` lists them). `make` itself does not need this port.

## The page says "API unreachable"

The web app cannot reach the API. Check each service:

```bash
make ps            # are all services "healthy"?
make logs          # look for errors, especially in api
```

Common causes: the API failed to start because `.env` has an invalid value (the log says which variable), or the database is still starting.

## The API logs "Invalid environment variables"

`.env` is missing a variable or has a wrong value. Compare it with `.env.example`, which lists every variable.

## I changed `.env` but nothing changed

Containers read `.env` when they are created. Run `make re`.

## API tests fail with "DATABASE_URL is not set" or cannot connect

The API tests use a real database. Start it with `make db`, and check that `.env` exists and its `DATABASE_URL` points to `localhost:5432`.

## `pnpm install` fails with "Ignored build scripts"

A new dependency wants to run an install script. See [build scripts](dependencies.md#build-scripts).

## `pnpm install` fails because a version is too new

See [release age protection](dependencies.md#release-age-protection).

## Wrong Node or pnpm version

`pnpm install` stops with "Unsupported engine" when your Node is not the one the project pins. Install it and use it:

```bash
nvm install                          # installs and selects the Node version in .nvmrc
npm install --global pnpm@12.9.1     # pnpm version from package.json
```

Global packages belong to each Node version, so after switching Node with nvm, `pnpm` may be "command not found" until you install it again.

## Start again from scratch

```bash
make clean   # deletes containers, the database volume, certificates and images
make
```

## `git push` is rejected with "Repository rule violations"

You pushed directly to `develop` or `main`. Both are protected: changes only enter through a pull request. Move your commits to a new branch and open a PR:

```bash
git switch -c feature/my-change     # the new branch keeps your commits
git branch -f develop origin/develop # put local develop back where GitHub has it
git push -u origin feature/my-change
```

## `git push` is rejected with "Push cannot contain secrets"

GitHub's push protection found a password, key or token in one of your commits. Remove it from the files (it belongs in `.env`, which is ignored), rewrite your local commits so the secret is not in any of them (`git commit --amend` for the last one), and push again. Never use the "allow" link to push it anyway: the repository is public.

## A PR check fails

| Check             | What to do                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `Format and lint` | Run `pnpm format` and `pnpm lint` locally, fix and push                                                     |
| `PR title`        | Edit the PR title; the check re-runs automatically                                                          |
| `Branch name`     | Create a correctly named branch from yours and open a new PR                                                |
| `Commit authors`  | Fix `git config user.email`, then reword the commits (`git commit --amend --reset-author` for the last one) |
| Others            | Open the check's log on GitHub; the failing step shows the error                                            |
