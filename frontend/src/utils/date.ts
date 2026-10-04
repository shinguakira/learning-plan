import { DAY_MS, MONTH, MONTH_SHORT, WEEKDAY, WEEKDAY_INITIAL } from '@/constants/date'
import type { DayIndex, ISODate, MonthIndex, WeekdayInitial } from '@/types/date'

/**
 * Dates are handled everywhere as local 'YYYY-MM-DD' strings.
 * `new Date('2026-09-10')` parses as UTC and shifts the day in some zones,
 * so parsing and formatting are done by hand.
 *
 * This module is the only place that mints an ISODate - see `@/types/date`.
 */

export function parseDate(iso: ISODate): Date {
  // Fixed-width slices rather than split(): every part is a string, so there is
  // no possibly-undefined element to assert away.
  const year = Number(iso.slice(0, 4))
  const month = Number(iso.slice(5, 7))
  const day = Number(iso.slice(8, 10))
  return new Date(year, month - 1, day)
}

/** Both casts below are sound by spec, and are the only ones in this module. */
function dayIndex(date: Date): DayIndex {
  return date.getDay() as DayIndex
}

function monthIndex(date: Date): MonthIndex {
  return date.getMonth() as MonthIndex
}

export function toISODate(date: Date): ISODate {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}` as ISODate
}

export function today(): ISODate {
  return toISODate(new Date())
}

export function addDays(iso: ISODate, days: number): ISODate {
  const date = parseDate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

/** b - a, in days (positive when a is earlier). */
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / DAY_MS)
}

/** Every date from start to end, both ends included. */
export function eachDay(start: ISODate, end: ISODate): ISODate[] {
  const days: ISODate[] = []
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    days.push(cursor)
  }
  return days
}

export function isWeekend(iso: ISODate): boolean {
  const day = dayIndex(parseDate(iso))
  return day === 0 || day === 6
}

export function weekdayInitial(iso: ISODate): WeekdayInitial {
  return WEEKDAY_INITIAL[dayIndex(parseDate(iso))]
}

/** 'Sep 10 (Wed)' */
export function formatShort(iso: ISODate): string {
  const date = parseDate(iso)
  return `${MONTH_SHORT[monthIndex(date)]} ${date.getDate()} (${WEEKDAY[dayIndex(date)]})`
}

/** 'September 2026' */
export function formatMonth(iso: ISODate): string {
  const date = parseDate(iso)
  return `${MONTH[monthIndex(date)]} ${date.getFullYear()}`
}
