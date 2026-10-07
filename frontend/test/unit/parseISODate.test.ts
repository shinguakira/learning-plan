import { describe, expect, it } from 'vitest'
import { parseISODate } from '@/utils/date'

describe('parseISODate', () => {
  it('accepts calendar dates including leap day', () => {
    expect(parseISODate('2024-02-29')).toBe('2024-02-29')
    expect(parseISODate('2025-06-30')).toBe('2025-06-30')
  })
  it.each([
    '',
    '2025-02-29',
    '2024-02-30',
    '2025-13-01',
    '2025-00-01',
    '2025-01-00',
    '2025-6-3',
    '2025-06-30T00:00:00Z',
  ])('rejects %j', (value) => {
    expect(parseISODate(value)).toBeNull()
  })
})
