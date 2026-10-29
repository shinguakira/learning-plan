# Learning Plan

A study planner for someone teaching themselves software engineering.
**[`doc/product.md`](doc/product.md) explains what it is for** — read that first if
you want the why rather than the how.

## Layout

Two packages, each with its own `package.json` and its own dependencies.

```
frontend/   the app: React, Vite, Tailwind, shadcn/ui
backend/    Fastify. Serves sample task and profile data
doc/        documentation about the repo and the product, plus the README images
vercel.json routes the deployment to frontend/
```

## Running it

Each package installs separately.

**Frontend**

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173.

**Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Serves sample data on http://localhost:3001. Configure chat through `backend/.env`.

Node 24 or newer. Both packages declare it in `engines`, so `npm install` warns if
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

Before calling frontend work done, all five must pass from `frontend/`:

```bash
npm run format-check
npm run lint
npm run type-check
npm run test-unit
npm run test-e2e
```

The backend has `npm run format-check`, `npm run lint` and `npm run type-check`.
