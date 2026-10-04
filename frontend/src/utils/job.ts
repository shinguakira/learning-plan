import { SEED_JOBS } from '@/constants/job'
import { formatMonth, parseDate, toISODate } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { Job, SeedJob } from '@/types/job'

/** 'YYYY-MM' to the first of that month. Fixed-width slices, as in `utils/date`. */
function monthStart(month: string): ISODate {
  return toISODate(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1))
}

/** 'YYYY-MM' to the last day of that month - day 0 of the next one. */
function monthEnd(month: string): ISODate {
  return toISODate(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0))
}

function expand(seed: SeedJob, index: number): Job {
  return {
    id: `seed-${index}`,
    company: seed.company,
    title: seed.title,
    employmentType: seed.employmentType,
    startDate: monthStart(seed.from),
    endDate: seed.to === null ? null : monthEnd(seed.to),
    summary: seed.summary,
    createdAt: new Date(2026, 0, 1).toISOString(),
  }
}

export function createSeedJobs(): Job[] {
  return SEED_JOBS.map(expand)
}

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
