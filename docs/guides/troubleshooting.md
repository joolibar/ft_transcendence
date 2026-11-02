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

```bash
nvm use                         # Node version from .nvmrc
npm install --global pnpm@12    # pnpm version from package.json
```

## Start again from scratch

```bash
make clean   # deletes containers, the database volume, certificates and images
make
```

## A PR check fails

| Check             | What to do                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `Format and lint` | Run `pnpm format` and `pnpm lint` locally, fix and push                                                     |
| `PR title`        | Edit the PR title; the check re-runs automatically                                                          |
| `Branch name`     | Create a correctly named branch from yours and open a new PR                                                |
| `Commit authors`  | Fix `git config user.email`, then reword the commits (`git commit --amend --reset-author` for the last one) |
| Others            | Open the check's log on GitHub; the failing step shows the error                                            |
