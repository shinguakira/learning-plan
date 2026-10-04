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

/**
 * A seed entry carries whole months rather than dates, because that is the
 * granularity a work history is written in.
 */
export type SeedJob = Omit<JobDraft, 'startDate' | 'endDate'> & {
  /** 'YYYY-MM'. */
  from: string
  /** 'YYYY-MM', or null for the current role. */
  to: string | null
}
