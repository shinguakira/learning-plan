import { useState } from "react"
import { EmploymentType } from "@/api/generated"
import { today } from "@/utils/date"
import type { Job, PutApiJobsByIdData } from "@/api/generated"

export type JobDraftApi = {
  draft: PutApiJobsByIdData["body"]
  patch: (next: Partial<PutApiJobsByIdData["body"]>) => void
  /** Errors are computed on every render but only shown once submit was tried. */
  companyError: string | null
  titleError: string | null
  dateError: string | null
  invalid: boolean
  touched: boolean
  /** Mark as tried; returns the trimmed draft when it is valid, null otherwise. */
  submit: () => PutApiJobsByIdData["body"] | null
  reset: () => void
}

function emptyDraft(): PutApiJobsByIdData["body"] {
  return {
    company: "",
    title: "",
    employmentType: EmploymentType.FULL_TIME,
    startDate: today(),
    endDate: null,
    summary: "",
  }
}

/** Owns the add-job form's state and its validation. */
export function useJobDraft(job: Job | null = null): JobDraftApi {
  const [draft, setDraft] = useState<PutApiJobsByIdData["body"]>(() =>
    job === null
      ? emptyDraft()
      : {
          company: job.company,
          title: job.title,
          employmentType: job.employmentType,
          startDate: job.startDate,
          endDate: job.endDate,
          summary: job.summary,
        },
  )
  const [touched, setTouched] = useState(false)

  const companyError = draft.company.trim() === "" ? "Enter a company" : null
  const titleError = draft.title.trim() === "" ? "Enter a job title" : null
  const dateError =
    draft.endDate !== null && draft.endDate < draft.startDate
      ? "End date must not precede the start date"
      : null
  const invalid = companyError !== null || titleError !== null || dateError !== null

  const reset = () => {
    setDraft(emptyDraft())
    setTouched(false)
  }

  return {
    draft,
    patch: (next) => setDraft((prev) => ({ ...prev, ...next })),
    companyError,
    titleError,
    dateError,
    invalid,
    touched,
    submit: () => {
      setTouched(true)
      if (invalid) return null
      const ready = {
        ...draft,
        company: draft.company.trim(),
        title: draft.title.trim(),
        summary: draft.summary.trim(),
      }
      return ready
    },
    reset,
  }
}
