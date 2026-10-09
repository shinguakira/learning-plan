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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function TasksPage() {
  const { tasks, loading, error, addTask, updateTask, removeTask, resetToSeed, clearAll } =
    useTasks()
  const [view, setView] = useState<ViewMode>('list')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const filters = useTaskFilters(tasks)

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Learning tasks</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Sample data loads on every visit. Nothing is saved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsFormOpen(!isFormOpen)
            }}
          >
            Add a Task
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetToSeed}
            disabled={loading}
          >
            <RotateCcw />
            Reload sample data
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            <Trash2 />
            Delete all
          </Button>
        </div>
      </div>

      {loading && (
        <p role="status" className="text-muted-foreground text-sm">
          Loading sample tasks…
        </p>
      )}
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error} You can still add tasks, or retry with Reload sample data.
        </p>
      )}

      <TaskStats tasks={tasks} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={addTask} />
        </DialogContent>
      </Dialog>

      <TaskFilters filters={filters} total={tasks.length} view={view} onViewChange={setView} />

      {view === 'list' ? (
        <TaskListView
          key={JSON.stringify([
            filters.query,
            filters.statusFilter,
            filters.categoryFilter,
            filters.sortKey,
          ])}
          tasks={filters.visible}
          onUpdate={updateTask}
          onRemove={removeTask}
        />
      ) : (
        <TimelineView tasks={filters.visible} />
      )}
    </div>
  )
}
