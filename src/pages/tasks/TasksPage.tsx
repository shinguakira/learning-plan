import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CATEGORIES, SORT_LABEL, STATUSES, STATUS_LABEL, VIEW_STORAGE_KEY } from '@/constants/task'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/cn'
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
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-md px-3 py-1.5 text-xs font-medium transition',
        active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
      )}
    >
      {children}
    </button>
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
          <h1 className="text-lg font-semibold text-slate-900">Learning tasks</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Tasks are stored in your browser via localStorage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToSeed}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reload sample data
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            Delete all
          </button>
        </div>
      </div>

      <TaskStats tasks={tasks} />

      <TaskForm onSubmit={addTask} />

      {/* Filters and the view switch share one row */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex rounded-lg bg-slate-100 p-1">
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

        <select
          aria-label="Filter by category"
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort order"
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          disabled={view === 'timeline'}
          title={view === 'timeline' ? 'The timeline is always ordered by start date' : undefined}
        >
          {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABEL[key]}
            </option>
          ))}
        </select>

        <input
          aria-label="Search tasks"
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400 w-44"
          placeholder="Search title and notes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <span className="text-xs text-slate-400">
          {visible.length} shown{filtering && ` of ${tasks.length}`}
        </span>

        <div className="ml-auto flex rounded-lg bg-slate-100 p-1">
          <SegmentedButton active={view === 'list'} onClick={() => setView('list')}>
            List
          </SegmentedButton>
          <SegmentedButton active={view === 'timeline'} onClick={() => setView('timeline')}>
            Timeline
          </SegmentedButton>
        </div>
      </div>

      {view === 'list' ? (
        <TaskListView tasks={visible} onUpdate={updateTask} onRemove={removeTask} />
      ) : (
        <TimelineView tasks={visible} />
      )}
    </div>
  )
}
