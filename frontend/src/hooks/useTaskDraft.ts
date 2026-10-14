import { useState } from 'react'
import { CATEGORIES } from '@/constants/task'
import { addDays, today } from '@/utils/date'
import type { TaskDraft } from '@/types/task'

export type TaskDraftApi = {
  draft: TaskDraft
  patch: (next: Partial<TaskDraft>) => void
  /** Errors are computed on every render but only shown once submit was tried. */
  titleError: string | null
  dateError: string | null
  invalid: boolean
  touched: boolean
  /** Mark as tried; returns the trimmed draft when it is valid, null otherwise. */
  submit: () => TaskDraft | null
  reset: () => void
}

function emptyDraft(): TaskDraft {
  return {
    title: '',
    category: CATEGORIES[0],
    status: 'todo',
    priority: 'mid',
    startDate: today(),
    dueDate: addDays(today(), 7),
    estimatedHours: 4,
    note: '',
  }
}

/** Owns the add-task form's state and its validation. */
export function useTaskDraft(): TaskDraftApi {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft)
  const [touched, setTouched] = useState(false)

  const titleError = draft.title.trim() === '' ? 'Enter a title' : null
  const dateError =
    draft.dueDate < draft.startDate ? 'Due date must not precede the start date' : null
  const invalid = titleError !== null || dateError !== null

  const reset = () => {
    setDraft(emptyDraft())
    setTouched(false)
  }

  return {
    draft,
    patch: (next) => setDraft((prev) => ({ ...prev, ...next })),
    titleError,
    dateError,
    invalid,
    touched,
    submit: () => {
      setTouched(true)
      if (invalid) return null
      const ready = { ...draft, title: draft.title.trim(), note: draft.note.trim() }
      reset()
      return ready
    },
    reset,
  }
}
