import { useEffect, useRef, useState } from "react"
import { fetchTasks } from "@/api/tasks"
import { MOCK_USERS, TASK_ADMIN_USER } from "@/constants/user"
import { useMockUser } from "@/hooks/useMockUser"
import { createSeedTasks } from "@/utils/seed"
import { canViewTask } from "@/utils/task"
import type { SeedTask, Task, TaskDraft } from "@/types/task"
import type { MockUser } from "@/types/user"

export type TasksApi = {
  tasks: Task[]
  loading: boolean
  error: string | null
  addTask: (draft: TaskDraft) => void
  updateTask: (id: string, patch: Partial<TaskDraft>) => void
  removeTask: (id: string) => void
  resetToSeed: () => void
  clearAll: () => void
}

/** Seed from the backend on mount; all edits remain in browser memory. */
export function useTasks(): TasksApi {
  const { user } = useMockUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const seed = useRef<SeedTask[] | null>(null)
  const cleared = useRef(new Set<MockUser>())

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    fetchTasks(controller.signal)
      .then((response) => {
        if (!active) return
        seed.current = response.tasks
        // Preserve local additions and suppress late samples only for cleared users.
        const samples = createSeedTasks(response.tasks).filter(
          (task) => !cleared.current.has(task.assignee),
        )
        setTasks((previous) => [...previous, ...samples])
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : "Failed to load tasks.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  return {
    tasks: tasks.filter((task) => canViewTask(task, user)),
    loading,
    error,
    addTask: (draft) => {
      const task: Task = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [task, ...prev])
    },
    updateTask: (id, patch) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id && canViewTask(task, user) ? { ...task, ...patch } : task,
        ),
      )
    },
    removeTask: (id) => {
      setTasks((prev) => prev.filter((task) => task.id !== id || !canViewTask(task, user)))
    },
    resetToSeed: () => {
      if (user === TASK_ADMIN_USER) cleared.current.clear()
      else cleared.current.delete(user)
      if (seed.current !== null) {
        const samples = createSeedTasks(seed.current).filter((task) => canViewTask(task, user))
        setTasks((previous) => [...previous.filter((task) => !canViewTask(task, user)), ...samples])
      } else {
        setError(null)
        setLoading(true)
        setAttempt((previous) => previous + 1)
      }
    },
    clearAll: () => {
      for (const name of user === TASK_ADMIN_USER ? MOCK_USERS : [user]) {
        cleared.current.add(name)
      }
      setTasks((previous) => previous.filter((task) => !canViewTask(task, user)))
    },
  }
}
