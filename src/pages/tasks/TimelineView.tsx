import { CATEGORIES, CATEGORY_THEME, STATUS_LABEL } from '@/constants/task'
import {
  DAY_W,
  LABEL_W,
  MIN_BAR_LABEL_W,
  MIN_RANGE_DAYS,
  RANGE_PADDING_DAYS,
  ROW_H,
} from '@/constants/timeline'
import {
  addDays,
  diffDays,
  eachDay,
  formatMonth,
  formatShort,
  isWeekend,
  parseDate,
  today,
  weekdayInitial,
} from '@/utils/date'
import { EmptyState } from '@/pages/tasks/EmptyState'
import { cn } from '@/lib/cn'
import type { ISODate } from '@/types/date'
import type { Category, Task } from '@/types/task'

type Domain = {
  start: ISODate
  end: ISODate
  days: ISODate[]
}

/** Date range that fits every task and today, padded on both sides. */
function computeDomain(tasks: readonly Task[]): Domain {
  const now = today()
  let start = now
  let end = now
  for (const task of tasks) {
    if (task.startDate < start) start = task.startDate
    if (task.dueDate > end) end = task.dueDate
  }
  start = addDays(start, -RANGE_PADDING_DAYS)
  end = addDays(end, RANGE_PADDING_DAYS)
  const span = diffDays(start, end)
  if (span < MIN_RANGE_DAYS) end = addDays(end, MIN_RANGE_DAYS - span)
  return { start, end, days: eachDay(start, end) }
}

type MonthSegment = {
  key: string
  label: string
  span: number
}

function monthSegments(days: readonly ISODate[]): MonthSegment[] {
  const segments: MonthSegment[] = []
  for (const day of days) {
    const key = day.slice(0, 7)
    const last = segments.at(-1)
    if (last && last.key === key) last.span += 1
    else segments.push({ key, label: formatMonth(day), span: 1 })
  }
  return segments
}

function TimelineBar({ task, domainStart }: { task: Task; domainStart: ISODate }) {
  const offset = diffDays(domainStart, task.startDate)
  const spanDays = diffDays(task.startDate, task.dueDate) + 1
  const theme = CATEGORY_THEME[task.category]
  const width = spanDays * DAY_W - 6

  const tone =
    task.status === 'done' ? 'opacity-45' : task.status === 'doing' ? 'bar-striped' : 'opacity-80'

  const tooltip = [
    task.title,
    `${formatShort(task.startDate)} - ${formatShort(task.dueDate)}`,
    `${STATUS_LABEL[task.status]} / ${task.estimatedHours}h`,
  ].join('\n')

  return (
    <div
      className={`absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded-md px-2 text-[11px] font-medium text-white shadow-sm ring-1 ring-black/5 transition hover:brightness-110 ${theme.bar} ${tone}`}
      style={{ left: offset * DAY_W + 3, width }}
      title={tooltip}
    >
      {width >= MIN_BAR_LABEL_W && (
        <span className="truncate">
          {task.status === 'done' && '✓ '}
          {task.title}
        </span>
      )}
    </div>
  )
}

export function TimelineView({ tasks }: { tasks: readonly Task[] }) {
  const sorted = [...tasks].sort(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.dueDate.localeCompare(b.dueDate),
  )
  const domain = computeDomain(sorted)
  const months = monthSegments(domain.days)

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="Nothing to place on the timeline"
        description="Tasks with a start and due date show up here as bars along the calendar."
      />
    )
  }

  const now = today()
  const todayOffset = diffDays(domain.start, now)
  const gridWidth = domain.days.length * DAY_W
  const usedCategories = CATEGORIES.filter((category) =>
    sorted.some((task) => task.category === category),
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto scrollbar-slim">
        <div style={{ minWidth: LABEL_W + gridWidth }}>
          {/* Header row 1: months */}
          <div className="flex border-b border-slate-100 bg-slate-50/80">
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500"
              style={{ width: LABEL_W }}
            >
              Task
            </div>
            <div className="flex" style={{ width: gridWidth }}>
              {months.map((month) => (
                <div
                  key={month.key}
                  className="shrink-0 border-r border-slate-200 py-2 pl-2 text-xs font-semibold text-slate-500"
                  style={{ width: month.span * DAY_W }}
                >
                  {month.label}
                </div>
              ))}
            </div>
          </div>

          {/* Header row 2: days */}
          <div className="flex border-b border-slate-200 bg-white">
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-slate-200 bg-white"
              style={{ width: LABEL_W }}
            />
            <div className="flex" style={{ width: gridWidth }}>
              {domain.days.map((day) => {
                const isToday = day === now
                const weekend = isWeekend(day)
                return (
                  <div
                    key={day}
                    style={{ width: DAY_W }}
                    className={cn(
                      'flex shrink-0 flex-col items-center gap-0.5 py-1.5 text-[10px] leading-none',
                      weekend && 'bg-slate-50',
                    )}
                  >
                    <span
                      className={
                        isToday
                          ? 'rounded-full bg-indigo-600 px-1.5 py-0.5 font-bold text-white'
                          : `font-semibold ${weekend ? 'text-slate-400' : 'text-slate-600'}`
                      }
                    >
                      {parseDate(day).getDate()}
                    </span>
                    <span className={weekend ? 'text-rose-300' : 'text-slate-300'}>
                      {weekdayInitial(day)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rows */}
          <div className="relative">
            {/* Background layer so weekend shading spans every row */}
            <div
              className="pointer-events-none absolute inset-y-0 z-0 flex"
              style={{ left: LABEL_W, width: gridWidth }}
              aria-hidden
            >
              {domain.days.map((day) => (
                <div
                  key={day}
                  style={{ width: DAY_W }}
                  className={cn(
                    'shrink-0 border-r border-slate-100',
                    isWeekend(day) && 'bg-slate-50/70',
                  )}
                />
              ))}
            </div>
            {todayOffset >= 0 && todayOffset < domain.days.length && (
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-indigo-400/70"
                style={{ left: LABEL_W + todayOffset * DAY_W + DAY_W / 2 }}
                aria-hidden
              />
            )}

            {sorted.map((task) => {
              const theme = CATEGORY_THEME[task.category]
              return (
                <div
                  key={task.id}
                  className="relative flex border-b border-slate-100 last:border-b-0"
                  style={{ height: ROW_H }}
                >
                  <div
                    className="sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r border-slate-200 bg-white px-4"
                    style={{ width: LABEL_W }}
                  >
                    <span className={`size-2 shrink-0 rounded-full ${theme.dot}`} />
                    <span
                      className={cn(
                        'truncate text-xs',
                        task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700',
                      )}
                      title={task.title}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="relative shrink-0" style={{ width: gridWidth }}>
                    <TimelineBar task={task} domainStart={domain.start} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-[11px] text-slate-500">
        {usedCategories.map((category: Category) => (
          <span key={category} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${CATEGORY_THEME[category].dot}`} />
            {category}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="bar-striped size-2.5 rounded-xs bg-slate-400" />
            In progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-slate-400 opacity-45" />
            Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-px bg-indigo-400" />
            Today
          </span>
        </span>
      </div>
    </div>
  )
}
