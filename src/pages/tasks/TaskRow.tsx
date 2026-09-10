import { useState } from 'react'
import { CalendarDays, Clock, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CATEGORY_THEME,
  DUE_TONE,
  PRIORITY_CHIP,
  PRIORITY_LABEL,
  STATUS_CHIP,
  STATUS_LABEL,
} from '@/constants/task'
import { cn } from '@/lib/utils'
import { formatShort } from '@/utils/date'
import { describeDue } from '@/utils/task'
import { StatusToggle } from '@/pages/tasks/StatusToggle'
import type { Task } from '@/types/task'

export function TaskRow({
  task,
  onCycleStatus,
  onRemove,
}: {
  task: Task
  onCycleStatus: () => void
  onRemove: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const due = describeDue(task.dueDate)
  const theme = CATEGORY_THEME[task.category]
  const finished = task.status === 'done'

  return (
    <li className="group hover:bg-muted/50 flex items-start gap-3 px-4 py-3.5 transition">
      <div className="pt-0.5">
        <StatusToggle status={task.status} onClick={onCycleStatus} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium break-words',
            finished && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </p>
        {task.note && (
          <p className="text-muted-foreground mt-0.5 text-xs break-words">{task.note}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={theme.chip}>
            <span className={cn('size-1.5 rounded-full', theme.dot)} />
            {task.category}
          </Badge>
          <Badge variant="outline" className={STATUS_CHIP[task.status]}>
            {STATUS_LABEL[task.status]}
          </Badge>
          <Badge variant="outline" className={PRIORITY_CHIP[task.priority]}>
            {PRIORITY_LABEL[task.priority]} priority
          </Badge>
          <span className="text-muted-foreground ml-1 flex items-center gap-1 text-[11px]">
            <CalendarDays className="size-3" />
            {formatShort(task.startDate)} → {formatShort(task.dueDate)}
          </span>
          {task.estimatedHours > 0 && (
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Clock className="size-3" />
              {task.estimatedHours}h
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {!finished && (
          <span className={cn('text-[11px] font-medium', DUE_TONE[due.tone])}>{due.label}</span>
        )}
        {confirming ? (
          <span className="flex items-center gap-1">
            <Button type="button" variant="destructive" size="xs" onClick={onRemove}>
              Delete
            </Button>
            <Button type="button" variant="ghost" size="xs" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setConfirming(true)}
            aria-label={`Delete "${task.title}"`}
            className="text-muted-foreground hover:text-destructive opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </li>
  )
}
