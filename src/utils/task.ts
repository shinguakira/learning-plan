import { PRIORITIES } from '@/constants/task'
import { diffDays, today } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { DueDescription, SortKey, Task } from '@/types/task'

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
