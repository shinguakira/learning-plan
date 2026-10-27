import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SkillForm } from "@/pages/profile/SkillForm"
import type { Skill, SkillDraft } from "@/types/skill"

/** Open for whichever skill `skill` names; closed while it is null. */
export function SkillEditDialog({
  skill,
  existingNames,
  onEdit,
  onClose,
}: {
  skill: Skill | null
  existingNames: readonly string[]
  onEdit: (id: string, draft: SkillDraft) => Promise<void>
  onClose: () => void
}) {
  return (
    <Dialog
      open={skill !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit skill</DialogTitle>
        </DialogHeader>
        {skill !== null && (
          <SkillForm
            key={skill.id}
            skill={skill}
            existingNames={existingNames}
            onSubmit={(draft) => {
              onEdit(skill.id, draft)
                .then(() => {
                  toast.success("Skill updated successfully.")
                  onClose()
                })
                .catch((error: unknown) => {
                  toast.error(
                    error instanceof Error ? error.message : "Could not update the skill.",
                  )
                })
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
