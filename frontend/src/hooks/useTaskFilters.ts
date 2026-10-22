import { useSearchParams } from "react-router-dom"
import { CATEGORIES, STATUSES, TASK_FILTER_KEYS } from "@/constants/task"
import { filterTasks, sortTasks } from "@/utils/task"
import type { CategoryFilter, SortKey, StatusFilter, Task, TaskFilterKey } from "@/types/task"

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
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter: StatusFilter =
    STATUSES.find((value) => value === searchParams.get(TASK_FILTER_KEYS.status)) ?? "all"
  const categoryFilter: CategoryFilter =
    CATEGORIES.find((value) => value === searchParams.get(TASK_FILTER_KEYS.category)) ?? "all"
  const sort = searchParams.get(TASK_FILTER_KEYS.sort)
  const sortKey: SortKey =
    sort === "start" || sort === "priority" || sort === "created" ? sort : "due"
  const query = searchParams.get(TASK_FILTER_KEYS.query) ?? ""

  const setFilter = (key: TaskFilterKey, value: string, defaultValue: string) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (value === defaultValue) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: key === TASK_FILTER_KEYS.query },
    )
  }

  const criteria = { status: statusFilter, category: categoryFilter, query }

  return {
    statusFilter,
    setStatusFilter: (value) => setFilter(TASK_FILTER_KEYS.status, value, "all"),
    categoryFilter,
    setCategoryFilter: (value) => setFilter(TASK_FILTER_KEYS.category, value, "all"),
    sortKey,
    setSortKey: (value) => setFilter(TASK_FILTER_KEYS.sort, value, "due"),
    query,
    setQuery: (value) => setFilter(TASK_FILTER_KEYS.query, value, ""),
    visible: sortTasks(filterTasks(tasks, criteria), sortKey),
    filtering: statusFilter !== "all" || categoryFilter !== "all" || query.trim() !== "",
  }
}
