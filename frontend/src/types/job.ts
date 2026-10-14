import type { EMPLOYMENT_TYPES } from '@/constants/job'
import type { ISODate } from '@/types/date'

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export type Job = {
  id: string
  company: string
  title: string
  employmentType: EmploymentType
  startDate: ISODate
  /** Null while this is the current role, which is what "Present" renders from. */
  endDate: ISODate | null
  summary: string
  /** Full ISO timestamp, not an ISODate - only used for sorting. */
  createdAt: string
}

export type JobDraft = Omit<Job, 'id' | 'createdAt'>
