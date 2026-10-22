import { useSearchParams } from "react-router-dom"
import { CATEGORIES, STATUSES } from "@/constants/task"
import { filterTasks, sortTasks } from "@/utils/task"
import type { CategoryFilter, SortKey, StatusFilter, Task } from "@/types/task"

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
    STATUSES.find((value) => value === searchParams.get("status")) ?? "all"
  const categoryFilter: CategoryFilter =
    CATEGORIES.find((value) => value === searchParams.get("category")) ?? "all"
  const sort = searchParams.get("sort")
  const sortKey: SortKey =
    sort === "start" || sort === "priority" || sort === "created" ? sort : "due"
  const query = searchParams.get("q") ?? ""

  const setFilter = (
    key: "status" | "category" | "sort" | "q",
    value: string,
    defaultValue: string,
  ) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (value === defaultValue) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: key === "q" },
    )
  }

  const criteria = { status: statusFilter, category: categoryFilter, query }

  return {
    statusFilter,
    setStatusFilter: (value) => setFilter("status", value, "all"),
    categoryFilter,
    setCategoryFilter: (value) => setFilter("category", value, "all"),
    sortKey,
    setSortKey: (value) => setFilter("sort", value, "due"),
    query,
    setQuery: (value) => setFilter("q", value, ""),
    visible: sortTasks(filterTasks(tasks, criteria), sortKey),
    filtering: statusFilter !== "all" || categoryFilter !== "all" || query.trim() !== "",
  }
}
