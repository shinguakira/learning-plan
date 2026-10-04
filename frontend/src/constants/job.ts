import type { EmploymentType } from '@/types/job'

export const EMPLOYMENT_TYPES = ['full-time', 'contract', 'part-time', 'internship'] as const

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  contract: 'Contract',
  'part-time': 'Part-time',
  internship: 'Internship',
}

/**
 * Employment type says which arrangement this was, not how good it was, so the
 * colours are a categorical set rather than the ordinal ramp skill levels use.
 */
export const EMPLOYMENT_TYPE_CHIP: Record<EmploymentType, string> = {
  'full-time': 'border-sky-600/30 bg-sky-600/10 text-sky-700 dark:text-sky-400',
  contract: 'border-violet-600/30 bg-violet-600/10 text-violet-700 dark:text-violet-400',
  'part-time': 'border-teal-600/30 bg-teal-600/10 text-teal-700 dark:text-teal-400',
  internship: 'text-muted-foreground',
}
