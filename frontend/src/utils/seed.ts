import type { SeedTask, Task } from '@/types/task'
import { addDays, today } from '@/utils/date'

/** Expand the seed entries into real tasks anchored to today's date. */
export function createSeedTasks(seedTasks: readonly SeedTask[]): Task[] {
  const base = today()
  return seedTasks.map(({ offsetStart, span, ...draft }, index) => ({
    ...draft,
    id: `seed-${index + 1}`,
    startDate: addDays(base, offsetStart),
    dueDate: addDays(base, offsetStart + span),
    createdAt: new Date().toISOString(),
  }))
}
