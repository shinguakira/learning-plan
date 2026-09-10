import { CircleCheck, CircleDashed, Clock, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { today } from '@/utils/date'
import type { LucideIcon } from 'lucide-react'
import type { Task, TaskSummary } from '@/types/task'

function summarize(tasks: readonly Task[]): TaskSummary {
  const now = today()
  const summary: TaskSummary = {
    total: tasks.length,
    todo: 0,
    doing: 0,
    done: 0,
    overdue: 0,
    hours: 0,
    rate: 0,
  }
  for (const task of tasks) {
    summary[task.status] += 1
    summary.hours += task.estimatedHours
    if (task.status !== 'done' && task.dueDate < now) summary.overdue += 1
  }
  summary.rate = summary.total === 0 ? 0 : Math.round((summary.done / summary.total) * 100)
  return summary
}

/**
 * Label plus value. The value deliberately avoids tabular-nums: fixed-width
 * digits look loose at this size and only earn their keep in aligned columns.
 */
function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  iconClass,
  alert = false,
}: {
  label: string
  value: number
  unit?: string
  icon: LucideIcon
  iconClass?: string
  alert?: boolean
}) {
  return (
    <div className="min-w-[76px]">
      <div className="flex items-center gap-1.5">
        <Icon className={cn('size-3.5', iconClass ?? 'text-muted-foreground')} />
        <span className="text-muted-foreground text-[11px]">{label}</span>
      </div>
      <p className={cn('mt-0.5 text-xl font-semibold', alert && value > 0 && 'text-destructive')}>
        {value}
        {unit && <span className="text-muted-foreground ml-0.5 text-xs font-medium">{unit}</span>}
      </p>
    </div>
  )
}

export function TaskStats({ tasks }: { tasks: readonly Task[] }) {
  const summary = summarize(tasks)

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-5">
        {/* The one number this view leads with. */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-muted-foreground text-[11px]">Progress</p>
            <p className="text-5xl leading-none font-semibold">
              {summary.rate}
              <span className="text-muted-foreground ml-0.5 text-xl font-medium">%</span>
            </p>
          </div>
          <div className="w-40">
            <Progress value={summary.rate} aria-label="Share of tasks completed" />
            <p className="text-muted-foreground mt-1.5 text-[11px]">
              {summary.done} of {summary.total} done
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-12 sm:block" />

        <div className="flex flex-wrap items-start gap-x-7 gap-y-4">
          <StatTile label="To do" value={summary.todo} icon={CircleDashed} />
          <StatTile
            label="In progress"
            value={summary.doing}
            icon={LoaderCircle}
            iconClass="text-blue-500"
          />
          <StatTile
            label="Done"
            value={summary.done}
            icon={CircleCheck}
            iconClass="text-emerald-600"
          />
          <StatTile
            label="Overdue"
            value={summary.overdue}
            icon={TriangleAlert}
            iconClass={summary.overdue > 0 ? 'text-destructive' : undefined}
            alert
          />
          <StatTile label="Estimated" value={summary.hours} unit="h" icon={Clock} />
        </div>
      </CardContent>
    </Card>
  )
}
