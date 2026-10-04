import { useState } from 'react'
import { createSeedTasks } from '@/utils/seed'
import type { Task, TaskDraft } from '@/types/task'

export type TasksApi = {
  tasks: Task[]
  addTask: (draft: TaskDraft) => void
  updateTask: (id: string, patch: Partial<TaskDraft>) => void
  removeTask: (id: string) => void
  resetToSeed: () => void
  clearAll: () => void
}

/** The task list, in memory only. Nothing is written anywhere. */
export function useTasks(): TasksApi {
  const [tasks, setTasks] = useState<Task[]>(createSeedTasks)

  return {
    tasks,
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
    resetToSeed: () => setTasks(createSeedTasks()),
    clearAll: () => setTasks([]),
  }
}
