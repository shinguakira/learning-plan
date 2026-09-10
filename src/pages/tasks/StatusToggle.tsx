import { Check } from 'lucide-react'
import { STATUS_LABEL } from '@/constants/task'
import { cn } from '@/lib/utils'
import type { Status } from '@/types/task'

const SHARED = 'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition'

/** What clicking the toggle will do next, for the tooltip. */
const NEXT_LABEL: Record<Status, string> = {
  todo: 'To do -> In progress',
  doing: 'In progress -> Done',
  done: 'Done -> To do',
}

/** The circle that cycles a task's status when clicked. */
export function StatusToggle({ status, onClick }: { status: Status; onClick: () => void }) {
  const shared = {
    type: 'button',
    onClick,
    title: NEXT_LABEL[status],
    'aria-label': `Cycle status (currently: ${STATUS_LABEL[status]})`,
  } as const

  if (status === 'done') {
    return (
      <button
        {...shared}
        className={cn(SHARED, 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700')}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </button>
    )
  }
  if (status === 'doing') {
    return (
      <button {...shared} className={cn(SHARED, 'border-blue-500 hover:bg-blue-500/10')}>
        <span className="size-2 rounded-full bg-blue-500" />
      </button>
    )
  }
  return (
    <button {...shared} className={cn(SHARED, 'border-input hover:border-ring hover:bg-muted')} />
  )
}
