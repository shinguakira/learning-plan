import type { WEEKDAY, WEEKDAY_INITIAL } from '@/constants/date'

declare const isoDateBrand: unique symbol

/**
 * A local calendar date as 'YYYY-MM-DD'.
 *
 * Branded so an arbitrary string cannot stand in for one: the only way to get an
 * ISODate is through the helpers in `@/utils/date`, or an explicit cast at a real
 * boundary (a `<input type="date">` value). That keeps a full ISO timestamp or a
 * user-typed string from silently flowing into date maths.
 */
export type ISODate = string & { readonly [isoDateBrand]: true }

/** Result of `Date#getDay()` - spec-guaranteed 0-6. */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Result of `Date#getMonth()` - spec-guaranteed 0-11. */
export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type Weekday = (typeof WEEKDAY)[number]
export type WeekdayInitial = (typeof WEEKDAY_INITIAL)[number]
