import type {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  TASK_FILTER_KEYS,
  VIEW_MODES,
} from "@/constants/task"
import type { ISODate } from "@/types/date"
import type { MockUser } from "@/types/user"

export type Category = (typeof CATEGORIES)[number]
export type Status = (typeof STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

export type Task = {
  id: string
  title: string
  category: Category
  status: Status
  priority: Priority
  /** One of the header's selectable users. */
  assignee: MockUser
  startDate: ISODate
  /** Never earlier than startDate. */
  dueDate: ISODate
  estimatedHours: number
  note: string
  /** Full ISO timestamp, not an ISODate - only used for sorting. */
  createdAt: string
}

export type TaskDraft = Omit<Task, "id" | "createdAt">

/** Tailwind classes a category wears in each place it appears. */
export type CategoryTheme = {
  /** Timeline bar fill */
  bar: string
  /** Legend / row dot */
  dot: string
  /** Category chip in the list view */
  chip: string
}

/** How urgent a due date is, used to colour the remaining-days label. */
export type DueTone = "over" | "soon" | "calm"

export type DueDescription = {
  label: string
  tone: DueTone
}

export type ViewMode = (typeof VIEW_MODES)[number]
export type TaskFilterKey = (typeof TASK_FILTER_KEYS)[keyof typeof TASK_FILTER_KEYS]

export type StatusFilter = Status | "all"
export type CategoryFilter = Category | "all"
export type SortKey = "due" | "start" | "priority" | "created"

/** What the filter row narrows the task list by. */
export type TaskFilterCriteria = {
  status: StatusFilter
  category: CategoryFilter
  /** Free text; matched against title and note, trimmed and case-insensitive. */
  query: string
}

/**
 * A seed entry carries day offsets instead of dates; the real ISODates are
 * derived from today when the seed is expanded, so the two date fields are
 * deliberately absent rather than filled with placeholders. The backend has
 * no notion of the header's mock users either, so the assignee is rotated
 * in when the seed is expanded, the same way the dates are derived.
 */
export type SeedTask = Omit<TaskDraft, "startDate" | "dueDate" | "assignee"> & {
  offsetStart: number
  span: number
}

/** Per-status counts plus the totals the stats row shows. */
export type TaskSummary = Record<Status, number> & {
  total: number
  overdue: number
  hours: number
  /** Percentage of tasks done, 0-100. */
  rate: number
}
