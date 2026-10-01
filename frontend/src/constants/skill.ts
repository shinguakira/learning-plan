import type { SkillLevel } from '@/types/skill'

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

/** Same ordinal ramp as `PRIORITY_CHIP` / `STATUS_CHIP` in `constants/task.ts`. */
export const SKILL_LEVEL_CHIP: Record<SkillLevel, string> = {
  beginner: 'text-muted-foreground',
  intermediate: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  advanced: 'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  expert: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
}

/** Text-only version of the same ramp, for a group heading or the level meter. */
export const SKILL_LEVEL_TEXT: Record<SkillLevel, string> = {
  beginner: 'text-muted-foreground',
  intermediate: 'text-blue-700 dark:text-blue-400',
  advanced: 'text-amber-700 dark:text-amber-400',
  expert: 'text-emerald-700 dark:text-emerald-400',
}
