import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JobForm } from "@/pages/profile/JobForm"
import type { Job, JobDraft } from "@/types/job"

export function JobEditDialog({
  job,
  onEdit,
  onClose,
}: {
  job: Job | null
  onEdit: (id: string, draft: JobDraft) => Promise<void>
  onClose: () => void
}) {
  return (
    <Dialog
      open={job !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit job</DialogTitle>
        </DialogHeader>
        {job !== null && (
          <JobForm
            key={job.id}
            job={job}
            onSubmit={async (draft) => {
              await onEdit(job.id, draft)
              toast.success("Job updated successfully.")
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
