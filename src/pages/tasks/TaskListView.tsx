import { Card } from '@/components/ui/card'
import { NEXT_STATUS } from '@/constants/task'
import { EmptyState } from '@/pages/tasks/EmptyState'
import { TaskRow } from '@/pages/tasks/TaskRow'
import type { Task, TaskDraft } from '@/types/task'

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
    <Card className="overflow-hidden py-0">
      <ul className="divide-y">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onCycleStatus={() => onUpdate(task.id, { status: NEXT_STATUS[task.status] })}
            onRemove={() => onRemove(task.id)}
          />
        ))}
      </ul>
    </Card>
  )
}
