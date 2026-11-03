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

## `permission denied` on `/var/run/docker.sock` (Linux)

Your user is not allowed to use Docker. Run `sudo usermod -aG docker "$USER"`, then log out and in again. On a campus computer without `sudo`, ask the staff; see the [setup guide](setup.md#on-the-42-campus-computers).

## `docker: 'compose' is not a docker command`

Your computer has only the old Compose v1 (`docker-compose`). Install the Compose v2 plugin (`docker-compose-plugin` on Ubuntu, from Docker's own repository); see the [setup guide](setup.md#linux).

## "No space left on device"

Docker images, volumes and build cache take several gigabytes. `docker system df` shows how much; `make clean` removes this project's; `docker builder prune` removes the build cache of every project. On campus, see the [disk quota advice](setup.md#on-the-42-campus-computers).

## Everything is very slow, or hot reload does not work (Windows)

The repository is under `C:\` or `/mnt/c/`. Clone it again inside the WSL2 home (`cd ~ && git clone …`) and work from the Ubuntu terminal; see the [setup guide](setup.md#windows).

## A script fails with `\r: command not found` or `bad interpreter`

The file has Windows line endings (CRLF). `.gitattributes` prevents this for files Git checks out, so it usually means the clone was made from Windows instead of WSL2, or an editor saved the file as CRLF. Clone again inside WSL2, or run `git add --renormalize . && git status` to see which files changed.

## The database logs "collation version mismatch"

The database volume was created with a different base image (for example before the move to Debian in [ADR 0006](../decisions/0006-debian-base-images.md)). Text indexes may be in the wrong order. With no data to keep, recreate it: `make clean && make`.

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
