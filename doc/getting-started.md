# Finding your way around

For anyone opening this project for the first time: how to get it running, what the
tooling around it is doing, and where the code lives. The [README](../README.md) has
the same setup as a short reference; this is the version with the reasons attached.

## Getting it running

You need **Node** — the runtime the dev server and the build both run on. This
project wants 20.19+, 22.13+ or 24+, which is written down in `engines` in
[`package.json`](../package.json), so `npm install` warns you if you are outside it.

```bash
node -v
npm install
npm run dev
```

Then open http://localhost:5173. The sample plan loads on every visit; edits last
until you reload.

`npm install` is the only setup step. The task page works immediately. The chat page
needs an endpoint — copy `.env.example` to `.env` and fill in the three values; the
README's **Chat endpoint** section says what they are.

## `package.json` and `node_modules`

[`package.json`](../package.json) is the project's definition. It holds the project
name, the Node range, the list of packages this project uses with an acceptable
version range for each, and the scripts you can run. It is short, it is hand-edited,
and it is committed.

`node_modules/` is the result of `npm install`: the actual code of every one of those
packages, plus everything those packages depend on in turn — thousands of folders.
You never edit it and it is never committed. If it ever seems broken, deleting it and
running `npm install` again is a normal thing to do, not a last resort.

`package-lock.json` sits between the two. `package.json` says "React 19.2 or
compatible"; the lock file records the exact version that was actually installed, so
everyone who clones the repo gets identical code. It is committed, and it is written
by npm — leave it alone and let `npm install` update it.

Two commands worth understanding:

- **`npm run <name>`** runs a script from `package.json`. While it runs, npm puts
  `node_modules/.bin/` on the PATH, which is why `npm run dev` can invoke `vite`
  even though `vite` is not installed system-wide.
- **`npx <tool>`** runs a tool's executable directly — `npx prettier --check .`,
  `npx shadcn@latest add dialog`. Use it for one-off commands that do not deserve
  their own script.

## The scripts

| Script                 | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Dev server. Edits appear in the browser as you save   |
| `npm run format`       | Prettier, rewriting files                             |
| `npm run format-check` | Prettier, reporting without rewriting                 |
| `npm run lint`         | ESLint — catches suspect code the type checker allows |
| `npm run lint-fix`     | The same, applying every fix ESLint can make itself   |
| `npm run type-check`   | TypeScript — the check you run while working          |
| `npm run preview`      | Serves a built `dist/` the way a real host would      |
| `npm run build`        | Builds `dist/`. Only builds — it checks nothing       |

Each script does one job. `build` produces the bundle and nothing else, so a type
error is reported by `type-check`, not by a build that happens to run `tsc` on the
way past.

## `dependencies` vs `devDependencies`

Both are lists of packages; the split is about **what runs in the browser**.

- **`dependencies`** — code that ends up inside what a visitor downloads. React is
  running while someone uses the page, so React is here.
- **`devDependencies`** — tools that run on your machine to produce or check that
  output, and then have no further part in it. Vite, TypeScript, ESLint and Prettier.

The line is about the package, not its output. Tailwind is a devDependency and its
compiled CSS is very much shipped — the compiling happens during `npm run build`, and
`tailwindcss` itself never reaches the browser.

`npm install <pkg>` adds to `dependencies`; `npm install -D <pkg>` adds to
`devDependencies`. Getting it wrong will not break the app, since both are installed
locally either way — it misleads the next person reading the list.

## What each package is for

**`dependencies`**

| Package                      | For                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `react`                      | the UI library — components, state, re-rendering                                              |
| `react-dom`                  | puts React's output into the actual page                                                      |
| `react-router-dom`           | maps URLs to pages, and the nav links between them                                            |
| `radix-ui`                   | unstyled, accessible primitives — the select, label, progress and separator that shadcn wraps |
| `shadcn`                     | the component registry: its CLI, and the theme layer `src/index.css` imports                  |
| `cn`                         | the `cn()` class helper, re-exported by `src/lib/utils.ts`                                    |
| `clsx`                       | builds a class string from conditions — what `cn` composes with                               |
| `tailwind-merge`             | resolves conflicting Tailwind classes, so a caller's class beats a component's default        |
| `class-variance-authority`   | declares a component's variants (`variant="outline"`, `size="sm"`)                            |
| `lucide-react`               | the icon set                                                                                  |
| `@fontsource-variable/geist` | the Geist typeface, served from this project rather than a CDN                                |

**`devDependencies`**

| Package                                           | For                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `vite`                                            | the dev server and the bundler                                         |
| `@vitejs/plugin-react`                            | teaches Vite about JSX and hot reloading                               |
| `tailwindcss`                                     | the CSS framework the class names come from                            |
| `@tailwindcss/vite`                               | runs Tailwind as part of the Vite build                                |
| `tw-animate-css`                                  | the animation utilities shadcn's components expect                     |
| `typescript`                                      | the type checker — the `tsc -b` behind `npm run type-check`            |
| `@types/react`, `@types/react-dom`, `@types/node` | types for libraries that ship without them                             |
| `eslint`                                          | the linter                                                             |
| `@eslint/js`                                      | ESLint's own recommended rules                                         |
| `typescript-eslint`                               | lets ESLint read TypeScript syntax                                     |
| `eslint-plugin-react-hooks`                       | catches hooks called conditionally or out of order                     |
| `eslint-plugin-react-refresh`                     | catches exports that would break hot reloading                         |
| `globals`                                         | the list of built-in browser globals, so ESLint does not flag `window` |
| `prettier`                                        | the formatter                                                          |

