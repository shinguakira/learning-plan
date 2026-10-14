import { useState } from 'react'
import { EMPLOYMENT_TYPES } from '@/constants/job'
import { today } from '@/utils/date'
import type { JobDraft } from '@/types/job'

export type JobDraftApi = {
  draft: JobDraft
  patch: (next: Partial<JobDraft>) => void
  /** Errors are computed on every render but only shown once submit was tried. */
  companyError: string | null
  titleError: string | null
  dateError: string | null
  invalid: boolean
  touched: boolean
  /** Mark as tried; returns the trimmed draft when it is valid, null otherwise. */
  submit: () => JobDraft | null
  reset: () => void
}

function emptyDraft(): JobDraft {
  return {
    company: '',
    title: '',
    employmentType: EMPLOYMENT_TYPES[0],
    startDate: today(),
    endDate: null,
    summary: '',
  }
}

/** Owns the add-job form's state and its validation. */
export function useJobDraft(): JobDraftApi {
  const [draft, setDraft] = useState<JobDraft>(emptyDraft)
  const [touched, setTouched] = useState(false)

  const companyError = draft.company.trim() === '' ? 'Enter a company' : null
  const titleError = draft.title.trim() === '' ? 'Enter a job title' : null
  const dateError =
    draft.endDate !== null && draft.endDate < draft.startDate
      ? 'End date must not precede the start date'
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
      reset()
      return ready
    },
    reset,
  }
}
