import { useState } from "react"
import { Award, Pencil, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SKILL_LEVEL_CHIP, SKILL_LEVEL_LABEL, SKILL_LEVEL_TEXT } from "@/constants/skill"
import { groupSkillsByLevel } from "@/utils/skill"
import { SkillEditDialog } from "@/pages/profile/SkillEditDialog"
import { SkillLevelMeter } from "@/pages/profile/SkillLevelMeter"
import type { Skill, SkillDraft } from "@/types/skill"

export function SkillList({
  skills,
  onEdit,
  onRemove,
}: {
  skills: Skill[]
  onEdit: (id: string, draft: SkillDraft) => Promise<void>
  onRemove: (id: string) => void
}) {
  const [editing, setEditing] = useState<Skill | null>(null)

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
        <Award className="text-muted-foreground/60 size-7" />
        <p className="text-sm font-medium">No skills registered yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Add the technologies you can work with above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {groupSkillsByLevel(skills).map((group) => (
        <section key={group.level} aria-label={`${SKILL_LEVEL_LABEL[group.level]} skills`}>
          <Card size="sm">
            <CardContent className="flex flex-wrap items-start gap-3">
              <div
                className={cn(
                  "flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold tracking-wide uppercase",
                  SKILL_LEVEL_TEXT[group.level],
                )}
              >
                <SkillLevelMeter level={group.level} />
                <span>{SKILL_LEVEL_LABEL[group.level]}</span>
                <span className="text-muted-foreground font-normal normal-case tabular-nums">
                  ({group.skills.length})
                </span>
              </div>

              <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li key={skill.id} className="group/skill relative">
                    {/* The row makes room for the buttons only while they are showing. */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-7 transition-[padding] group-hover/skill:pr-12 group-focus-within/skill:pr-12",
                        SKILL_LEVEL_CHIP[group.level],
                      )}
                    >
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground/80 ml-1.5 font-normal">
                        ({skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "yr" : "yrs"})
                      </span>
                    </Badge>
                    <div className="absolute top-1/2 right-0.5 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition group-hover/skill:opacity-100 group-focus-within/skill:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Edit ${skill.name}`}
                        onClick={() => setEditing(skill)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${skill.name}`}
                        onClick={() => onRemove(skill.id)}
                      >
                        <X />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      ))}

      <SkillEditDialog
        skill={editing}
        existingNames={skills
          .filter((skill) => skill.id !== editing?.id)
          .map((skill) => skill.name)}
        onEdit={onEdit}
        onClose={() => setEditing(null)}
      />
    </div>
  )
}
