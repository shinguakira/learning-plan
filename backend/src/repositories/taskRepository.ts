import { prisma } from "../lib/prisma.js"

export const taskRepository = {
  findAll() {
    return prisma.task.findMany({ orderBy: [{ startDate: "asc" }, { id: "asc" }] })
  },
}
