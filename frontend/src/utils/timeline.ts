import { MIN_RANGE_DAYS, RANGE_PADDING_DAYS } from '@/constants/timeline'
import { addDays, diffDays, eachDay, formatMonth, today } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { Domain, MonthSegment } from '@/types/timeline'
import type { Task } from '@/types/task'

/** Date range that fits every task and today, padded on both sides. */
export function computeDomain(tasks: readonly Task[]): Domain {
  const now = today()
  let start = now
  let end = now
  for (const task of tasks) {
    if (task.startDate < start) start = task.startDate
    if (task.dueDate > end) end = task.dueDate
  }
  start = addDays(start, -RANGE_PADDING_DAYS)
  end = addDays(end, RANGE_PADDING_DAYS)
  const span = diffDays(start, end)
  if (span < MIN_RANGE_DAYS) end = addDays(end, MIN_RANGE_DAYS - span)
  return { start, end, days: eachDay(start, end) }
}

/** Collapse the day list into one heading per calendar month. */
export function monthSegments(days: readonly ISODate[]): MonthSegment[] {
  const segments: MonthSegment[] = []
  for (const day of days) {
    const key = day.slice(0, 7)
    const last = segments.at(-1)
    if (last && last.key === key) last.span += 1
    else segments.push({ key, label: formatMonth(day), span: 1 })
  }
  return segments
}
