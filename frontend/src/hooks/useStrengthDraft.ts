import { useState } from "react"
import type { StrengthDraft } from "@/types/strength"

export function useStrengthDraft() {
  const [draft, setDraft] = useState<StrengthDraft>({ name: "", description: "" })
  const [touched, setTouched] = useState(false)
  const nameError = draft.name.trim() === "" ? "Enter a strength" : null
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
      setDraft({ name: "", description: "" })
      setTouched(false)
      return ready
    },
  }
}
