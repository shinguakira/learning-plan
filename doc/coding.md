# Coding notes

Why the code is arranged the way it is. These are decisions with reasons attached —
the terse rule form lives in [`AGENTS.md`](../AGENTS.md).

## Where code goes

`src/pages/**` holds components and nothing else. Everything else has its own home:
types in `src/types/`, constants in `src/constants/`, hooks in `src/hooks/`, this
project's helpers in `src/utils/`, and `src/lib/` only for code that would drop into
another project unchanged.

`src/api/` holds the one thing that talks to the outside world — the chat request.
Nothing else belongs there. A folder called `api` whose contents never leave the
machine is a lie the next reader has to unlearn.

## Persistence

There is none. The task list lives in `useTasks` for the life of the page and is
re-seeded on every load. An earlier version wrote it to `localStorage`, which bought
a per-browser copy nobody had asked for and brought a storage key to version, a
validation guard for whatever was already in there, and two tests that only proved
the storage worked.

## Components and hooks

Each component is one concern. Anything stateful or derived is a hook:

- `useTaskFilters` owns the filter controls and the list they narrow.
- `useTaskDraft` owns the add-task form and its validation.
- `useTimeline` derives everything the Gantt needs from the task list.
- `useAutoScroll` is generic and reusable.

Pure derivations are **not** hooks. `summarizeTasks`, `filterTasks`, `sortTasks`,
`computeDomain` and `monthSegments` are plain functions in `src/utils/`, because
there is no state for a hook to own and a wrapper would only make them harder to
test.

## Memoisation

There is no `useMemo` or `useCallback` anywhere. Each candidate was checked against
three questions — does the value feed a dependency array, does it go to a memoised
child, is the computation measurably expensive — and none passed. Filtering and
sorting a few hundred rows is cheaper than the dependency check guarding it.

## Types

Dates are `ISODate`, a branded string minted only by `src/utils/date.ts`. Before
that, `startDate` was a plain `string` and nothing stopped a full ISO timestamp
flowing into date maths. `createdAt` is deliberately left as `string` and documented
as _not_ an `ISODate`.

Dates are handled as local `'YYYY-MM-DD'` throughout. `new Date('2026-09-10')` parses
as UTC and shifts the day in some timezones, so `src/utils/date.ts` parses and
formats by hand.

`noUncheckedIndexedAccess` is on. Everything it reported was fixed structurally —
narrowed index types, an exhaustive `NEXT_STATUS` map, destructuring with defaults —
rather than silenced with `!`. The only `!` in `src/` is `getElementById('root')` in
`main.tsx`.

Each check is its own script. `npm run type-check` is `tsc`; `npm run build` only
builds; ESLint is deliberately not type-aware. No tool reports what another already
reports.

## Styling

Every control comes from shadcn/ui, so style through the theme tokens it installs —
`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-card`,
`border` — rather than raw palette classes. Changing one token restyles the whole
app. `cn()` composes classes and resolves conflicts through `tailwind-merge`, which
is what lets a caller override a component's own variant classes.

Icons are used wherever they help scanning — nav items, buttons, stat tiles, empty
states. Inside a `Button` they size themselves; elsewhere they need an explicit
`size-*`.

Tailwind class names must stay literal strings. The scanner reads source text, so a
constructed `bg-${colour}-500` is dropped at build time.

Classes are written on the element, never extracted into a named constant. The
exception is a class chosen by runtime data — `CATEGORY_THEME[task.category]`,
`STATUS_CHIP[task.status]` — where there is no single element to inline onto.

The colour maps in [`src/constants/task.ts`](../src/constants/task.ts) are where raw
palette classes are correct, because there the colour is the data: which category,
which status, how urgent. A token is still used wherever one carries the meaning —
`text-muted-foreground` for the neutral end of every scale, `text-destructive` for
overdue and high priority — and a palette class only for a state the theme has no
token for, such as in-progress blue and done green. Category colours were validated
for lightness, chroma, colour-vision separation and surface contrast rather than
picked by eye; the reasoning is in the comment above them.

ESLint's `react-refresh/only-export-components` is switched off for
`src/components/ui/**`: shadcn exports its cva variants alongside the component by
design. The rule stays on everywhere else.

## The chat

There is no offline fallback. If the endpoint is unset or the request fails, the chat
says so rather than inventing an answer. An earlier version shipped a keyword bot as
a fallback, which meant a broken configuration looked like a working product.

## Tests

End-to-end tests are the main check. Nothing is persisted, so every test starts from
the same sample plan with no cleanup step. The chat specs stub the endpoint with `page.route`, and the test
server points at an unresolvable host so a spec that forgets to stub fails loudly
instead of reaching a real provider.

Assertions avoid numbers baked into the seed data. They read counts off the page and
check invariants instead — the status filters and the category filters must each
partition the whole list — so the specs survive any edit to the sample plan.

Unit tests cover the pure search pipeline only: `filterTasks` and `sortTasks`. That
is where a subtle bug hides without anything visibly breaking. Vitest is configured
in `vite.config.ts` so it shares the `@/` alias, with `include` scoped to `test/unit/`
so it never picks up the Playwright specs.

shadcn's `Select` is a Radix listbox, not a native `<select>`, so the specs open the
trigger and click an option rather than calling `selectOption`.
