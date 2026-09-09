import { useEffect, useState } from 'react'
import { readTasks, writeTasks } from '@/api/tasks'
import { createSeedTasks } from '@/utils/seed'
import type { Task, TaskDraft } from '@/types/task'

export interface TasksApi {
  tasks: Task[]
  addTask: (draft: TaskDraft) => void
  updateTask: (id: string, patch: Partial<TaskDraft>) => void
  removeTask: (id: string) => void
  resetToSeed: () => void
  clearAll: () => void
}

export function useTasks(): TasksApi {
  const [tasks, setTasks] = useState<Task[]>(readTasks)

  useEffect(() => {
    writeTasks(tasks)
  }, [tasks])

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
