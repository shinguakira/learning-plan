import { taskCategoryForDb } from "../constants/task.js"
import { prisma } from "../lib/prisma.js"
import type { TaskCreateRequest } from "../types/taskDraft.js"

export const taskRepository = {
  findAll() {
    return prisma.task.findMany({ orderBy: [{ startDate: "asc" }, { id: "asc" }] })
  },
  create(request: TaskCreateRequest) {
    return prisma.task.create({
      data: {
        title: request.title.trim(),
        category: taskCategoryForDb[request.category],
        status: request.status,
        priority: request.priority,
        estimatedHours: request.estimatedHours,
        note: request.note.trim(),
        assignee: { connect: { name: request.assignee } },
        startDate: new Date(`${request.startDate}T00:00:00.000Z`),
        dueDate: new Date(`${request.dueDate}T00:00:00.000Z`),
      },
    })
  },
}
