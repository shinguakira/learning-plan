import type { SeedTask } from "../types/task.js"

export const TASK_CSV_COLUMNS = [
  "title",
  "category",
  "status",
  "priority",
  "estimatedHours",
  "note",
  "offsetStart",
  "span",
] as const satisfies readonly (keyof SeedTask)[]
