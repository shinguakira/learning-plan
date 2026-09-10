import { CircleCheck, CircleDashed, Clock, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { summarizeTasks } from '@/utils/task'
import { StatTile } from '@/pages/tasks/StatTile'
import type { Task } from '@/types/task'

export function TaskStats({ tasks }: { tasks: readonly Task[] }) {
  const summary = summarizeTasks(tasks)

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
