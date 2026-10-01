import { PRIORITIES } from '@/constants/task'
import { diffDays, today } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { DueDescription, SortKey, Task, TaskFilterCriteria, TaskSummary } from '@/types/task'

/**
 * Narrow the task list by status, category and free text. Every criterion is
 * ANDed; 'all' and an empty query mean "do not narrow by this".
 *
 * The text match runs against title and note joined by a space, so a query may
 * legitimately span the two - searching "docker compose local" finds a task whose
 * title ends in "docker compose" and whose note starts with "local".
 */
export function filterTasks(tasks: readonly Task[], criteria: TaskFilterCriteria): Task[] {
  const needle = criteria.query.trim().toLowerCase()

  return tasks.filter((task) => {
    if (criteria.status !== 'all' && task.status !== criteria.status) return false
    if (criteria.category !== 'all' && task.category !== criteria.category) return false
    const haystack = `${task.title} ${task.note}`.toLowerCase()
    if (needle !== '' && !haystack.includes(needle)) return false
    return true
  })
}

export function sortTasks(tasks: readonly Task[], key: SortKey): Task[] {
  const copy = [...tasks]
  switch (key) {
    case 'due':
      return copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    case 'start':
      return copy.sort((a, b) => a.startDate.localeCompare(b.startDate))
    case 'priority':
      // PRIORITIES runs low -> high, so read it backwards for descending order
      return copy.sort(
        (a, b) =>
          PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority) ||
          a.dueDate.localeCompare(b.dueDate),
      )
    case 'created':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

/** Time left until the due date, as a short label plus how urgent it is. */
export function describeDue(due: ISODate): DueDescription {
  const left = diffDays(today(), due)
  if (left < 0) return { label: `${-left}d overdue`, tone: 'over' }
  if (left === 0) return { label: 'Due today', tone: 'over' }
  if (left <= 3) return { label: `${left}d left`, tone: 'soon' }
  return { label: `${left}d left`, tone: 'calm' }
}

/** Per-status counts plus the totals the stats row shows. */
export function summarizeTasks(tasks: readonly Task[]): TaskSummary {
  const now = today()
  const summary: TaskSummary = {
    total: tasks.length,
    todo: 0,
    doing: 0,
    done: 0,
    overdue: 0,
    hours: 0,
    rate: 0,
  }
  for (const task of tasks) {
    summary[task.status] += 1
    summary.hours += task.estimatedHours
    if (task.status !== 'done' && task.dueDate < now) summary.overdue += 1
  }
  summary.rate = summary.total === 0 ? 0 : Math.round((summary.done / summary.total) * 100)
  return summary
}
