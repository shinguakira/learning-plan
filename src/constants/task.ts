import type { Category, CategoryTheme, DueTone, Priority, SortKey, Status } from '@/types/task'

export const CATEGORIES = [
  'Frontend',
  'Backend',
  'Infra / Cloud',
  'Database',
  'CS Fundamentals',
  'Certification',
] as const

export const STATUSES = ['todo', 'doing', 'done'] as const

export const VIEW_MODES = ['list', 'timeline'] as const

export const PRIORITIES = ['low', 'mid', 'high'] as const

/**
 * Category colors are a categorical palette, so they were not picked by eye:
 * they were run through the dataviz validator (light mode, default surface).
 *
 *   sky-600 #0084d1 / amber-600 #e17100 / emerald-600 #009966 /
 *   rose-600 #e7000b / violet-600 #7f22fe / teal-600 #009689
 *
 * Result: lightness band, chroma floor, normal-vision separation and contrast
 * vs the surface all pass. The one caveat is the adjacent amber/emerald pair at
 * CVD deltaE 7.7 (floor band), which is only legal with a secondary encoding -
 * hence every bar, chip and legend entry always carries its text label too.
 *
 * Indigo stays reserved for the accent (buttons, the "today" line) and is never
 * used as a category. Keep class names as literals: Tailwind scans source text.
 */
export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
  Frontend: {
    bar: 'bg-sky-600',
    dot: 'bg-sky-600',
    chip: 'border-sky-600/30 bg-sky-600/10 text-sky-700 dark:text-sky-400',
  },
  Backend: {
    bar: 'bg-amber-600',
    dot: 'bg-amber-600',
    chip: 'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  },
  'Infra / Cloud': {
    bar: 'bg-emerald-600',
    dot: 'bg-emerald-600',
    chip: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  },
  Database: {
    bar: 'bg-rose-600',
    dot: 'bg-rose-600',
    chip: 'border-rose-600/30 bg-rose-600/10 text-rose-700 dark:text-rose-400',
  },
  'CS Fundamentals': {
    bar: 'bg-violet-600',
    dot: 'bg-violet-600',
    chip: 'border-violet-600/30 bg-violet-600/10 text-violet-700 dark:text-violet-400',
  },
  Certification: {
    bar: 'bg-teal-600',
    dot: 'bg-teal-600',
    chip: 'border-teal-600/30 bg-teal-600/10 text-teal-700 dark:text-teal-400',
  },
}

/** Successor for each status, so cycling needs no index arithmetic. */
export const NEXT_STATUS: Record<Status, Status> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}

export const STATUS_LABEL: Record<Status, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
}

export const STATUS_CHIP: Record<Status, string> = {
  todo: 'text-muted-foreground',
  doing: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  done: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  mid: 'Medium',
  high: 'High',
}

export const PRIORITY_CHIP: Record<Priority, string> = {
  low: 'text-muted-foreground',
  mid: 'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
}

export const SORT_LABEL: Record<SortKey, string> = {
  due: 'Due date',
  start: 'Start date',
  priority: 'Priority',
  created: 'Recently added',
}

export const DUE_TONE: Record<DueTone, string> = {
  over: 'text-destructive',
  soon: 'text-amber-600 dark:text-amber-400',
  calm: 'text-muted-foreground',
}
