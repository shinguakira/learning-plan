import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CalendarRange, List, RotateCcw, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, SORT_LABEL, STATUSES, STATUS_LABEL, VIEW_STORAGE_KEY } from '@/constants/task'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { sortTasks } from '@/utils/task'
import { TaskForm } from '@/pages/tasks/TaskForm'
import { TaskListView } from '@/pages/tasks/TaskListView'
import { TaskStats } from '@/pages/tasks/TaskStats'
import { TimelineView } from '@/pages/tasks/TimelineView'
import type { CategoryFilter, SortKey, StatusFilter, ViewMode } from '@/types/task'

function SegmentedButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(!active && 'text-muted-foreground')}
    >
      {children}
    </Button>
  )
}

export function TasksPage() {
  const { tasks, addTask, updateTask, removeTask, resetToSeed, clearAll } = useTasks()

  const [view, setView] = useState<ViewMode>(
    () => (localStorage.getItem(VIEW_STORAGE_KEY) as ViewMode | null) ?? 'list',
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('due')
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view)
  }, [view])

  const needle = query.trim().toLowerCase()
  const visible = sortTasks(
    tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false
      if (needle && !`${task.title} ${task.note}`.toLowerCase().includes(needle)) return false
      return true
    }),
    sortKey,
  )

  const filtering = statusFilter !== 'all' || categoryFilter !== 'all' || query.trim() !== ''

  return (
    <div className="scrollbar-slim mx-auto h-full max-w-6xl space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Learning tasks</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Tasks are stored in your browser via localStorage.
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

      {/* Filters and the view switch share one row */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2.5">
          <div className="bg-muted flex rounded-lg p-1">
            <SegmentedButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              All
            </SegmentedButton>
            {STATUSES.map((status) => (
              <SegmentedButton
                key={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {STATUS_LABEL[status]}
              </SegmentedButton>
            ))}
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
          >
            <SelectTrigger size="sm" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
            disabled={view === 'timeline'}
          >
            <SelectTrigger
              size="sm"
              aria-label="Sort order"
              title={
                view === 'timeline' ? 'The timeline is always ordered by start date' : undefined
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              aria-label="Search tasks"
              className="h-7 w-48 pl-7 text-xs"
              placeholder="Search title and notes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <span className="text-muted-foreground text-xs">
            {visible.length} shown{filtering && ` of ${tasks.length}`}
          </span>

          <div className="bg-muted ml-auto flex rounded-lg p-1">
            <SegmentedButton active={view === 'list'} onClick={() => setView('list')}>
              <List />
              List
            </SegmentedButton>
            <SegmentedButton active={view === 'timeline'} onClick={() => setView('timeline')}>
              <CalendarRange />
              Timeline
            </SegmentedButton>
          </div>
        </CardContent>
      </Card>

      {view === 'list' ? (
        <TaskListView tasks={visible} onUpdate={updateTask} onRemove={removeTask} />
      ) : (
        <TimelineView tasks={visible} />
      )}
    </div>
  )
}
