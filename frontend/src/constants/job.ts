import type { EmploymentType, SeedJob } from '@/types/job'

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

/**
 * The sample work history, loaded on every visit. Nothing here is saved.
 *
 * Every company and role below is invented, and the names are plain English so
 * they read as names to anyone. Sample data must never be drawn from anything
 * real - not the author's own projects, not another repository.
 */
export const SEED_JOBS: readonly SeedJob[] = [
  {
    company: 'Marlow Retail',
    title: 'Senior Frontend Engineer',
    employmentType: 'full-time',
    from: '2024-04',
    to: null,
    summary: 'Online shop. Build the product and checkout pages in React.',
  },
  {
    company: 'Northgate Logistics',
    title: 'Full Stack Engineer',
    employmentType: 'full-time',
    from: '2021-07',
    to: '2024-03',
    summary: 'Freight company. Built the shipment tracking dashboard and the API behind it.',
  },
  {
    company: 'Riverbend Studio',
    title: 'Web Developer',
    employmentType: 'contract',
    from: '2020-02',
    to: '2021-06',
    summary: 'Web agency. Built marketing sites for clients.',
  },
  {
    company: 'Oakfield Systems',
    title: 'Software Engineer Intern',
    employmentType: 'internship',
    from: '2019-06',
    to: '2019-09',
    summary: 'Software vendor. Wrote internal tools for the test team.',
  },
]