## Follow one screen down

Start at [`src/main.tsx`](../src/main.tsx). It does one thing: mount
[`src/App.tsx`](../src/App.tsx) into the page.

`App.tsx` is the whole routing table:

```tsx
<Route path={ROUTES.tasks} element={<TasksPage />} />
<Route path={ROUTES.chat} element={<ChatPage />} />
```

Two URLs, two pages. Everything either page needs sits beside it —
`src/pages/tasks/` and `src/pages/chat/`. Open
[`TasksPage.tsx`](../src/pages/tasks/TasksPage.tsx) and you can read the entire
screen in one go, because it is only composition:

```tsx
<TaskStats tasks={tasks} />
<TaskForm onSubmit={addTask} />
<TaskFilters filters={filters} total={tasks.length} view={view} onViewChange={setView} />

{view === 'list' ? (
  <TaskListView tasks={filters.visible} onUpdate={updateTask} onRemove={removeTask} />
) : (
  <TimelineView tasks={filters.visible} />
)}
```

Each of those names is a file in the same folder. Follow whichever one you care
about; none of them is more than a screenful.

## What a component actually is here

A component is a function that takes some data and returns markup. It never
modifies what it was given. [`StatTile`](../src/pages/tasks/StatTile.tsx) is the
clearest example — hand it a label, a number and an icon, get back a tile:

```tsx
<StatTile label="Overdue" value={summary.overdue} icon={TriangleAlert} />
```

The values in curly braces are **props** — arguments, passed by name. When a prop
changes, React re-runs the function and updates the page. You never write code that
finds an element and edits it; you change the data and let the render happen.

That is why almost every file under `src/pages/` is short. A component that draws
one thing and holds no state has nothing else to be.

## Where the moving parts live

Anything that remembers something, or changes over time, is a **hook** — a function
whose name starts with `use`. They all live in [`src/hooks/`](../src/hooks).

[`useTasks`](../src/hooks/useTasks.ts) is the one to read first:

```ts
export function useTasks(): TasksApi {
  const [tasks, setTasks] = useState<Task[]>(createSeedTasks)
  …
}
```

`useState` gives back the current value and a function to replace it. Calling
`setTasks` tells React the data changed, and every component displaying it redraws.
`useTasks` wraps that up and hands out `addTask`, `updateTask`, `removeTask` so no
component has to know how the list is stored.

The other hooks follow the same shape:

| Hook             | Owns                                                    |
| ---------------- | ------------------------------------------------------- |
| `useTasks`       | the task list and the ways to change it                 |
| `useTaskFilters` | the filter controls, and the narrowed list they produce |
| `useTaskDraft`   | the add-task form and whether it is valid               |
| `useTimeline`    | the dates, columns and rows the Gantt view draws        |
| `useChat`        | the conversation and the request in flight              |
| `useAutoScroll`  | keeping the chat pinned to the newest message           |

A rule that holds throughout: **if it only calculates, it is not a hook.**
`filterTasks`, `sortTasks` and `summarizeTasks` are plain functions in
[`src/utils/task.ts`](../src/utils/task.ts) — give them a list, get a list back.
Those are the easiest things to read and the easiest to be sure about, so logic is pushed
into them wherever it can go.

## The rest of the folders

| Folder                   | What is in it                                              |
| ------------------------ | ---------------------------------------------------------- |
| `src/pages/`             | components, grouped by the page they belong to             |
| `src/components/ui/`     | the shadcn controls: buttons, inputs, cards, badges        |
| `src/components/layout/` | the header and shell both pages render inside              |
| `src/hooks/`             | anything that holds state                                  |
| `src/utils/`             | plain functions that calculate                             |
| `src/types/`             | the shapes — what a `Task` is, what a `ChatMessage` is     |
| `src/constants/`         | fixed values: categories, labels, colours, the sample plan |
| `src/api/`               | the single network request                                 |

Nothing appears in two places. If you are looking for the list of categories it is
in `src/constants/`, and only there.

## Reading a type before its code

TypeScript here is used to say what things are, so a type is often the fastest
answer. [`src/types/task.ts`](../src/types/task.ts) tells you exactly what a task
is before you open anything that draws one:

```ts
export type Task = {
  id: string
  title: string
  category: Category
  status: Status
  …
}
```

`Category` and `Status` are not free-form text — they are fixed lists, so
`status: 'archived'` will not compile. Dates use `ISODate`, a string that can only
come from [`src/utils/date.ts`](../src/utils/date.ts), which stops a timestamp being
passed where a calendar date belongs.

Hovering a name in your editor shows its type. That is usually quicker than reading
the file it came from.

The fixed lists are wired to the maps that describe them. `STATUS_LABEL`,
`STATUS_CHIP` and `NEXT_STATUS` in
[`src/constants/task.ts`](../src/constants/task.ts) are each a `Record<Status, …>`,
so a new status is a build error in every place that has to handle it until it is
handled. The build report is the list of what is left to do.

## Check your work

Three commands while you work, and all three should be silent:

```bash
npm run format-check
npm run lint
npm run type-check
```

`npm run type-check` is the one that catches real mistakes; the other two keep the
code consistent with what is already there.

## Where to go next

- [`doc/product.md`](product.md) — what the app is for, and who for.
- [`doc/coding.md`](coding.md) — why the code is arranged this way.
- [`AGENTS.md`](../AGENTS.md) — the same decisions as a short list of rules.
