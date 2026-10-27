import { useState } from "react"
import type { SkillDraft } from "@/types/skill"

export type SkillDraftApi = {
  draft: SkillDraft
  patch: (next: Partial<SkillDraft>) => void
  /** Errors are computed on every render but only shown once submit was tried. */
  nameError: string | null
  touched: boolean
  /** Mark as tried; returns the trimmed draft when it is valid, null otherwise. */
  submit: () => SkillDraft | null
}

/** Owns the skill form's state and its validation, for both adding and editing. */
export function useSkillDraft(
  existingNames: readonly string[],
  initial: SkillDraft,
): SkillDraftApi {
  const [draft, setDraft] = useState<SkillDraft>(initial)
  const [touched, setTouched] = useState(false)

  const trimmedName = draft.name.trim()
  const nameError =
    trimmedName === ""
      ? "Enter a skill name"
      : existingNames.some((name) => name.toLowerCase() === trimmedName.toLowerCase())
        ? "Already registered"
        : null

  return {
    draft,
    patch: (next) => setDraft((prev) => ({ ...prev, ...next })),
    nameError,
    touched,
    submit: () => {
      setTouched(true)
      if (nameError) return null
      return { ...draft, name: trimmedName }
    },
  }
}
