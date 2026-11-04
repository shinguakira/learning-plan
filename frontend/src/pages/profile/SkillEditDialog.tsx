import type { PostApiSkillsResponse } from "@/api/generated"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { putApiSkillsByIdMutation } from "@/api/generated/@tanstack/react-query.gen"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SkillForm } from "@/pages/profile/SkillForm"

/** Open for whichever skill `skill` names; closed while it is null. */
export function SkillEditDialog({
  skill,
  existingNames,
  onEdited,
  onClose,
}: {
  skill: PostApiSkillsResponse | null
  existingNames: readonly string[]
  onEdited: (id: string, skill: PostApiSkillsResponse) => void
  onClose: () => void
}) {
  const updateSkill = useMutation(putApiSkillsByIdMutation())

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
            onSubmit={(draft) =>
              updateSkill
                .mutateAsync({ path: { id: skill.id }, body: draft })
                .then((updated) => {
                  onEdited(skill.id, updated)
                  toast.success("PostApiSkillsResponse updated successfully.")
                  onClose()
                })
                .catch((error: unknown) => {
                  toast.error(
                    (error as { message?: string }).message ?? "Could not update the skill.",
                  )
                })
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
