import { useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { useTasks } from '@/hooks/useTasks'
import { TaskFilters } from '@/pages/tasks/TaskFilters'
import { TaskForm } from '@/pages/tasks/TaskForm'
import { TaskListView } from '@/pages/tasks/TaskListView'
import { TaskStats } from '@/pages/tasks/TaskStats'
import { TimelineView } from '@/pages/tasks/TimelineView'
import type { ViewMode } from '@/types/task'

export function TasksPage() {
  const { tasks, addTask, updateTask, removeTask, resetToSeed, clearAll } = useTasks()
  const [view, setView] = useState<ViewMode>('list')
  const filters = useTaskFilters(tasks)

  return (
    <div className="scrollbar-slim mx-auto h-full max-w-6xl space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Learning tasks</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Sample data loads on every visit. Nothing is saved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={resetToSeed}>
            <RotateCcw />
            Reload sample data
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            <Trash2 />
            Delete all
          </Button>
        </div>
      </div>

      <TaskStats tasks={tasks} />
      <TaskForm onSubmit={addTask} />
      <TaskFilters filters={filters} total={tasks.length} view={view} onViewChange={setView} />

      {view === 'list' ? (
        <TaskListView tasks={filters.visible} onUpdate={updateTask} onRemove={removeTask} />
      ) : (
        <TimelineView tasks={filters.visible} />
      )}
    </div>
  )
}
