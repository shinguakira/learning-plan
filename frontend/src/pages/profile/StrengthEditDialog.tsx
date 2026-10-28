import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StrengthForm } from "@/pages/profile/StrengthForm"
import type { Strength, StrengthDraft } from "@/types/strength"

export function StrengthEditDialog({
  strength,
  existingNames,
  onEdit,
  onClose,
}: {
  strength: Strength | null
  existingNames: readonly string[]
  onEdit: (id: string, draft: StrengthDraft) => Promise<void>
  onClose: () => void
}) {
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
              await onEdit(strength.id, draft)
              toast.success("Strength updated successfully.")
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
