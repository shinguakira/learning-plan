import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CertificateForm } from "@/pages/profile/CertificateForm"
import type { Certificate, CertificateDraft } from "@/types/certificate"

export function CertificateEditDialog({
  certificate,
  existingNames,
  onEdit,
  onClose,
}: {
  certificate: Certificate | null
  existingNames: readonly string[]
  onEdit: (id: string, draft: CertificateDraft) => Promise<void>
  onClose: () => void
}) {
  return (
    <Dialog
      open={certificate !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit certificate</DialogTitle>
        </DialogHeader>
        {certificate !== null && (
          <CertificateForm
            key={certificate.id}
            certificate={certificate}
            existingNames={existingNames}
            onSubmit={async (draft) => {
              await onEdit(certificate.id, draft)
              toast.success("Certificate updated successfully.")
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
