import { formatMonth, parseDate, parseISODate } from "@/utils/date"
import type { ISODate } from "@/types/date"
import type { Job } from "@/api/generated"

/**
 * Most recent first, which is the order a work history is read in. The current
 * role has no end date, so it sorts by where it started like everything else.
 */
export function sortJobs(jobs: readonly Job[]): Job[] {
  return [...jobs].sort((a, b) => b.startDate.localeCompare(a.startDate))
}

/** 'April 2024 - Present' */
export function formatPeriod(job: Job): string {
  const startDate = parseISODate(job.startDate)
  const endDate = job.endDate === null ? null : parseISODate(job.endDate)

  if (startDate === null || (job.endDate !== null && endDate === null)) {
    throw new Error("The server returned an invalid job date.")
  }

  const end = endDate === null ? "Present" : formatMonth(endDate)
  return `${formatMonth(startDate)} - ${end}`
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
  const startDate = parseISODate(job.startDate)
  const endDate = parseISODate(job.endDate ?? until)

  if (startDate === null || endDate === null) {
    throw new Error("The server returned an invalid job date.")
  }

  const total = monthsBetween(startDate, endDate)
  const years = Math.floor(total / 12)
  const months = total % 12

  if (years === 0) return `${months} mo`
  if (months === 0) return `${years} yr`
  return `${years} yr ${months} mo`
}
