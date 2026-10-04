import { CATEGORIES } from '@/constants/task'
import { DAY_W } from '@/constants/timeline'
import { diffDays, today } from '@/utils/date'
import { computeDomain, monthSegments } from '@/utils/timeline'
import type { Domain, MonthSegment } from '@/types/timeline'
import type { Category, Task } from '@/types/task'

export type TimelineModel = {
  /** Tasks in the fixed timeline order: earliest start first. */
  sorted: Task[]
  domain: Domain
  months: MonthSegment[]
  /** Day columns from the domain start to today; negative when today is before it. */
  todayOffset: number
  gridWidth: number
  /** Only the categories actually present, so the legend stays honest. */
  usedCategories: Category[]
}

/** Everything the timeline needs to draw, derived from the task list. */
export function useTimeline(tasks: readonly Task[]): TimelineModel {
  const sorted = [...tasks].sort(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.dueDate.localeCompare(b.dueDate),
  )
  const domain = computeDomain(sorted)

  return {
    sorted,
    domain,
    months: monthSegments(domain.days),
    todayOffset: diffDays(domain.start, today()),
    gridWidth: domain.days.length * DAY_W,
    usedCategories: CATEGORIES.filter((category) =>
      sorted.some((task) => task.category === category),
    ),
  }
}
