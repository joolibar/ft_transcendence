# Setup guide

How to prepare a computer to work on Miga, on macOS, Linux (including the 42 campus computers) and Windows. The short version is in [CONTRIBUTING](../../CONTRIBUTING.md#setup); this guide explains each system and its usual problems.

## Why it works the same everywhere

- **Everything that is evaluated runs in Docker.** Node, the build, Prisma, PostgreSQL and nginx run inside Linux containers, so the host system does not matter. Each computer builds the images for its own processor (Apple Silicon and most Linux and Windows machines differ), and every image we use exists for both.
- **Versions are pinned exactly**, see [Runtime versions](dependencies.md#runtime-versions). Two computers building a month apart get the same Node, PostgreSQL and nginx.
- **Line endings are always LF.** [`.gitattributes`](../../.gitattributes) stops Git on Windows from converting files to CRLF, which would break the shell scripts that run inside the containers.

## Requirements

| Tool           | Version                                              | Needed for                                           | Check with               |
| -------------- | ---------------------------------------------------- | ---------------------------------------------------- | ------------------------ |
| Git            | 2.30 or newer                                        | Everything                                           | `git --version`          |
| Docker Engine  | 24 or newer                                          | `make` (the whole app)                               | `docker version`         |
| Docker Compose | **v2**, 2.20 or newer                                | `make`                                               | `docker compose version` |
| GNU Make       | Any                                                  | `make` shortcuts                                     | `make --version`         |
| Node           | Exactly the one in `.nvmrc`                          | `pnpm dev`, `pnpm test`, the editor (not for `make`) | `node -v`                |
| pnpm           | Exactly the one in `package.json` (`packageManager`) | Same as Node                                         | `pnpm -v`                |

Compose v2 is the command `docker compose` (with a space). The old `docker-compose` (with a hyphen) is Compose v1, which is no longer maintained, and the Makefile does not use it.

Only Docker is needed to run the app the way it is evaluated. Node and pnpm are needed to develop: hot reload, tests, linting and editor support.

## macOS

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and open it once, so the Docker engine is running.
2. Install Node with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), then, inside the repository:
   ```bash
   nvm install                          # reads .nvmrc
   npm install --global pnpm@12.9.1
   ```
3. Follow the rest of [CONTRIBUTING](../../CONTRIBUTING.md#setup).

`make` comes with the Xcode command line tools; if it is missing, run `xcode-select --install`.

## Linux

1. Install Docker Engine and the Compose plugin following [Docker's guide for your distribution](https://docs.docker.com/engine/install/). On Ubuntu the packages are `docker-ce` and `docker-compose-plugin`; the `docker.io` package from Ubuntu itself may come without Compose v2.
2. Let your user run Docker without `sudo`, then log out and in again:
   ```bash
   sudo usermod -aG docker "$USER"
   ```
3. Install `make` and `git` if they are missing (`sudo apt install make git` on Ubuntu).
4. Install Node with nvm and pnpm exactly as on macOS (step 2 above). nvm installs into your home folder, so it never needs `sudo`.

### On the 42 campus computers

Campus computers are shared and you usually have **no `sudo`**. Before anything else, check what is there:

```bash
docker version && docker compose version && make --version
```

- **Docker or Compose v2 missing, or "permission denied" on `/var/run/docker.sock`:** you cannot fix this without `sudo`. Ask the campus staff how Docker is provided on your cluster (some campuses have a script or a virtual machine for it).
- **Node and pnpm:** install them with nvm as above. It works without `sudo`.
- **Disk quota:** the home folder is small, and Docker images, `node_modules` and the database add up to several gigabytes. If you get "No space left on device", run `docker system df` to see what Docker uses and `make clean` to free this project's images and volumes. Many campuses have a larger local folder (often `goinfre` or `sgoinfre`, erased from time to time): keep the clone there if your home is full, and push your work often.
- **Shared computer:** never leave your `.env` or SSH keys behind on a computer you do not own. Use HTTPS with a token, or remove your SSH key at the end.

## Windows

Docker on Windows runs Linux containers inside **WSL2**, a real Linux system built into Windows. Work entirely inside it: the repository, the terminal and the commands. That makes Windows behave exactly like Linux, and `make` works.

1. Install WSL2 with Ubuntu. In PowerShell as administrator, then restart:
   ```powershell
   wsl --install -d Ubuntu
   ```
2. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/). In **Settings → General** keep "Use the WSL 2 based engine" on, and in **Settings → Resources → WSL integration** turn it on for Ubuntu.
3. Open the **Ubuntu** terminal. Everything from now on runs there.
4. Install the tools and Node:
   ```bash
   sudo apt update && sudo apt install -y make git
   ```
   Then nvm, Node and pnpm as on macOS (step 2 above).
5. Clone the repository **inside the Linux home** (`cd ~ && git clone …`), never in `C:\` or `/mnt/c/…`. Files under `/mnt/c` cross between Windows and Linux on every access: installs and builds become many times slower, file permissions are wrong and Vite does not notice changes, so hot reload stops working.
6. Open the project from Ubuntu with `code .` (VS Code with the **WSL** extension), so the editor also works inside Linux.

Do not run the project from PowerShell or CMD: `make` does not exist there, and Git for Windows would use different settings for line endings and file permissions.

## Check that everything works

From the repository, on any system:

```bash
pnpm install                 # fails with "Unsupported engine" if Node is not the pinned one
make                         # builds and starts the three services
make ps                      # db, api and web must say "healthy"
```

Open https://localhost:8443 and accept the certificate warning: the page must say that the API and the database are up. If something fails, see [troubleshooting](troubleshooting.md).
