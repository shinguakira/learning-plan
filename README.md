# Learning Plan

A study planner for someone teaching themselves software engineering.
**[`doc/product.md`](doc/product.md) explains what it is for** — read that first if
you want the why rather than the how.

## Layout

A Turborepo workspace. One install at the root, one lockfile, two packages.

```
frontend/             the app: React, Vite, Tailwind, shadcn/ui
backend/              Fastify. Serves sample task and profile data
doc/                  documentation about the repo and the product, plus the README images
package.json          the workspace root: the pnpm version and the turbo scripts
pnpm-workspace.yaml   the two packages, and which dependencies may run install scripts
turbo.json            what each task outputs and which of them are cached
vercel.json           routes the deployment to the two services
```

## Running it

Install once, from the root. That covers both packages. pnpm comes with Node through
corepack: `corepack enable` once, and `pnpm` then runs the version pinned in
`packageManager`.

```bash
corepack enable
pnpm install
cp backend/.env.example backend/.env
```

Then start both dev servers together:

```bash
pnpm run dev
```

The app is on http://localhost:5173 and the API on http://localhost:3001. Configure
chat through `backend/.env`. To run one on its own, `pnpm --filter ./frontend run dev` or
`pnpm --filter ./backend run dev`.

Node 24 or newer. The root and both packages declare it in `engines`, so `pnpm install` warns if
you are on anything older.

**nvm on macOS**

Install nvm, then reopen the terminal — the installer appends its startup lines to
your shell profile.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

Install a Node version this repo accepts and make it the default.

```bash
nvm install 24
nvm use 24
nvm alias default 24
```

## Documentation

| Where                                              | What                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| [`doc/product.md`](doc/product.md)                 | What the product is for and who for. No technology                     |
| [`doc/branch-naming.md`](doc/branch-naming.md)     | Where branches start, what they are called, how work reaches `develop` |
| [`doc/database.md`](doc/database.md)               | PostgreSQL setup, Prisma migrations and seeding                        |
| [`frontend/README.md`](frontend/README.md)         | The frontend's stack, setup and scripts                                |
| [`doc/getting-started.md`](doc/getting-started.md) | A tour of the frontend codebase for a first read                       |
| [`doc/coding.md`](doc/coding.md)                   | Why the frontend code is arranged the way it is                        |
| [`AGENTS.md`](AGENTS.md)                           | The repo's conventions, as a list of rules                             |

## Working on it

Branch from `develop`, never commit to `develop` or `main` directly, and merge
through a pull request — [`doc/branch-naming.md`](doc/branch-naming.md) has the rule
and the naming.

Before calling work done, all of these must pass from the root. Each runs in every
package that defines it, and turbo skips the ones whose inputs have not changed.

```bash
pnpm run format-check
pnpm run lint
pnpm run type-check
pnpm run test-unit
pnpm run test-e2e
```

`test-unit` and `test-e2e` exist in `frontend/` only. Add `--filter=learning-plan-backend`
to any of them to run it for one package.
