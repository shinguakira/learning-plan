import { describe, expect, it } from 'vitest'
import { createSeedJobs, formatDuration, formatPeriod, monthsBetween, sortJobs } from '@/utils/job'
import type { ISODate } from '@/types/date'
import type { Job } from '@/types/job'

const iso = (value: string) => value as ISODate

function job(overrides: Partial<Job> = {}): Job {
  return {
    id: 'j1',
    company: 'Acme',
    title: 'Engineer',
    employmentType: 'full-time',
    startDate: iso('2020-01-01'),
    endDate: iso('2020-12-31'),
    summary: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('createSeedJobs', () => {
  it('expands every seed entry', () => {
    expect(createSeedJobs()).toHaveLength(4)
  })

  it('starts each role on the first of its month', () => {
    for (const seeded of createSeedJobs()) {
      expect(seeded.startDate.slice(8, 10)).toBe('01')
    }
  })

  it('ends a finished role on the last day of its month, including February', () => {
    const [, kaizen] = createSeedJobs()
    // '2024-03' - March has 31 days.
    expect(kaizen?.endDate).toBe('2024-03-31')
  })

  it('leaves the current role open-ended', () => {
    const [current] = createSeedJobs()
    expect(current?.endDate).toBeNull()
  })

  it('gives every role a distinct id', () => {
    const ids = createSeedJobs().map((seeded) => seeded.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('sortJobs', () => {
  it('puts the most recent start first', () => {
    const older = job({ id: 'old', startDate: iso('2018-01-01') })
    const newer = job({ id: 'new', startDate: iso('2023-01-01') })

    expect(sortJobs([older, newer]).map((entry) => entry.id)).toEqual(['new', 'old'])
  })

  it('does not mutate what it was given', () => {
    const input = [job({ id: 'a', startDate: iso('2018-01-01') }), job({ id: 'b' })]
    const before = input.map((entry) => entry.id)

    sortJobs(input)

    expect(input.map((entry) => entry.id)).toEqual(before)
  })

  it('returns an empty list unchanged', () => {
    expect(sortJobs([])).toEqual([])
  })
})

describe('monthsBetween', () => {
  it('counts a single month as one', () => {
    expect(monthsBetween(iso('2024-03-01'), iso('2024-03-31'))).toBe(1)
  })

  it('counts whole years', () => {
    expect(monthsBetween(iso('2020-01-01'), iso('2020-12-31'))).toBe(12)
  })

  it('counts across a year boundary', () => {
    expect(monthsBetween(iso('2023-11-01'), iso('2024-02-29'))).toBe(4)
  })

  it('never returns less than one month', () => {
    expect(monthsBetween(iso('2024-03-10'), iso('2024-03-11'))).toBe(1)
  })
})

describe('formatPeriod', () => {
  it('names both months of a finished role', () => {
    expect(formatPeriod(job({ startDate: iso('2021-07-01'), endDate: iso('2024-03-31') }))).toBe(
      'July 2021 - March 2024',
    )
  })

  it('says Present while the role is current', () => {
    expect(formatPeriod(job({ startDate: iso('2024-04-01'), endDate: null }))).toBe(
      'April 2024 - Present',
    )
  })
})

describe('formatDuration', () => {
  const now = iso('2026-10-04')

  it('reports months alone under a year', () => {
    expect(
      formatDuration(job({ startDate: iso('2024-01-01'), endDate: iso('2024-11-30') }), now),
    ).toBe('11 mo')
  })

  it('drops the months on an exact year', () => {
    expect(
      formatDuration(job({ startDate: iso('2020-01-01'), endDate: iso('2020-12-31') }), now),
    ).toBe('1 yr')
  })

  it('reports years and months together', () => {
    expect(
      formatDuration(job({ startDate: iso('2021-07-01'), endDate: iso('2024-03-31') }), now),
    ).toBe('2 yr 9 mo')
  })

  it('measures a current role up to the given day, not its missing end', () => {
    const current = job({ startDate: iso('2026-08-01'), endDate: null })

    expect(formatDuration(current, now)).toBe('3 mo')
  })
})
