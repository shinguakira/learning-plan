# Learning Plan - frontend

The app itself. The [repository README](../README.md) covers both packages and how
they run together; **[`doc/product.md`](../doc/product.md) explains what the product
is for** if you want the why rather than the how.

## Tech stack

| Area            | Choice                               |
| --------------- | ------------------------------------ |
| Runtime         | Node 20.19+, 22.13+ or 24+           |
| Language        | TypeScript 6                         |
| Framework       | React 19                             |
| Routing         | React Router 7                       |
| Build           | Vite 8                               |
| Styling         | Tailwind CSS 4                       |
| UI library      | [shadcn/ui](https://ui.shadcn.com) 4 |
| Icons           | [lucide](https://lucide.dev)         |
| Unit tests      | Vitest 4                             |
| E2E tests       | Playwright 1.63                      |
| Lint            | ESLint 10                            |
| Format          | Prettier 3                           |
| Package manager | npm                                  |

## Setup

Requires **Node 20.19+, 22.13+ or 24+** — the range is declared in `engines`, so
`npm install` warns if you are outside it. Odd-numbered releases such as Node 23 are
not supported by ESLint 10 and will warn.

```bash
node -v          # check you are in range
npm install
```

To run the app:

```bash
npm run dev
```

Run `npm --prefix ../backend install` once, then start
`npm --prefix ../backend run dev` in another terminal.

Open http://localhost:5173.

To run the end-to-end tests, download the browser once first:

```bash
npx playwright install chromium
npm run test-e2e
```

### Chat endpoint

Copy `backend/.env.example` to `backend/.env` and configure `CHAT_API_URL`,
`CHAT_MODEL` and `CHAT_API_KEY` there. The backend development script loads that
file. Production reads the same names from the backend service environment. Never
use `VITE_` for provider credentials.

The backend accepts the OpenAI-style `/chat/completions` format. An HTTPS endpoint
requires a key; a loopback local runtime may use HTTP and an empty key.

## shadcn/ui

**Every control comes from shadcn/ui** — add more with:

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/` and are **owned by this repo** — copied
source, not a dependency, so editing them is expected and correct.
[`components.json`](components.json) holds the CLI config; the `@/` alias is
mirrored into the root [`tsconfig.json`](tsconfig.json) because that is where the
CLI's resolver looks. Icons come from [lucide](https://lucide.dev), shadcn's
configured icon library.

Styling conventions are in [`doc/coding.md`](../doc/coding.md).

## Available scripts

Every script defined in [`package.json`](package.json), and nothing else:

| Script                    | What it does                     |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Dev server with HMR              |
| `npm run format`          | Prettier, writing changes        |
| `npm run format-check`    | Prettier, check only             |
| `npm run lint`            | ESLint                           |
| `npm run lint-fix`        | ESLint, applying fixable rules   |
| `npm run type-check`      | TypeScript                       |
| `npm run test-unit`       | Vitest unit tests                |
| `npm run test-unit-watch` | Vitest in watch mode             |
| `npm run test-e2e`        | Playwright end-to-end tests      |
| `npm run test-e2e-ui`     | Playwright in watch/inspect mode |
| `npm run preview`         | Serve the production build       |
| `npm run build`           | Build to `dist/`                 |

`dist/` is a plain static bundle — host it anywhere that serves files.

## Folder structure

```
test/unit/                 Vitest specs for pure logic
test/e2e/                  Playwright specs
playwright.config.ts       starts the dev server, runs Chromium
src/pages/<page>/          components only, for that one page
src/components/ui/         shadcn components, owned by this repo
src/components/layout/     the shell every route renders inside
src/api/                   requests to the backend
src/hooks/                 hooks
src/types/                 every type
src/constants/             every constant
src/utils/                 this project's helpers
src/lib/utils.ts           cn - generic, reusable in any project
components.json            shadcn CLI config
eslint.config.js           ESLint flat config
.prettierrc.json           Prettier options
```
