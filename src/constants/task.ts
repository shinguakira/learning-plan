import type {
  Category,
  CategoryTheme,
  DueTone,
  Priority,
  SortKey,
  Status,
} from '@/types/task'

export const CATEGORIES = [
  'Frontend',
  'Backend',
  'Infra / Cloud',
  'Database',
  'CS Fundamentals',
  'Certification',
] as const

export const STATUSES = ['todo', 'doing', 'done'] as const

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
  'Frontend': {
    bar: 'bg-sky-600',
    dot: 'bg-sky-600',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  'Backend': {
    bar: 'bg-amber-600',
    dot: 'bg-amber-600',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  'Infra / Cloud': {
    bar: 'bg-emerald-600',
    dot: 'bg-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  'Database': {
    bar: 'bg-rose-600',
    dot: 'bg-rose-600',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  'CS Fundamentals': {
    bar: 'bg-violet-600',
    dot: 'bg-violet-600',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200',
  },
  'Certification': {
    bar: 'bg-teal-600',
    dot: 'bg-teal-600',
    chip: 'bg-teal-50 text-teal-700 ring-teal-200',
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
  todo: 'bg-slate-100 text-slate-600 ring-slate-200',
  doing: 'bg-blue-50 text-blue-700 ring-blue-200',
  done: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  mid: 'Medium',
  high: 'High',
}

export const PRIORITY_CHIP: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-500 ring-slate-200',
  mid: 'bg-amber-50 text-amber-700 ring-amber-200',
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export const SORT_LABEL: Record<SortKey, string> = {
  due: 'Due date',
  start: 'Start date',
  priority: 'Priority',
  created: 'Recently added',
}

export const DUE_TONE: Record<DueTone, string> = {
  over: 'text-rose-600',
  soon: 'text-amber-600',
  calm: 'text-slate-400',
}

export const TASKS_STORAGE_KEY = 'learning-plan:tasks:v2'
export const VIEW_STORAGE_KEY = 'learning-plan:view:v1'
