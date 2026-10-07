import type { ISODate } from '@/types/date'

export type Certificate = {
  id: string
  name: string
  issuer: string
  dateEarned: ISODate
  createdAt: string
}

export type CertificateDraft = Omit<Certificate, 'id' | 'createdAt'>
