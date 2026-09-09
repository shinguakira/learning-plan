import type { CATEGORIES, PRIORITIES, STATUSES } from '@/constants/task'
import type { ISODate } from '@/types/date'

export type Category = (typeof CATEGORIES)[number]
export type Status = (typeof STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  category: Category
  status: Status
  priority: Priority
  startDate: ISODate
  /** Never earlier than startDate. */
  dueDate: ISODate
  estimatedHours: number
  note: string
  /** Full ISO timestamp, not an ISODate - only used for sorting. */
  createdAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt'>

/** Tailwind classes a category wears in each place it appears. */
export interface CategoryTheme {
  /** Timeline bar fill */
  bar: string
  /** Legend / row dot */
  dot: string
  /** Category chip in the list view */
  chip: string
}

/** How urgent a due date is, used to colour the remaining-days label. */
export type DueTone = 'over' | 'soon' | 'calm'

export interface DueDescription {
  label: string
  tone: DueTone
}

export type ViewMode = 'list' | 'timeline'
export type StatusFilter = Status | 'all'
export type CategoryFilter = Category | 'all'
export type SortKey = 'due' | 'start' | 'priority' | 'created'

/**
 * A seed entry carries day offsets instead of dates; the real ISODates are
 * derived from today when the seed is expanded, so the two date fields are
 * deliberately absent rather than filled with placeholders.
 */
export interface SeedTask extends Omit<TaskDraft, 'startDate' | 'dueDate'> {
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
