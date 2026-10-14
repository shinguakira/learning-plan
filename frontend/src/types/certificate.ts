import type { ISODate } from '@/types/date'

export type Certificate = {
  id: string
  name: string
  issuer: string
  dateEarned: ISODate
  /** Optional issuer page where this credential can be viewed. */
  credentialUrl?: string
  createdAt: string
}

export type CertificateDraft = Omit<Certificate, 'id' | 'createdAt'>
