import { formatMonth, parseDate } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { Job } from '@/types/job'

/**
 * Most recent first, which is the order a work history is read in. The current
 * role has no end date, so it sorts by where it started like everything else.
 */
export function sortJobs(jobs: readonly Job[]): Job[] {
  return [...jobs].sort((a, b) => b.startDate.localeCompare(a.startDate))
}

/** 'April 2024 - Present' */
export function formatPeriod(job: Job): string {
  const end = job.endDate === null ? 'Present' : formatMonth(job.endDate)
  return `${formatMonth(job.startDate)} - ${end}`
}

/** Whole months between the two dates, counting a part-month as one. */
export function monthsBetween(start: ISODate, end: ISODate): number {
  const from = parseDate(start)
  const to = parseDate(end)
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  return Math.max(months + 1, 1)
}

/** '2 yr 7 mo', '11 mo', '1 yr' - the shape a CV uses. */
export function formatDuration(job: Job, until: ISODate): string {
  const total = monthsBetween(job.startDate, job.endDate ?? until)
  const years = Math.floor(total / 12)
  const months = total % 12

  if (years === 0) return `${months} mo`
  if (months === 0) return `${years} yr`
  return `${years} yr ${months} mo`
}
