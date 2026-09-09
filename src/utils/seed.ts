import { SEED_TASKS } from '@/constants/seedTasks'
import { addDays, today } from '@/utils/date'
import type { Task } from '@/types/task'

/** Expand the seed entries into real tasks anchored to today's date. */
export function createSeedTasks(): Task[] {
  const base = today()
  return SEED_TASKS.map(({ offsetStart, span, ...draft }, index) => ({
    ...draft,
    id: `seed-${index + 1}`,
    startDate: addDays(base, offsetStart),
    dueDate: addDays(base, offsetStart + span),
    createdAt: new Date().toISOString(),
  }))
}
