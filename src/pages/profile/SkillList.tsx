import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SKILL_LEVEL_CHIP, SKILL_LEVEL_LABEL } from '@/constants/skill'
import type { Skill } from '@/types/skill'

export function SkillList({
  skills,
  onRemove,
}: {
  skills: Skill[]
  onRemove: (id: string) => void
}) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-6 py-10 text-center">
        <p className="text-sm font-medium">No skills registered yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Add the technologies you can work with above.
        </p>
      </div>
    )
  }

  return (
    <ul aria-label="Skills" className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill.id}>
          <Badge
            variant="outline"
            className={cn('h-7 gap-1.5 pr-1 text-sm', SKILL_LEVEL_CHIP[skill.level])}
          >
            {skill.name}
            <span className="text-muted-foreground font-normal">
              {SKILL_LEVEL_LABEL[skill.level]}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5"
              aria-label={`Remove ${skill.name}`}
              onClick={() => onRemove(skill.id)}
            >
              <X />
            </Button>
          </Badge>
        </li>
      ))}
    </ul>
  )
}
