import { useState } from 'react'
import {
  CATEGORY_THEME,
  DUE_TONE,
  NEXT_STATUS,
  PRIORITY_CHIP,
  PRIORITY_LABEL,
  STATUS_CHIP,
  STATUS_LABEL,
} from '@/constants/task'
import { formatShort } from '@/utils/date'
import { describeDue } from '@/utils/task'
import { cn } from '@/lib/cn'
import { Chip } from '@/pages/tasks/Chip'
import { EmptyState } from '@/pages/tasks/EmptyState'
import type { Status, Task, TaskDraft } from '@/types/task'

function StatusToggle({ status, onClick }: { status: Status; onClick: () => void }) {
  const shared = 'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition'
  if (status === 'done') {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Done -> To do"
        aria-label="Cycle status (currently: Done)"
        className={`${shared} border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600`}
      >
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
  if (status === 'doing') {
    return (
      <button
        type="button"
        onClick={onClick}
        title="In progress -> Done"
        aria-label="Cycle status (currently: In progress)"
        className={`${shared} border-blue-500 text-blue-500 hover:bg-blue-50`}
      >
        <span className="size-2 rounded-full bg-blue-500" />
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title="To do -> In progress"
      aria-label="Cycle status (currently: To do)"
      className={`${shared} border-slate-300 hover:border-slate-400 hover:bg-slate-50`}
    />
  )
}

function TaskRow({
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
    <li className="group flex items-start gap-3 px-4 py-3.5 transition hover:bg-slate-50/70">
      <div className="pt-0.5">
        <StatusToggle status={task.status} onClick={onCycleStatus} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium break-words',
            finished ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800',
          )}
        >
          {task.title}
        </p>
        {task.note && <p className="mt-0.5 text-xs text-slate-400 break-words">{task.note}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Chip className={theme.chip}>
            <span className={`size-1.5 rounded-full ${theme.dot}`} />
            {task.category}
          </Chip>
          <Chip className={STATUS_CHIP[task.status]}>{STATUS_LABEL[task.status]}</Chip>
          <Chip className={PRIORITY_CHIP[task.priority]}>
            {PRIORITY_LABEL[task.priority]} priority
          </Chip>
          <span className="ml-1 text-[11px] text-slate-400">
            {formatShort(task.startDate)} → {formatShort(task.dueDate)}
          </span>
          {task.estimatedHours > 0 && (
            <span className="text-[11px] text-slate-400">· {task.estimatedHours}h</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {!finished && (
          <span className={`text-[11px] font-medium ${DUE_TONE[due.tone]}`}>{due.label}</span>
        )}
        {confirming ? (
          <span className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-rose-500"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Delete "${task.title}"`}
            className="rounded-md p-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9a1 1 0 0 0 1 1h4.8a1 1 0 0 0 1-1L12 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}

export function TaskListView({
  tasks,
  onUpdate,
  onRemove,
}: {
  tasks: readonly Task[]
  onUpdate: (id: string, patch: Partial<TaskDraft>) => void
  onRemove: (id: string) => void
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks to show"
        description="Nothing matches the current filters, or no tasks have been added yet. Use the form above to add one."
      />
    )
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onCycleStatus={() => onUpdate(task.id, { status: NEXT_STATUS[task.status] })}
          onRemove={() => onRemove(task.id)}
        />
      ))}
    </ul>
  )
}
