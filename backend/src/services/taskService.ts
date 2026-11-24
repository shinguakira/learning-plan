import type { Task as TaskRow } from "@prisma/client"

import { taskRepository } from "../repositories/taskRepository.js"
import type { SeedTask } from "../types/task.js"

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  infra_cloud: "Infra / Cloud",
  database: "Database",
  cs_fundamentals: "CS Fundamentals",
  certification: "Certification",
} as const

function todayInMilliseconds() {
  const today = new Date()
  return Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
}

const toTask = (row: TaskRow): SeedTask => ({
  title: row.title,
  category: categoryLabels[row.category],
  status: row.status,
  priority: row.priority,
  estimatedHours: row.estimatedHours,
  note: row.note,
  offsetStart: (row.startDate.getTime() - todayInMilliseconds()) / 86_400_000,
  span: (row.dueDate.getTime() - row.startDate.getTime()) / 86_400_000,
})

/** Supplies the sample plan; edits are kept in browser memory. */
export const taskService = {
  async getTasks(): Promise<SeedTask[]> {
    return (await taskRepository.findAll()).map(toTask)
  },
}
