import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { putApiStrengthByIdMutation } from "@/api/generated/@tanstack/react-query.gen"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StrengthForm } from "@/pages/profile/StrengthForm"
import type { PostApiStrengthResponse } from "@/api/generated"

export function StrengthEditDialog({
  strength,
  existingNames,
  onEdit,
  onClose,
}: {
  strength: PostApiStrengthResponse | null
  existingNames: readonly string[]
  onEdit: (id: string, strength: PostApiStrengthResponse) => void
  onClose: () => void
}) {
  const updateStrength = useMutation(putApiStrengthByIdMutation())

  return (
    <Dialog
      open={strength !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit strength</DialogTitle>
        </DialogHeader>
        {strength !== null && (
          <StrengthForm
            key={strength.id}
            strength={strength}
            existingNames={existingNames}
            onSubmit={async (draft) => {
              const updated = await updateStrength.mutateAsync({
                path: { id: strength.id },
                body: draft,
              })
              onEdit(strength.id, updated)
              toast.success("Strength updated successfully.")
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
