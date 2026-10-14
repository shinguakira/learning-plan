import { createContext, useContext } from "react"
import type { TasksApi } from "@/hooks/useTaskState"

export const TasksContext = createContext<TasksApi | null>(null)

/** The current plan shared by Tasks and Chat for this browser session. */
export function useTasks(): TasksApi {
  const context = useContext(TasksContext)
  if (context === null) throw new Error("useTasks must be used within a TasksProvider")
  return context
}
