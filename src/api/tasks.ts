import { CATEGORIES, PRIORITIES, STATUSES, TASKS_STORAGE_KEY } from '@/constants/task'
import { createSeedTasks } from '@/utils/seed'
import type { Task } from '@/types/task'

/**
 * Task persistence. localStorage stands in for a server here, so `useTasks`
 * only ever calls these two functions.
 */
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.startDate === 'string' &&
    typeof task.dueDate === 'string' &&
    typeof task.note === 'string' &&
    typeof task.estimatedHours === 'number' &&
    CATEGORIES.includes(task.category as never) &&
    STATUSES.includes(task.status as never) &&
    PRIORITIES.includes(task.priority as never)
  )
}

/** Survive corrupt storage, and seed sample data on the very first run. */
export function readTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    if (raw === null) return createSeedTasks()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTask)
  } catch {
    return createSeedTasks()
  }
}

export function writeTasks(tasks: readonly Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Quota errors or private mode: give up on persisting, keep rendering.
  }
}
