import { MOCK_USERS } from '@/constants/user'
import type { SeedTask, Task } from '@/types/task'
import { addDays, today } from '@/utils/date'

/** Expand the seed entries into real tasks anchored to today's date. */
export function createSeedTasks(seedTasks: readonly SeedTask[]): Task[] {
  const base = today()
  return seedTasks.map(({ offsetStart, span, ...draft }, index) => ({
    ...draft,
    id: `seed-${index + 1}`,
    // The backend seed has no notion of the header's mock users, so rotate
    // through them the same deterministic way the id is derived from index.
    assignee: MOCK_USERS[index % MOCK_USERS.length] ?? MOCK_USERS[0],
    startDate: addDays(base, offsetStart),
    dueDate: addDays(base, offsetStart + span),
    createdAt: new Date().toISOString(),
  }))
}
