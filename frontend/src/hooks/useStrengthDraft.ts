import { useState } from "react"
import type { PutApiStrengthByIdData } from "@/api/generated"

export function useStrengthDraft(
  existingNames: readonly string[],
  initial: PutApiStrengthByIdData["body"],
) {
  const [draft, setDraft] = useState<PutApiStrengthByIdData["body"]>(initial)
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
    patch: (next: Partial<PutApiStrengthByIdData["body"]>) =>
      setDraft((prev) => ({ ...prev, ...next })),
    submit: (): PutApiStrengthByIdData["body"] | null => {
      setTouched(true)
      if (nameError || descriptionError) return null
      const ready = { name: draft.name.trim(), description: draft.description.trim() }
      return ready
    },
  }
}
