import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JobForm } from "@/pages/profile/JobForm"
import type { Job } from "@/api/generated"
import { useMutation } from "@tanstack/react-query"
import { putApiJobsByIdMutation } from "@/api/generated/@tanstack/react-query.gen"

export function JobEditDialog({
  job,
  onEdit,
  onClose,
}: {
  job: Job | null
  onEdit: (id: string, job: Job) => void
  onClose: () => void
}) {
  const updateJob = useMutation(putApiJobsByIdMutation())

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
              const updated = await updateJob.mutateAsync({
                path: { id: job.id },
                body: draft,
              })
              onEdit(job.id, updated)
              toast.success("Job updated successfully.")
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
