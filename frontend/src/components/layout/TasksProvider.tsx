import type { ReactNode } from "react"
import { TasksContext } from "@/hooks/useTasks"
import { useTaskState } from "@/hooks/useTaskState"

/** Keeps edits available when navigating between Tasks and Chat. */
export function TasksProvider({ children }: { children: ReactNode }) {
  const tasks = useTaskState()
  return <TasksContext.Provider value={tasks}>{children}</TasksContext.Provider>
}
