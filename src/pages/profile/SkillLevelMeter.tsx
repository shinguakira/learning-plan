import { SKILL_LEVELS } from '@/constants/skill'
import { cn } from '@/lib/utils'
import type { SkillLevel } from '@/types/skill'

/** Four dots filled up to the given level - reads the colour off its parent via `currentColor`. */
export function SkillLevelMeter({ level, className }: { level: SkillLevel; className?: string }) {
  const filled = SKILL_LEVELS.indexOf(level) + 1

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-hidden="true">
      {SKILL_LEVELS.map((step, index) => (
        <span
          key={step}
          className={cn('size-1.5 rounded-full bg-current', index >= filled && 'opacity-25')}
        />
      ))}
    </span>
  )
}
