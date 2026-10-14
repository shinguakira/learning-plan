import { CATEGORY_THEME, STATUS_LABEL } from '@/constants/task'
import { DAY_W, MIN_BAR_LABEL_W } from '@/constants/timeline'
import { cn } from '@/lib/utils'
import { diffDays, formatShort } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { Task } from '@/types/task'

/** Gap on each side of a bar so neighbouring rows do not touch. */
const BAR_INSET = 3

const STATUS_TONE: Record<Task['status'], string> = {
  done: 'opacity-45',
  doing: 'bar-striped',
  todo: 'opacity-80',
}

export function TimelineBar({ task, domainStart }: { task: Task; domainStart: ISODate }) {
  const offset = diffDays(domainStart, task.startDate)
  const spanDays = diffDays(task.startDate, task.dueDate) + 1
  const width = spanDays * DAY_W - BAR_INSET * 2

  const tooltip = [
    task.title,
    `${formatShort(task.startDate)} - ${formatShort(task.dueDate)}`,
    `${STATUS_LABEL[task.status]} / ${task.estimatedHours}h`,
  ].join('\n')

  return (
    <div
      className={cn(
        'absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded-md px-2 text-[11px] font-medium text-white shadow-sm ring-1 ring-black/5 transition hover:brightness-110',
        CATEGORY_THEME[task.category].bar,
        STATUS_TONE[task.status],
      )}
      style={{ left: offset * DAY_W + BAR_INSET, width }}
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
