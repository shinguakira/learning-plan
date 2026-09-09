# Learning Plan

An IT study-planning app built with React, Vite, TypeScript and Tailwind CSS v4.
Frontend only — no backend, no API keys, no network calls.

- **Tasks** — add, delete and browse study tasks, with a switch between a list view
  and a Gantt-style timeline.
- **AI chat** — a standalone chatbot, unrelated to the task page. It matches
  keywords against a built-in set of topics and runs entirely in the browser.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173. Tasks are stored in `localStorage`, and sample data is
seeded on first run (`Reload sample data` restores it, `Delete all` clears it).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

`dist/` is a plain static bundle — host it anywhere that serves files.

## Layout

```
src/pages/tasks/           components only: TasksPage, TaskForm, TaskListView,
                           TimelineView, TaskStats, Field, Chip, EmptyState
src/pages/chat/            components only: ChatPage, Markdown
src/components/layout/     AppLayout - the shell both routes render inside
src/components/buttons/    empty for now (.gitkeep)
src/hooks/                 useChat, useTasks
src/types/                 app, chat, date, task
src/constants/             app, chat, date, seedTasks, task, timeline
src/utils/                 chat, date, task, seed, taskStorage - this project's helpers
src/lib/                   cn - generic, reusable in any project
eslint.config.js           ESLint flat config
```

## Notes

- `src/pages/**` holds components and nothing else. Types live in `src/types/`,
  constants in `src/constants/`, hooks in `src/hooks/`.
- There is no `src/api/` folder because the app makes no network calls. The chat bot
  is a keyword scan over a constant and tasks persist to `localStorage`, so both sit
  in `src/utils/` under their real names. `src/lib/` is only for code that would drop
  into another project unchanged.
- Type checking is `tsc -b`, which the `build` script runs before Vite. ESLint is
  deliberately not type-aware — it covers lint rules only, so the two do not overlap.
- Category colours are a categorical palette and were validated for lightness,
  chroma, colour-vision separation and surface contrast rather than picked by eye.
  The reasoning is recorded in [`src/constants/task.ts`](src/constants/task.ts).
  Indigo is reserved for the accent and is never used for a category.
- Dates are handled as local `'YYYY-MM-DD'` strings throughout. `new Date('2026-09-10')`
  parses as UTC and shifts the day in some timezones, so `src/utils/date.ts` parses
  and formats by hand.
- Tailwind class names must stay as literals — the scanner reads source text, so a
  constructed `bg-${colour}-500` would be dropped at build time.
