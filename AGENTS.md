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

Everything below is frontend convention, under `frontend/`. The backend has no
conventions of its own yet beyond `npm run type-check`.

## Language

Write everything in English: UI strings, code comments, commit messages, docs.
A request written in another language is not a request for output in it.

## UI: shadcn/ui

**shadcn/ui is the component layer for this project. Build every screen out of it.**

- Before hand-rolling a control, check whether shadcn has it and add it:
  `npx shadcn@latest add <component>`. Buttons, inputs, selects, cards, badges,
  dialogs, tables and the rest all come from there.
- Components land in `frontend/src/components/ui/` and are **owned by this repo** —
  they are copied source, not a dependency. Editing them is expected and correct.
- Style through the theme tokens shadcn installs (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-primary`, `border`, `bg-card`, …) rather than picking
  raw palette classes like `bg-slate-100`. Changing a token restyles the whole app.
- `cn()` from `@/lib/utils` composes classes. Do not add a second helper for it.
  The CLI writes `import { cn } from 'cn'` into components it generates — rewrite
  that to `@/lib/utils` after adding one, so there is a single entry point.
- Keep `frontend/components.json` in sync; the CLI reads it.

**Icons come from [lucide](https://lucide.dev)** (`lucide-react`), which is what
`frontend/components.json` sets as the icon library. Use one wherever it helps
scanning — on buttons, stat tiles, empty states, nav items — rather than leaving
controls as bare text. Inside a `Button` they size themselves; elsewhere pass an
explicit `size-*`. Never introduce a second icon set.

Raw palette colours are correct only where the colour **is** the data — the category,
status, priority and due-urgency maps in `frontend/src/constants/task.ts`, which say
which thing this is rather than decorating it. Use a theme token wherever one carries
the meaning (`text-muted-foreground`, `text-destructive`) and reach for a palette
class only for a state the theme has no token for. Everything else — surfaces,
borders, text, controls — is tokens. The category palette was validated for
colour-vision separation; see the comment in that file before touching it.

## Tailwind

- Write classes inline on the element. Never extract them into a named constant
  and never create a `styles.ts`.
- The exception is a class chosen by runtime data — `CATEGORY_THEME[task.category]`,
  `STATUS_CHIP[task.status]`. There is no single element to inline those onto, so a
  lookup map in `frontend/src/constants/` is right.
- Class names must stay literal strings. Tailwind scans source text, so a
  constructed `bg-${colour}-500` is dropped at build time.

## Folder structure

```
frontend/src/pages/<page>/      components only, for that one page
frontend/src/components/ui/     shadcn components
frontend/src/components/layout/ shared shell
frontend/src/types/             every type
frontend/src/constants/         every constant
frontend/src/hooks/             hooks
frontend/src/utils/             this project's own helpers
frontend/src/lib/               generic, would drop into another project unchanged
frontend/src/api/               only code that talks to something external
frontend/test/unit/             Vitest specs for pure logic
frontend/test/e2e/              Playwright specs
frontend/doc/                   why this code is arranged as it is
doc/                            repository and product documentation
```

`doc/product.md` describes what the product is for and who for — keep technology
out of it. `frontend/doc/coding.md` records why the code is arranged as it is; put
reasoning there rather than in the README, which stays stack, setup and structure
only. `frontend/doc/getting-started.md` walks the codebase for a first read — keep
its file paths and snippets in step with the code when you move things.
`doc/branch-naming.md` is the branching rule, and it covers the whole repository.

- `frontend/src/pages/**` holds components and nothing else.
- No `frontend/src/features/` folder.
- No vague filenames. One file per thing, named for the thing.
- `frontend/src/api/` only exists when there is real external communication.

## Imports

Always the `@/` alias, never relative paths. It is wired in `frontend/vite.config.ts`
(`resolve.alias`), `frontend/tsconfig.app.json` (`paths`) and `frontend/tsconfig.json`
(for the shadcn CLI's resolver).

## Types

- `type`, not `interface`, unless declaration merging is required. The only
  current exception is `ImportMetaEnv` in `frontend/src/vite-env.d.ts`.
- Prefer unions and branded types over bare `string`. Dates are `ISODate`
  (`frontend/src/types/date.ts`), minted only by `frontend/src/utils/date.ts`.
- `noUncheckedIndexedAccess` is on. Fix what it reports structurally; do not
  silence it with `!`.
- Type checking is `npm run type-check`. `npm run build` only builds, and ESLint is
  deliberately **not** type-aware, so no two tools overlap.

## React

- No `useMemo` or `useCallback` unless it is genuinely necessary: the value feeds a
  dependency array, goes to a memoised child, or the computation is measurably
  expensive. Sorting a few hundred rows is not expensive.

## Tests

Two layers, both under `frontend/test/`:

- **`test/e2e/`** — Playwright. The main check; this is where behaviour is verified.
- **`test/unit/`** — Vitest. Only for pure logic worth pinning down on its own, such
  as the search pipeline in `frontend/src/utils/task.ts`. If a function is not pure
  it does not belong here — extract it until it is, or cover it end to end.

Vitest is configured inside `frontend/vite.config.ts` (so it shares the `@/` alias)
with `include` scoped to `test/unit/`, so it never picks up the Playwright specs.

- Select by role and accessible name. Do not add test ids to the app.
- Assert invariants and relative changes, not numbers baked into the seed data.
- Never write a test that asserts something it does not actually exercise.

## Verification

Before calling frontend work done, all five must pass from `frontend/`:

```bash
npm run format-check
npm run lint
npm run type-check
npm run test-unit
npm run test-e2e
```

Do not verify behaviour by taking browser screenshots — write or run a test.

The backend has `npm run type-check`.

## Deleting

Only delete what was explicitly named. Removing a feature does not authorise
deleting adjacent files. If something looks orphaned, say so and leave it.
