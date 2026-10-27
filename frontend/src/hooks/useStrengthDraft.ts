import { useState } from "react"
import type { StrengthDraft } from "@/types/strength"

export function useStrengthDraft(existingNames: readonly string[], initial: StrengthDraft) {
  const [draft, setDraft] = useState<StrengthDraft>(initial)
  const [touched, setTouched] = useState(false)
  const nameError =
    draft.name.trim() === ""
      ? "Enter a strength"
      : existingNames.some((name) => name.toLowerCase() === draft.name.trim().toLowerCase())
        ? "Already registered"
        : null
  const descriptionError = draft.description.trim() === "" ? "Describe your strength" : null

  return {
    draft,
    touched,
    nameError,
    descriptionError,
    patch: (next: Partial<StrengthDraft>) => setDraft((prev) => ({ ...prev, ...next })),
    submit: (): StrengthDraft | null => {
      setTouched(true)
      if (nameError || descriptionError) return null
      const ready = { name: draft.name.trim(), description: draft.description.trim() }
      return ready
    },
  }
}
