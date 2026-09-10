import type { ISODate } from '@/types/date'

/** The date range the timeline draws, and every day inside it. */
export type Domain = {
  start: ISODate
  end: ISODate
  days: ISODate[]
}

/** One month heading, spanning `span` day columns. */
export type MonthSegment = {
  key: string
  label: string
  span: number
}
