import { DAY_W, LABEL_W } from '@/constants/timeline'
import { cn } from '@/lib/utils'
import { isWeekend, parseDate, weekdayInitial } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { MonthSegment } from '@/types/timeline'

/** Top row: one heading per calendar month, spanning its day columns. */
export function TimelineMonths({
  months,
  gridWidth,
}: {
  months: readonly MonthSegment[]
  gridWidth: number
}) {
  return (
    <div className="bg-muted/50 flex border-b">
      <div
        className="sticky left-0 z-20 shrink-0 border-r px-4 py-2 text-xs font-semibold"
        style={{ width: LABEL_W }}
      >
        Task
      </div>
      <div className="flex" style={{ width: gridWidth }}>
        {months.map((month) => (
          <div
            key={month.key}
            className="shrink-0 border-r py-2 pl-2 text-xs font-semibold"
            style={{ width: month.span * DAY_W }}
          >
            {month.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Second row: the day number and weekday letter for every column. */
export function TimelineDays({
  days,
  today,
  gridWidth,
}: {
  days: readonly ISODate[]
  today: ISODate
  gridWidth: number
}) {
  return (
    <div className="flex border-b">
      <div className="bg-card sticky left-0 z-20 shrink-0 border-r" style={{ width: LABEL_W }} />
      <div className="flex" style={{ width: gridWidth }}>
        {days.map((day) => {
          const weekend = isWeekend(day)
          return (
            <div
              key={day}
              style={{ width: DAY_W }}
              className={cn(
                'flex shrink-0 flex-col items-center gap-0.5 py-1.5 text-[10px] leading-none',
                weekend && 'bg-muted/40',
              )}
            >
              <span
                className={
                  day === today
                    ? 'bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-bold'
                    : cn('font-semibold', weekend && 'text-muted-foreground')
                }
              >
                {parseDate(day).getDate()}
              </span>
              <span className="text-muted-foreground/70">{weekdayInitial(day)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
