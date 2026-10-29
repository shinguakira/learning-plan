import type { Technology } from "@prisma/client"

import { prisma } from "../lib/prisma.js"

export const technologyRepository = {
  findAll(): Promise<Technology[]> {
    return prisma.technology.findMany({ orderBy: { createdAt: "asc" } })
  },
}
