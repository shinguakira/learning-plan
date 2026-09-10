# Learning Plan

An IT study-planning app built with React, Vite, TypeScript, Tailwind CSS v4 and
**[shadcn/ui](https://ui.shadcn.com)**. Frontend only — there is no backend; the chat
page calls a completions endpoint straight from the browser.

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
CLI's resolver looks.

Style through the theme tokens shadcn installs — `bg-background`, `text-foreground`,
`text-muted-foreground`, `bg-primary`, `bg-card`, `border` — rather than raw palette
classes, so changing one token restyles the whole app. `cn()` from
[`src/lib/utils.ts`](src/lib/utils.ts) composes classes and resolves Tailwind
conflicts through `tailwind-merge`, which is what lets a caller override a
component's own variant classes.

Icons are [lucide](https://lucide.dev), which is shadcn's configured icon library —
`GraduationCap` for the mark, `ListTodo` / `MessageCircle` on the nav, `RotateCcw`,
`Trash2`, `Search`, `List`, `CalendarRange`, `Plus` on the controls, `CircleDashed` /
`LoaderCircle` / `CircleCheck` / `TriangleAlert` / `Clock` on the stat tiles, and
`Bot` / `MessageSquarePlus` / `ArrowUp` on the chat. Dropped inside a `Button` they
size themselves; elsewhere give them an explicit `size-*`.

The one place raw palette colours are deliberate is the task category palette in
[`src/constants/task.ts`](src/constants/task.ts) — those encode data, not chrome.

## Available scripts

Every script defined in [`package.json`](package.json), and nothing else:

| Script                    | What it does                      |
| ------------------------- | --------------------------------- |
| `npm run dev`             | Dev server with HMR               |
| `npm run build`           | Type-check, then build to `dist/` |
| `npm run preview`         | Serve the production build        |
| `npm run lint`            | ESLint                            |
| `npm run format`          | Prettier, writing changes         |
| `npm run format:check`    | Prettier, check only              |
| `npm run test:unit`       | Vitest unit tests                 |
| `npm run test:unit:watch` | Vitest in watch mode              |
| `npm run test:e2e`        | Playwright end-to-end tests       |
| `npm run test:e2e:ui`     | Playwright in watch/inspect mode  |

`dist/` is a plain static bundle — host it anywhere that serves files.

## Folder structure

```
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
                           useTimeline, useLocalStorageState, useAutoScroll
src/types/                 app, chat, date, task, timeline
src/constants/             app, chat, date, seedTasks, task, timeline
src/utils/                 date, task, timeline, seed, taskStorage - this project's helpers
src/lib/utils.ts           cn - generic, reusable in any project
components.json            shadcn CLI config
eslint.config.js           ESLint flat config
.prettierrc.json           Prettier options
```

## Notes

- `src/pages/**` holds components and nothing else. Types live in `src/types/`,
  constants in `src/constants/`, hooks in `src/hooks/`.
- Components stay one concern each, and anything stateful or derived is a hook:
  `useTaskFilters` owns the filter controls and the visible list, `useTaskDraft` owns
  the add-task form and its validation, `useTimeline` derives everything the Gantt
  needs. `useLocalStorageState` and `useAutoScroll` are generic and reusable.
  Pure derivations — `summarizeTasks`, `computeDomain`, `monthSegments` — are plain
  functions in `src/utils/` rather than hooks, since there is no state to own.
- `src/api/` holds the one thing that talks to the outside world. Task persistence
  is `localStorage`, so it sits in `src/utils/taskStorage.ts` rather than pretending
  to be an API. `src/lib/` is only for code that would drop into another project
  unchanged.
- There is no offline fallback: if the endpoint is unset or fails, the chat says so
  instead of inventing an answer.
- End-to-end tests are the main check. Each
  Playwright test gets a fresh browser context, so `localStorage` starts empty and
  the seed data is re-created - no per-test cleanup. The chat specs stub the endpoint
  with `page.route`, and the test server points at an unresolvable host so a spec that
  forgets to stub fails loudly instead of reaching a real provider.
- Unit tests cover the pure search pipeline only - `filterTasks` and `sortTasks` in
  `src/utils/task.ts`. They are worth having because that logic is where a subtle
  bug hides silently; everything else is checked end to end. Vitest is configured in
  `vite.config.ts` so it shares the `@/` alias, and its `include` is scoped to
  `test/unit/` so it never picks up the Playwright specs.
- shadcn's `Select` is a Radix listbox, not a native `<select>`, so the specs open the
  trigger and click an option rather than calling `selectOption`.
- ESLint's `react-refresh/only-export-components` rule is switched off for
  `src/components/ui/**`: shadcn exports its cva variants alongside the component by
  design. The rule stays on everywhere else.
- Type checking happens inside `npm run build`, so a type error fails the build.
  ESLint is deliberately not type-aware, which keeps `npm run lint` and the build
  from overlapping.
- Category colours are a categorical palette and were validated for lightness,
  chroma, colour-vision separation and surface contrast rather than picked by eye.
  The reasoning is recorded in [`src/constants/task.ts`](src/constants/task.ts).
- Dates are handled as local `'YYYY-MM-DD'` strings throughout. `new Date('2026-09-10')`
  parses as UTC and shifts the day in some timezones, so `src/utils/date.ts` parses
  and formats by hand.
- Tailwind class names must stay as literals — the scanner reads source text, so a
  constructed `bg-${colour}-500` would be dropped at build time.
