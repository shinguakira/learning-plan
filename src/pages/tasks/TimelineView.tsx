import { Card } from '@/components/ui/card'
import { CATEGORY_THEME } from '@/constants/task'
import { DAY_W, LABEL_W, ROW_H } from '@/constants/timeline'
import { useTimeline } from '@/hooks/useTimeline'
import { cn } from '@/lib/utils'
import { isWeekend, today } from '@/utils/date'
import { EmptyState } from '@/pages/tasks/EmptyState'
import { TimelineBar } from '@/pages/tasks/TimelineBar'
import { TimelineDays, TimelineMonths } from '@/pages/tasks/TimelineHeader'
import { TimelineLegend } from '@/pages/tasks/TimelineLegend'
import type { ISODate } from '@/types/date'
import type { Task } from '@/types/task'

/** Weekend shading, drawn once behind every row rather than per row. */
function WeekendColumns({ days, gridWidth }: { days: readonly ISODate[]; gridWidth: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 z-0 flex"
      style={{ left: LABEL_W, width: gridWidth }}
      aria-hidden
    >
      {days.map((day) => (
        <div
          key={day}
          style={{ width: DAY_W }}
          className={cn('shrink-0 border-r', isWeekend(day) && 'bg-muted/40')}
        />
      ))}
    </div>
  )
}

function TimelineRow({
  task,
  domainStart,
  gridWidth,
}: {
  task: Task
  domainStart: ISODate
  gridWidth: number
}) {
  return (
    <div className="relative flex border-b last:border-b-0" style={{ height: ROW_H }}>
      <div
        className="bg-card sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r px-4"
        style={{ width: LABEL_W }}
      >
        <span className={cn('size-2 shrink-0 rounded-full', CATEGORY_THEME[task.category].dot)} />
        <span
          className={cn(
            'truncate text-xs',
            task.status === 'done' && 'text-muted-foreground line-through',
          )}
          title={task.title}
        >
          {task.title}
        </span>
      </div>
      <div className="relative shrink-0" style={{ width: gridWidth }}>
        <TimelineBar task={task} domainStart={domainStart} />
      </div>
    </div>
  )
}

export function TimelineView({ tasks }: { tasks: readonly Task[] }) {
  const { sorted, domain, months, todayOffset, gridWidth, usedCategories } = useTimeline(tasks)

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="Nothing to place on the timeline"
        description="Tasks with a start and due date show up here as bars along the calendar."
      />
    )
  }

  const todayVisible = todayOffset >= 0 && todayOffset < domain.days.length

  return (
    <Card className="overflow-hidden py-0">
      <div className="scrollbar-slim overflow-x-auto">
        <div style={{ minWidth: LABEL_W + gridWidth }}>
          <TimelineMonths months={months} gridWidth={gridWidth} />
          <TimelineDays days={domain.days} today={today()} gridWidth={gridWidth} />

          <div className="relative">
            <WeekendColumns days={domain.days} gridWidth={gridWidth} />
            {todayVisible && (
              <div
                className="bg-primary/70 pointer-events-none absolute inset-y-0 z-10 w-px"
                style={{ left: LABEL_W + todayOffset * DAY_W + DAY_W / 2 }}
                aria-hidden
              />
            )}

            {sorted.map((task) => (
              <TimelineRow
                key={task.id}
                task={task}
                domainStart={domain.start}
                gridWidth={gridWidth}
              />
            ))}
          </div>
        </div>
      </div>

      <TimelineLegend categories={usedCategories} />
    </Card>
  )
}
