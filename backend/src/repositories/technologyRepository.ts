import { prisma } from "../lib/prisma.js"
import type { Technology } from "@prisma/client"

export const technologyRepository = {
  findAll(): Promise<Technology[]> {
    return prisma.technology.findMany({ orderBy: { createdAt: "asc" } })
  },
}
