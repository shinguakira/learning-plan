import { useState } from 'react'
import { SKILL_LEVELS } from '@/constants/skill'
import type { SkillDraft } from '@/types/skill'

export type SkillDraftApi = {
  draft: SkillDraft
  patch: (next: Partial<SkillDraft>) => void
  /** Errors are computed on every render but only shown once submit was tried. */
  nameError: string | null
  touched: boolean
  /** Mark as tried; returns the trimmed draft when it is valid, null otherwise. */
  submit: () => SkillDraft | null
  reset: () => void
}

/** Owns the add-skill form's state and its validation. */
export function useSkillDraft(
  existingNames: readonly string[],
  defaultName: string,
): SkillDraftApi {
  const emptyDraft = (): SkillDraft => ({
    name: defaultName,
    level: SKILL_LEVELS[0],
    yearsOfExperience: 1,
  })

  const [draft, setDraft] = useState<SkillDraft>(emptyDraft)
  const [touched, setTouched] = useState(false)

  const trimmedName = draft.name.trim()
  const nameError =
    trimmedName === ''
      ? 'Enter a skill name'
      : existingNames.some((name) => name.toLowerCase() === trimmedName.toLowerCase())
        ? 'Already registered'
        : null

  const reset = () => {
    setDraft(emptyDraft())
    setTouched(false)
  }

  return {
    draft,
    patch: (next) => setDraft((prev) => ({ ...prev, ...next })),
    nameError,
    touched,
    submit: () => {
      setTouched(true)
      if (nameError) return null
      const ready = { ...draft, name: trimmedName }
      reset()
      return ready
    },
    reset,
  }
}
