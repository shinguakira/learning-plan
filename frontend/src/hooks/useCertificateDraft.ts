import { useState } from 'react'
import type { CertificateDraft } from '@/types/certificate'
import { parseISODate } from '@/utils/date'

/** Owns certificate input values until they have been validated. */
export function useCertificateDraft() {
  const [draft, setDraft] = useState({ name: '', issuer: '', dateEarned: '' })
  const [touched, setTouched] = useState(false)
  const nameError = draft.name.trim() === '' ? 'Enter a certificate title' : null
  const issuerError = draft.issuer.trim() === '' ? 'Enter an issuer' : null
  const dateEarned = parseISODate(draft.dateEarned)
  const dateError = dateEarned === null ? 'Enter a valid date earned' : null

  return {
    draft,
    touched,
    nameError,
    issuerError,
    dateError,
    patch: (next: Partial<typeof draft>) => setDraft((prev) => ({ ...prev, ...next })),
    submit: (): CertificateDraft | null => {
      setTouched(true)
      if (nameError || issuerError || dateEarned === null) return null
      const ready = { name: draft.name.trim(), issuer: draft.issuer.trim(), dateEarned }
      setDraft({ name: '', issuer: '', dateEarned: '' })
      setTouched(false)
      return ready
    },
  }
}
