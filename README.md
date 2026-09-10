# Learning Plan

A study planner for someone teaching themselves software engineering.
**[`doc/product.md`](doc/product.md) explains what it is for** — read that first if
you want the why rather than the how.

- **Tasks** — add, delete and browse study tasks, with a switch between a list view
  and a Gantt-style timeline.
- **AI chat** — a standalone chatbot, unrelated to the task page. It POSTs to the
  endpoint you configure in `.env`.

Frontend only. There is no backend and nothing is persisted: the task list lives in
memory for the session, and the chat page calls a completions endpoint straight from
the browser.

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

Open http://localhost:5173. The sample plan loads on every visit and edits last only
until you reload (`Reload sample data` restores it, `Delete all` empties the list).

To run the end-to-end tests, download the browser once first:

```bash
npx playwright install chromium
npm run test-e2e
```

### Chat endpoint

The chat page needs one. Copy [`.env.example`](.env.example) to `.env` and set:

```
VITE_CHAT_API_URL=
VITE_CHAT_API_KEY=
VITE_CHAT_MODEL=
```

The request body is the OpenAI-style `/chat/completions` shape, so any provider or
local runtime that speaks it works — no vendor is baked in. `VITE_CHAT_API_KEY` can
be left blank for a local runtime that does not need one.

Without an endpoint the rest of the app works normally; only the chat page reports
that it is unconfigured.

## shadcn/ui

**Every control on both pages comes from shadcn/ui** — buttons, inputs, selects,
labels, cards, badges, the separator and the progress meter. Add more with:

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/` and are **owned by this repo** — copied
source, not a dependency, so editing them is expected and correct.
[`components.json`](components.json) holds the CLI config; the `@/` alias is
mirrored into the root [`tsconfig.json`](tsconfig.json) because that is where the
CLI's resolver looks. Icons come from [lucide](https://lucide.dev), shadcn's
configured icon library.

Styling conventions are in [`doc/coding.md`](doc/coding.md).

## Available scripts

Every script defined in [`package.json`](package.json), and nothing else:

| Script                    | What it does                     |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Dev server with HMR              |
| `npm run type-check`      | TypeScript                       |
| `npm run lint`            | ESLint                           |
| `npm run format`          | Prettier, writing changes        |
| `npm run format-check`    | Prettier, check only             |
| `npm run test-unit`       | Vitest unit tests                |
| `npm run test-unit-watch` | Vitest in watch mode             |
| `npm run test-e2e`        | Playwright end-to-end tests      |
| `npm run test-e2e-ui`     | Playwright in watch/inspect mode |
| `npm run preview`         | Serve the production build       |
| `npm run build`           | Build to `dist/`                 |

`dist/` is a plain static bundle — host it anywhere that serves files.

## Folder structure

```
doc/product.md             what the product is for, no tech
doc/getting-started.md     a tour of the codebase for a first read
doc/coding.md              why the code is arranged the way it is
test/unit/                 Vitest specs for the search logic
test/e2e/                  Playwright specs: tasks, chat, navigation
playwright.config.ts       starts the dev server, runs Chromium
src/pages/tasks/           components only: TasksPage, TaskStats, StatTile, TaskForm,
                           FormField, TaskFilters, SegmentedButton, TaskListView,
                           TaskRow, StatusToggle, TimelineView, TimelineHeader,
                           TimelineBar, TimelineLegend, EmptyState
src/pages/chat/            components only: ChatPage, ChatBubble, ThinkingBubble,
                           ChatEmpty, ChatComposer, AssistantAvatar, Markdown
src/components/ui/         shadcn components, owned by this repo
src/components/layout/     AppLayout - the shell both routes render inside
src/components/buttons/    empty for now (.gitkeep)
src/api/chat.ts            the completions request - the only network call
src/hooks/                 useTasks, useChat, useTaskFilters, useTaskDraft,
                           useTimeline, useAutoScroll
src/types/                 app, chat, date, task, timeline
src/constants/             app, chat, date, seedTasks, task, timeline
src/utils/                 date, task, timeline, seed - this project's helpers
src/lib/utils.ts           cn - generic, reusable in any project
components.json            shadcn CLI config
eslint.config.js           ESLint flat config
.prettierrc.json           Prettier options
```
