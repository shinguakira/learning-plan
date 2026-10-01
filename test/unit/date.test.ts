import { describe, expect, it } from 'vitest'
import { diffDays } from '@/utils/date'
import type { ISODate } from '@/types/date'

const iso = (value: string) => value as ISODate

describe('diffDays', () => {
  it('is positive when a comes before b', () => {
    expect(diffDays(iso('2026-01-01'), iso('2026-01-10'))).toBe(9)
  })

  it('is negative when a comes after b', () => {
    expect(diffDays(iso('2026-01-10'), iso('2026-01-01'))).toBe(-9)
  })

  it('is 0 when a and b are the same date', () => {
    expect(diffDays(iso('2026-01-01'), iso('2026-01-01'))).toBe(0)
  })
})
