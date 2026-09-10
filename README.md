# Learning Plan

An IT study-planning app built with React, Vite, TypeScript and Tailwind CSS v4.
Frontend only — there is no backend; the chat page calls a completions endpoint
straight from the browser.

- **Tasks** — add, delete and browse study tasks, with a switch between a list view
  and a Gantt-style timeline.
- **AI chat** — a standalone chatbot, unrelated to the task page. It POSTs to the
  endpoint you configure in `.env`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173. Tasks are stored in `localStorage`, and sample data is
seeded on first run (`Reload sample data` restores it, `Delete all` clears it).

The chat page needs an endpoint. Copy [`.env.example`](.env.example) to `.env` and set:

```
VITE_CHAT_API_URL=
VITE_CHAT_API_KEY=
VITE_CHAT_MODEL=
```

The request body is the OpenAI-style `/chat/completions` shape, so any provider or
local runtime that speaks it works — no vendor is baked in. `VITE_CHAT_API_KEY` can
be left blank for a local runtime that does not need one. Note that Vite inlines
`VITE_*` into the bundle, so a key you set here ships inside `dist/`.

## Available scripts

Every script defined in [`package.json`](package.json), and nothing else:

| Script                 | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Dev server with HMR               |
| `npm run build`        | Type-check, then build to `dist/` |
| `npm run preview`      | Serve the production build        |
| `npm run lint`         | ESLint                            |
| `npm run format`       | Prettier, writing changes         |
| `npm run format:check` | Prettier, check only              |
| `npm run test:e2e`     | Playwright end-to-end tests       |
| `npm run test:e2e:ui`  | Playwright in watch/inspect mode  |

`dist/` is a plain static bundle — host it anywhere that serves files.

## Folder structure

```
test/e2e/                  Playwright specs: tasks, chat, navigation
playwright.config.ts       starts the dev server, runs Chromium
src/pages/tasks/           components only: TasksPage, TaskForm, TaskListView,
                           TimelineView, TaskStats, Field, Chip, EmptyState
src/pages/chat/            components only: ChatPage, Markdown
src/components/layout/     AppLayout - the shell both routes render inside
src/components/buttons/    empty for now (.gitkeep)
src/api/chat.ts            the completions request - the only network call
src/hooks/                 useChat, useTasks
src/types/                 app, chat, date, task
src/constants/             app, chat, date, seedTasks, task, timeline
src/utils/                 chat, date, task, seed, taskStorage - this project's helpers
src/lib/                   cn - generic, reusable in any project
eslint.config.js           ESLint flat config
.prettierrc.json           Prettier options
```

## Notes

- `src/pages/**` holds components and nothing else. Types live in `src/types/`,
  constants in `src/constants/`, hooks in `src/hooks/`.
- `src/api/` holds the one thing that talks to the outside world. Task persistence
  is `localStorage`, so it sits in `src/utils/taskStorage.ts` rather than pretending
  to be an API. `src/lib/` is only for code that would drop into another project
  unchanged.
- There is no offline fallback: if the endpoint is unset or fails, the chat says so
  instead of inventing an answer.
- End-to-end tests are the check that matters here; there are no unit tests. Each
  Playwright test gets a fresh browser context, so `localStorage` starts empty and
  the seed data is re-created - no per-test cleanup. The chat specs stub the endpoint
  with `page.route`, and the test server points at an unresolvable host so a spec that
  forgets to stub fails loudly instead of reaching a real provider.
- Type checking happens inside `npm run build`, so a type error fails the build.
  ESLint is deliberately not type-aware, which keeps `npm run lint` and the build
  from overlapping.
- Category colours are a categorical palette and were validated for lightness,
  chroma, colour-vision separation and surface contrast rather than picked by eye.
  The reasoning is recorded in [`src/constants/task.ts`](src/constants/task.ts).
  Indigo is reserved for the accent and is never used for a category.
- Dates are handled as local `'YYYY-MM-DD'` strings throughout. `new Date('2026-09-10')`
  parses as UTC and shifts the day in some timezones, so `src/utils/date.ts` parses
  and formats by hand.
- Tailwind class names must stay as literals — the scanner reads source text, so a
  constructed `bg-${colour}-500` would be dropped at build time.
