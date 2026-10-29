import { useState, type FormEvent } from "react"
import { Plus, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABEL } from "@/constants/job"
import { useJobDraft } from "@/hooks/useJobDraft"
import { FormField } from "@/components/form/FormField"
import { parseISODate } from "@/utils/date"
import type { EmploymentType, Job, JobDraft } from "@/types/job"

export function JobForm({
  job = null,
  onSubmit,
}: {
  job?: Job | null
  onSubmit: (draft: JobDraft) => void | Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { draft, patch, companyError, titleError, dateError, touched, submit } = useJobDraft(job)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    const ready = submit()
    if (ready === null) return
    setSaving(true)
    setError(null)
    try {
      await onSubmit(ready)
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not save the job.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
        <FormField
          label="Company"
          htmlFor="job-company"
          error={touched ? companyError : null}
          className="min-w-0"
        >
          <Input
            id="job-company"
            value={draft.company}
            placeholder="e.g. Northgate Logistics"
            onChange={(event) => patch({ company: event.target.value })}
          />
        </FormField>

        <FormField
          label="Job title"
          htmlFor="job-title"
          error={touched ? titleError : null}
          className="min-w-0"
        >
          <Input
            id="job-title"
            value={draft.title}
            placeholder="e.g. Full Stack Engineer"
            onChange={(event) => patch({ title: event.target.value })}
          />
        </FormField>

        <FormField label="Employment type" htmlFor="job-type">
          <Select
            value={draft.employmentType}
            onValueChange={(value) => patch({ employmentType: value as EmploymentType })}
          >
            <SelectTrigger id="job-type" aria-label="Employment type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {EMPLOYMENT_TYPE_LABEL[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Started" htmlFor="job-start">
          <Input
            id="job-start"
            type="date"
            value={draft.startDate}
            onChange={(event) =>
              patch({ startDate: parseISODate(event.target.value) ?? draft.startDate })
            }
          />
        </FormField>

        <FormField
          label="Ended"
          hint="blank if current"
          htmlFor="job-end"
          error={touched ? dateError : null}
        >
          <Input
            id="job-end"
            type="date"
            value={draft.endDate ?? ""}
            min={draft.startDate}
            onChange={(event) => patch({ endDate: parseISODate(event.target.value) })}
          />
        </FormField>
      </div>

      <FormField label="What you did" hint="optional" htmlFor="job-summary">
        <Textarea
          id="job-summary"
          value={draft.summary}
          placeholder="Scope, the stack, what changed because you were there"
          onChange={(event) => patch({ summary: event.target.value })}
        />
      </FormField>

      {error !== null && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            <X />
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {job === null ? <Plus /> : <Save />}
          {saving ? "Saving…" : job === null ? "Add job" : "Save job"}
        </Button>
      </div>
    </form>
  )
}
