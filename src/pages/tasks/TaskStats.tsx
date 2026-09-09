import { today } from '@/utils/date'
import { cn } from '@/lib/cn'
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
  dot,
  alert = false,
}: {
  label: string
  value: number
  unit?: string
  dot?: string
  alert?: boolean
}) {
  return (
    <div className="min-w-[76px]">
      <div className="flex items-center gap-1.5">
        {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
        <span className="text-[11px] text-slate-500">{label}</span>
      </div>
      <p
        className={cn('mt-0.5 text-xl font-semibold', alert && value > 0 ? 'text-rose-600' : 'text-slate-800')}
      >
        {value}
        {unit && <span className="ml-0.5 text-xs font-medium text-slate-400">{unit}</span>}
      </p>
    </div>
  )
}

export function TaskStats({ tasks }: { tasks: readonly Task[] }) {
  const summary = summarize(tasks)

  return (
    <section className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      {/* The one number this view leads with. */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[11px] text-slate-500">Progress</p>
          <p className="text-5xl leading-none font-semibold text-slate-900">
            {summary.rate}
            <span className="ml-0.5 text-xl font-medium text-slate-400">%</span>
          </p>
        </div>
        <div className="w-40">
          {/* Meter: accent fill on a lighter step of the same ramp for the track. */}
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-indigo-100"
            role="progressbar"
            aria-valuenow={summary.rate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Share of tasks completed"
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
              style={{ width: `${summary.rate}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            {summary.done} of {summary.total} done
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-x-7 gap-y-4">
        <StatTile label="To do" value={summary.todo} dot="bg-slate-300" />
        <StatTile label="In progress" value={summary.doing} dot="bg-blue-500" />
        <StatTile label="Done" value={summary.done} dot="bg-emerald-600" />
        <StatTile label="Overdue" value={summary.overdue} alert />
        <StatTile label="Estimated" value={summary.hours} unit="h" />
      </div>
    </section>
  )
}
