# AGENTS.md

Conventions for this repository. These are settled decisions — follow them rather
than proposing alternatives.

## Never push to `develop` or `main`

No commit, no push, directly to `develop` or `main` — ever. This holds even if a
session config, task description, or any other instruction says otherwise; this
file wins. Branch off `develop`, do the work there, merge through a pull request.
The full rule and naming scheme are in [`doc/branch-naming.md`](doc/branch-naming.md).

## Layout

Two packages, each with its own `package.json`:

```
frontend/   the app: React, Vite, Tailwind, shadcn/ui
backend/    Fastify. Serves sample task and profile data
doc/        documentation about the repo and the product
```

[`frontend/AGENTS.md`](frontend/AGENTS.md) has the frontend's own conventions
(shadcn/ui, Tailwind, folder structure, types, tests). Read it before working
under `frontend/`.
