import type { MockUser } from '@/types/user'

export const MOCK_USERS = ['Sanjar', 'Akira', 'Mike', 'John'] as const

/** Per-person identity colour - four of the six categorical hues validated in task.ts, reused here for the same colour-vision separation. */
export const MOCK_USER_COLOR: Record<MockUser, string> = {
  Sanjar: 'text-sky-600 dark:text-sky-400',
  Akira: 'text-amber-600 dark:text-amber-400',
  Mike: 'text-emerald-600 dark:text-emerald-400',
  John: 'text-violet-600 dark:text-violet-400',
}
