# TypeScript quiz

Beginner questions about the types this repository actually uses. Every file and
line is linked, so the answer is always somewhere you can go and read.

Answers are in [`typescript-quiz-answers.md`](typescript-quiz-answers.md).

27 questions in four parts. Part S is the place to start.

---

## Part S — reading a signature

Start here. Every question in this part is about one line of real code.

Here is a function from this repo, labelled:

```ts
export function canViewTask(task: Task, user: MockUser): boolean {
//                          └── argument ─┘ └─ argument ─┘  └ return type
```

- Everything **inside the parentheses** is the arguments, separated by commas.
- Each argument is `name: Type`.
- The type **after the closing parenthesis**, following the `:`, is what the
  function gives back.
- The `{` starts the body — that is not part of the signature.

### S1

[`frontend/src/utils/date.ts#L40`](../frontend/src/utils/date.ts#L40)

```ts
export function addDays(iso: ISODate, days: number): ISODate
```

How many arguments does it take, and what does it return?

### S2

[`frontend/src/utils/date.ts#L60`](../frontend/src/utils/date.ts#L60)

```ts
export function isWeekend(iso: ISODate): boolean
```

Which is the return type?

- **A** — `iso`
- **B** — `ISODate`
- **C** — `boolean`
- **D** — `isWeekend`

### S3

[`frontend/src/utils/date.ts#L47`](../frontend/src/utils/date.ts#L47)

```ts
export function diffDays(a: ISODate, b: ISODate): number
```

Which call is written correctly?

- **A** — `diffDays("2026-01-01", "2026-01-10")`
- **B** — `diffDays(a, b)` where both are `ISODate`
- **C** — `diffDays(a)` where `a` is an `ISODate`
- **D** — `diffDays(a, b, c)` where all three are `ISODate`

### S4

Same function, `diffDays(a, b): number`. Which of these is valid?

- **A** — `const n: number = diffDays(a, b)`
- **B** — `const n: string = diffDays(a, b)`
- **C** — `diffDays(a, b)` on its own line, ignoring the result
- **D** — both **A** and **C**

### S5

[`frontend/src/utils/date.ts#L76`](../frontend/src/utils/date.ts#L76)

```ts
export function formatMonth(iso: ISODate): string
```

Takes a date, returns a `string`. Write the call that stores `"January 2026"` in
a variable called `label`, assuming you already have an `ISODate` called `start`.

### S6

[`frontend/src/utils/job.ts#L9`](../frontend/src/utils/job.ts#L9)

```ts
export function sortJobs(jobs: readonly Job[]): Job[]
```

What goes in, and what comes out?

---

## Part A — what a type is

### A1

[`frontend/src/constants/task.ts#L15`](../frontend/src/constants/task.ts#L15) and
[`frontend/src/types/task.ts#L6`](../frontend/src/types/task.ts#L6)

```ts
export const STATUSES = ["todo", "doing", "done"] as const
export type Status = (typeof STATUSES)[number]
```

What are the members of `Status`?

- **A** — `string`
- **B** — `"todo" | "doing" | "done"`
- **C** — `["todo", "doing", "done"]`
- **D** — `0 | 1 | 2`

### A2

[`frontend/src/constants/task.ts#L6`](../frontend/src/constants/task.ts#L6)

How many members does `Category`
([`types/task.ts#L5`](../frontend/src/types/task.ts#L5)) have?

- **A** — 3
- **B** — 4
- **C** — 6
- **D** — unlimited

### A3

[`frontend/src/types/task.ts#L39`](../frontend/src/types/task.ts#L39)

```ts
export type DueTone = "over" | "soon" | "calm"
```

This is written differently from `Status`. Why can `DueTone` be written by hand
while `Status` has to be derived from an array?

### A4

[`frontend/src/types/user.ts#L3`](../frontend/src/types/user.ts#L3) and
[`frontend/src/constants/user.ts#L3`](../frontend/src/constants/user.ts#L3)

Name the four members of `MockUser`.

### A5

[`frontend/src/types/task.ts#L47`](../frontend/src/types/task.ts#L47)

```ts
export type StatusFilter = Status | "all"
```

How many members does `StatusFilter` have?

- **A** — 1
- **B** — 2
- **C** — 3
- **D** — 4

### A6

[`frontend/src/types/date.ts#L13`](../frontend/src/types/date.ts#L13)

Dates in this repo are `ISODate`, not `string`. So this fails:

```ts
diffDays("2026-01-01", "2026-01-10")
```

Why won't a plain string do, when an `ISODate` is a string underneath?

---

## Part B — what a type contains

### B1

[`frontend/src/types/task.ts#L9`](../frontend/src/types/task.ts#L9) — the `Task` type

Match each field to its type.

| field | type |
| --- | --- |
| `title` | ? |
| `estimatedHours` | ? |
| `status` | ? |
| `assignee` | ? |

Choices: `string` · `number` · `Status` · `MockUser`

### B2

[`types/task.ts#L20`](../frontend/src/types/task.ts#L20) and
[`#L21`](../frontend/src/types/task.ts#L21) — `estimatedHours: number`, `note: string`

What is the type of `task.estimatedHours + task.note`?

- **A** — compile error
- **B** — `number`
- **C** — `string`
- **D** — `number | string`

### B3

[`frontend/src/types/job.ts#L13`](../frontend/src/types/job.ts#L13)

```ts
startDate: ISODate
endDate: ISODate | null
```

Why is only one of them `| null`?

### B4

[`frontend/src/types/certificate.ts#L9`](../frontend/src/types/certificate.ts#L9)

```ts
credentialUrl?: string
```

What is this field's type when you read it?

- **A** — `string`
- **B** — `string | null`
- **C** — `string | undefined`
- **D** — `string | null | undefined`

### B5

[`frontend/src/types/strength.ts#L1`](../frontend/src/types/strength.ts#L1)

`Strength` has four fields and no unions at all. Name them and their types.

---

## Part C — the six practice functions

Write each one, then check your reasoning here. All six are pure: they read only
their arguments and return a value.

### C1 · `isDone`

Goes beside
[`canViewTask`, `utils/task.ts#L9`](../frontend/src/utils/task.ts#L9).

```ts
export function isDone(task: Task): boolean
```

What happens if you write `task.status === "Done"` instead of `"done"`?

- **A** — compiles, always returns `false`
- **B** — compile error
- **C** — compiles, throws at runtime
- **D** — works, the comparison is case-insensitive

### C2 · `countByStatus`

```ts
export function countByStatus(tasks: Task[], status: Status): number
```

Which call does the compiler reject?

- **A** — `countByStatus(tasks, "todo")`
- **B** — `countByStatus(tasks, "doing")`
- **C** — `countByStatus(tasks, "finished")`
- **D** — `countByStatus([], "done")`

### C3 · `countByStatus`

What would change if the parameter were `status: string` instead?

- **A** — nothing, `Status` is just a `string`
- **B** — `"finished"` would compile and the function would return `0`
- **C** — the function would stop compiling
- **D** — every call site would need a cast

### C4 · `taskTitles`

```ts
export function taskTitles(tasks: Task[]): string[] {
  return tasks.map((task) => task)
}
```

What does the compiler say?

- **A** — nothing, `.map` returns an array
- **B** — `Type 'Task[]' is not assignable to type 'string[]'`
- **C** — `Property 'title' does not exist`
- **D** — nothing, but it returns `undefined` at runtime

### C5 · `taskTitles`

What type does `task` have inside `tasks.map((task) => …)`, and who decided it?

### C6 · `totalHours`

```ts
export function totalHours(tasks: Task[]): number {
  return tasks.reduce((sum, task) => sum + task.estimatedHours, 0)
}
```

Why does the trailing `0` matter for the **return type**?

- **A** — it doesn't, only for the runtime result
- **B** — without it the return type is `number | undefined`
- **C** — without it `reduce` won't compile at all
- **D** — without it the return type becomes `Task`

### C7 · `firstOverdue`

```ts
export function firstOverdue(tasks: Task[]): Task | null
```

A caller writes:

```ts
const task = firstOverdue(tasks)
console.log(task.title)
```

What happens?

- **A** — compiles, may crash at runtime
- **B** — compile error: `task` is possibly `null`
- **C** — compiles, prints `undefined` when nothing is found
- **D** — compile error: `Task` has no `title`

### C8 · `firstOverdue`

Which **two** of these let the caller use `task.title` safely?

- **A** — `if (task !== null) { … }`
- **B** — `task!.title`
- **C** — `task?.title`
- **D** — `(task as Task).title`

### C9 · `skillNames`

[`types/skill.ts#L3`](../frontend/src/types/skill.ts#L3),
[`constants/skill.ts#L3`](../frontend/src/constants/skill.ts#L3)

```ts
export function skillNames(skills: Skill[], level: SkillLevel): string[]
```

Which argument is valid?

- **A** — `"expert"`
- **B** — `"Expert"`
- **C** — `"senior"`
- **D** — `4`

### C10 · `skillNames`

Write the body. Two array methods, one line. The fields are at
[`types/skill.ts#L5`](../frontend/src/types/skill.ts#L5).

---

## The six functions, as a checklist

| # | signature | file |
| --- | --- | --- |
| 1 | `isDone(task: Task): boolean` | [`utils/task.ts`](../frontend/src/utils/task.ts) |
| 2 | `countByStatus(tasks: Task[], status: Status): number` | [`utils/task.ts`](../frontend/src/utils/task.ts) |
| 3 | `taskTitles(tasks: Task[]): string[]` | [`utils/task.ts`](../frontend/src/utils/task.ts) |
| 4 | `totalHours(tasks: Task[]): number` | [`utils/task.ts`](../frontend/src/utils/task.ts) |
| 5 | `firstOverdue(tasks: Task[]): Task \| null` | [`utils/task.ts`](../frontend/src/utils/task.ts) |
| 6 | `skillNames(skills: Skill[], level: SkillLevel): string[]` | [`utils/skill.ts`](../frontend/src/utils/skill.ts) |

Check your work with `npm run type-check` from `frontend/`. If it passes, the
types are right.
