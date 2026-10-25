## Never commit push to `develop` or `main`


## Layout

```
frontend/   React, Vite, Tailwind, shadcn/ui
backend/    Fastify. Sample task and profile data
doc/        repository and product documentation
```

Everything below is `frontend/` convention.

## Language

English only: UI strings, comments, commit messages, docs. A request written in
another language is not a request for output in it.

## UI: shadcn/ui

- Build every screen out of shadcn. Add a component with `npx shadcn@latest add <name>`.
- `frontend/src/components/ui/` is copied source owned by this repo. Editing it is correct.
- Style through theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`,
  `bg-primary`, `border`, `bg-card`), not raw palette classes.
- `cn()` from `@/lib/utils` composes classes. No second helper. Rewrite the CLI's
  `import { cn } from 'cn'` to `@/lib/utils`.
- Keep `frontend/components.json` in sync.
- Icons are `lucide-react`, and nothing else. Use one on buttons, stat tiles, empty states
  and nav items rather than bare text. Inside a `Button` they size themselves; elsewhere
  pass an explicit `size-*`.
- Raw palette classes only where the colour **is** the data — the maps in
  `frontend/src/constants/task.ts`. That palette was validated for colour-vision
  separation; read the comment there before changing it.

## Tailwind

- Classes inline on the element. No named constant, no `styles.ts`.
- Exception: a class chosen by runtime data, as a lookup map in `frontend/src/constants/`.
- Class names stay literal strings. A constructed `bg-${colour}-500` is dropped at build
  time.

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

- `frontend/src/pages/**` holds components and nothing else.
- No `frontend/src/features/` folder.
- One file per thing, named for the thing.
- `frontend/src/api/` only when there is real external communication.
- `doc/product.md` is the product; keep technology out of it.
- `frontend/doc/coding.md` holds reasoning, not the README.
- Keep `frontend/doc/getting-started.md` in step with the code when files move.
- `doc/branch-naming.md` covers the whole repository.

## Imports

Always the `@/` alias, never relative paths. Wired in `frontend/vite.config.ts`,
`frontend/tsconfig.app.json` and `frontend/tsconfig.json`.

## Types

- `type`, not `interface`. The only exception is `ImportMetaEnv` in
  `frontend/src/vite-env.d.ts`.
- Unions and branded types over bare `string`. Dates are `ISODate`, minted only by
  `frontend/src/utils/date.ts`.
- `noUncheckedIndexedAccess` is on. Fix what it reports structurally, never with `!`.
- ESLint is deliberately not type-aware.

## React

- No `useMemo` or `useCallback` unless the value feeds a dependency array, goes to a
  memoised child, or the computation is measurably expensive.

## Tests

- `frontend/test/e2e/` — Playwright. Where behaviour is verified.
- `frontend/test/unit/` — Vitest. Pure logic only; if it is not pure, extract it or cover
  it end to end.
- Select by role and accessible name. Do not add test ids to the app.
- Assert invariants and relative changes, not numbers baked into the seed data, and never
  something the test does not exercise.

**Do not touch the tests unless you are told to.** A change that makes a test fail is not
permission to edit the test.

**Do not run the tests, and ignore test failures.**

## Verification

Do not verify behaviour by taking browser screenshots.
