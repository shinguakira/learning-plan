import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STATUS_LABEL, STATUS_TOGGLE } from '@/constants/task'
import { cn } from '@/lib/utils'
import type { Status } from '@/types/task'

/** What clicking the toggle will do next, for the tooltip. */
const NEXT_LABEL: Record<Status, string> = {
  todo: 'To do -> In progress',
  doing: 'In progress -> Done',
  done: 'Done -> To do',
}

/** The circle that cycles a task's status when clicked. */
export function StatusToggle({ status, onClick }: { status: Status; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={onClick}
      title={NEXT_LABEL[status]}
      aria-label={`Cycle status (currently: ${STATUS_LABEL[status]})`}
      className={cn('rounded-full border-2', STATUS_TOGGLE[status])}
    >
      {status === 'done' && <Check className="size-3.5" strokeWidth={3} />}
      {status === 'doing' && <span className="size-2 rounded-full bg-blue-500" />}
    </Button>
  )
}
