# Deployment

The whole repository deploys to **one Vercel project on one domain**: the app at `/`,
the API at `/api/*`. There is no second project and no separately hosted backend, so
nothing the browser does is ever cross-origin.

## Why the backend is not a Fastify service on Vercel

The obvious shape — [Vercel Services](https://vercel.com/docs/services) with
`frontend/` and `backend/` as two services — does not work for this backend. It is
worth recording why, because the configuration looks correct and fails anyway.

Vercel's Services backend builder relocates the compiled entrypoint to the function
root (`/var/task/`) **without the directory structure around it**. That leaves
`backend/package.json` behind, and with it `"type": "module"`. Node then reads the
compiled `.js` as CommonJS and refuses to load it:

```
/var/task/server.js:1
import Fastify from 'fastify';
SyntaxError: Cannot use import statement outside a module
```

Every way around it is blocked by another face of the same bug:

| Attempt                                   | Result                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| Force ESM by extension (`.mts` → `.mjs`)  | Module loads, dependency paths no longer line up: `Cannot find package 'fastify'` |
| `entrypoint: "dist/server.js"`            | Rejected at validation, before the build runs — `dist/` is not committed      |
| `outputDirectory: "."` (the documented workaround) | Builds and loads, but globs all of `backend/` and the function cannot be invoked at all, with no log output |

This is upstream: [vercel/vercel#17651](https://github.com/vercel/vercel/issues/17651).
The builder is Beta. Nothing in this repository is wrong, and none of it is worth
working around in application code.

## What we do instead

The API is a plain Vercel Function in [`api/`](../api), built by `@vercel/node` —
the long-stable builder, not the Beta one.

```
api/skills.ts      GET /api/skills, deployed
backend/           the same data behind Fastify, for local development
```

What makes this safe is that the layers underneath the route have **no external
dependencies**: `skillService` → `seedSkills` → `types/skill` are plain TypeScript.
Nothing there imports Fastify, so there is nothing for the builder to trace and the
failure above cannot happen.

The cost is that the HTTP layer exists twice — a Fastify route locally, a Web handler
deployed. The data and the service layer are shared between them, so what is
duplicated is the route definition and nothing else. **Business rules belong in
`backend/src/services/`, where both paths reach them.**

## Options if this stops being enough

Once the backend is a real server — several routes, middleware, request validation —
duplicating the route layer stops being cheap. Two ways forward then:

1. **Container runtime.** `backend/Dockerfile.vercel` plus
   `"runtime": "container"` on the service. Fastify runs exactly as written, autoload
   and all. Costs a Dockerfile and slower builds, and containers must bind `0.0.0.0`
   and default to port **80**, not 3001. Scales to zero after 5 minutes in production
   and 30 seconds in preview, so expect cold starts; the filesystem is not persistent.
   See [Container Images](https://vercel.com/docs/functions/container-images).
2. **Revisit Services** once vercel/vercel#17651 is fixed. The configuration we want
   is already written down in this file's history.

## Local development

Both halves run from their own package, and the dev server proxies `/api` to the
backend so the single relative URL is correct in both places:

```bash
cd backend && npm run dev     # Fastify on :3001
cd frontend && npm run dev    # app on :5173, /api proxied to :3001
```

The task page and the profile page's job history need no backend at all — both are
seeded in the frontend. Only the skill list fetches.
