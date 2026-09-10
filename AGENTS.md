# AGENTS.md

Conventions for this repository. These are settled decisions — follow them rather
than proposing alternatives.

## Language

Write everything in English: UI strings, code comments, commit messages, docs.
A request written in another language is not a request for output in it.

## UI: shadcn/ui

**shadcn/ui is the component layer for this project. Build every screen out of it.**

- Before hand-rolling a control, check whether shadcn has it and add it:
  `npx shadcn@latest add <component>`. Buttons, inputs, selects, cards, badges,
  dialogs, tables and the rest all come from there.
- Components land in `src/components/ui/` and are **owned by this repo** — they are
  copied source, not a dependency. Editing them is expected and correct.
- Style through the theme tokens shadcn installs (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-primary`, `border`, `bg-card`, …) rather than picking
  raw palette classes like `bg-slate-100`. Changing a token restyles the whole app.
- `cn()` from `@/lib/utils` composes classes. Do not add a second helper for it.
- Keep the `components.json` config in sync; the CLI reads it.

**Icons come from [lucide](https://lucide.dev)** (`lucide-react`), which is what
`components.json` sets as the icon library. Use one wherever it helps scanning — on
buttons, stat tiles, empty states, nav items — rather than leaving controls as bare
text. Inside a `Button` they size themselves; elsewhere pass an explicit `size-*`.
Never introduce a second icon set.

The one place raw palette colours are correct is the task category palette in
`src/constants/task.ts`. Those encode data, not chrome, and were validated for
colour-vision separation — see the comment in that file before touching them.

## Tailwind

- Write classes inline on the element. Never extract them into a named constant
  and never create a `styles.ts`.
- The exception is a class chosen by runtime data — `CATEGORY_THEME[task.category]`,
  `STATUS_CHIP[task.status]`. There is no single element to inline those onto, so a
  lookup map in `src/constants/` is right.
- Class names must stay literal strings. Tailwind scans source text, so a
  constructed `bg-${colour}-500` is dropped at build time.

## Folder structure

```
src/pages/<page>/      components only, for that one page
src/components/ui/     shadcn components
src/components/layout/ shared shell
src/types/             every type
src/constants/         every constant
src/hooks/             hooks
src/utils/             this project's own helpers
src/lib/               generic, would drop into another project unchanged
src/api/               only code that talks to something external
test/unit/             Vitest specs for pure logic
test/e2e/              Playwright specs
```

- `src/pages/**` holds components and nothing else.
- No `src/features/` folder.
- No vague filenames. One file per thing, named for the thing.
- `src/api/` only exists when there is real external communication. `localStorage`
  is not an API.

## Imports

Always the `@/` alias, never relative paths. It is wired in `vite.config.ts`
(`resolve.alias`), `tsconfig.app.json` (`paths`) and `tsconfig.json` (for the
shadcn CLI's resolver).

## Types

- `type`, not `interface`, unless declaration merging is required. The only
  current exception is `ImportMetaEnv` in `src/vite-env.d.ts`.
- Prefer unions and branded types over bare `string`. Dates are `ISODate`
  (`src/types/date.ts`), minted only by `src/utils/date.ts`.
- `noUncheckedIndexedAccess` is on. Fix what it reports structurally; do not
  silence it with `!`.
- Type checking is `tsc`, run inside `npm run build`. ESLint is deliberately
  **not** type-aware so the two do not overlap.

## React

- No `useMemo` or `useCallback` unless it is genuinely necessary: the value feeds a
  dependency array, goes to a memoised child, or the computation is measurably
  expensive. Sorting a few hundred rows is not expensive.

## Tests

Two layers, both under `test/`:

- **`test/e2e/`** — Playwright. The main check; this is where behaviour is verified.
- **`test/unit/`** — Vitest. Only for pure logic worth pinning down on its own, such
  as the search pipeline in `src/utils/task.ts`. If a function is not pure it does
  not belong here — extract it until it is, or cover it end to end.

Vitest is configured inside `vite.config.ts` (so it shares the `@/` alias) with
`include` scoped to `test/unit/`, so it never picks up the Playwright specs.

- Select by role and accessible name. Do not add test ids to the app.
- Assert invariants and relative changes, not numbers baked into the seed data.
- Never write a test that asserts something it does not actually exercise.

## Verification

Before calling work done, all five must pass:

```bash
npm run build        # includes the type check
npm run lint
npm run format:check
npm run test:unit
npm run test:e2e
```

Do not verify behaviour by taking browser screenshots — write or run a test.

## Deleting

Only delete what was explicitly named. Removing a feature does not authorise
deleting adjacent files. If something looks orphaned, say so and leave it.
