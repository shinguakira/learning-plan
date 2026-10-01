import { useState } from 'react'
import { filterTasks, sortTasks } from '@/utils/task'
import type { CategoryFilter, SortKey, StatusFilter, Task } from '@/types/task'

export type TaskFiltersApi = {
  statusFilter: StatusFilter
  setStatusFilter: (value: StatusFilter) => void
  categoryFilter: CategoryFilter
  setCategoryFilter: (value: CategoryFilter) => void
  sortKey: SortKey
  setSortKey: (value: SortKey) => void
  query: string
  setQuery: (value: string) => void
  /** The tasks that survive every filter, in the chosen order. */
  visible: Task[]
  /** True when at least one filter is narrowing the list. */
  filtering: boolean
}

/**
 * Owns the filter controls. The narrowing itself is `filterTasks` / `sortTasks`
 * in `@/utils/task`, so it can be tested without rendering anything.
 */
export function useTaskFilters(tasks: readonly Task[]): TaskFiltersApi {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('due')
  const [query, setQuery] = useState('')

  const criteria = { status: statusFilter, category: categoryFilter, query }

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortKey,
    setSortKey,
    query,
    setQuery,
    visible: sortTasks(filterTasks(tasks, criteria), sortKey),
    filtering: statusFilter !== 'all' || categoryFilter !== 'all' || query.trim() !== '',
  }
}
