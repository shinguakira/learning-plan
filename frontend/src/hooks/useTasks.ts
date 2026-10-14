import { useEffect, useRef, useState } from 'react'
import { fetchTasks } from '@/api/tasks'
import { createSeedTasks } from '@/utils/seed'
import type { SeedTask, Task, TaskDraft } from '@/types/task'

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const seed = useRef<SeedTask[] | null>(null)
  const cleared = useRef(false)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    fetchTasks(controller.signal)
      .then((response) => {
        if (!active) return
        seed.current = response.tasks
        // Do not resurrect samples after Delete all, or overwrite tasks added while loading.
        if (!cleared.current) {
          const samples = createSeedTasks(response.tasks)
          setTasks((previous) => [...previous, ...samples])
        }
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Failed to load tasks.')
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
    tasks,
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
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)))
    },
    removeTask: (id) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    },
    resetToSeed: () => {
      cleared.current = false
      if (seed.current !== null) {
        setTasks(createSeedTasks(seed.current))
      } else {
        setError(null)
        setLoading(true)
        setAttempt((previous) => previous + 1)
      }
    },
    clearAll: () => {
      cleared.current = true
      setTasks([])
    },
  }
}
