import { useState } from "react"
import { CATEGORIES } from "@/constants/task"
import { addDays, today } from "@/utils/date"
import type { TaskDraft } from "@/types/task"
import { useMockUser } from "@/hooks/useMockUser"
import type { MockUser } from "@/types/user"

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

function emptyDraft(assignee: MockUser): TaskDraft {
  return {
    title: "",
    category: CATEGORIES[0],
    status: "todo",
    priority: "mid",
    assignee,
    startDate: today(),
    dueDate: addDays(today(), 7),
    estimatedHours: 4,
    note: "",
  }
}

/** Owns the add-task form's state and its validation. Defaults the assignee
 * to whoever is currently active in the header. */
export function useTaskDraft(): TaskDraftApi {
  const { user } = useMockUser()
  const [draft, setDraft] = useState<TaskDraft>(() => emptyDraft(user))
  const [touched, setTouched] = useState(false)

  const titleError = draft.title.trim() === "" ? "Enter a title" : null
  const dateError =
    draft.dueDate < draft.startDate ? "Due date must not precede the start date" : null
  const invalid = titleError !== null || dateError !== null

  const reset = () => {
    setDraft(emptyDraft(user))
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
