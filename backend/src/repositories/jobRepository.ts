import type { Job } from "@prisma/client"

import { EMPLOYMENT_TYPE_DB } from "../constants/job.js"
import { prisma } from "../lib/prisma.js"
import type { JobUpdateRequest } from "../types/jobDraft.js"

export const jobRepository = {
  findByUserName(userName: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: { user: { name: userName } },
      orderBy: { startDate: "desc" },
    })
  },

  findAll(): Promise<Job[]> {
    return prisma.job.findMany({ orderBy: { startDate: "desc" } })
  },

  update(id: string, request: JobUpdateRequest): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data: {
        company: request.company.trim(),
        title: request.title.trim(),
        employmentType: EMPLOYMENT_TYPE_DB[request.employmentType],
        startDate: new Date(`${request.startDate}T00:00:00.000Z`),
        endDate: request.endDate === null ? null : new Date(`${request.endDate}T00:00:00.000Z`),
        summary: request.summary.trim(),
      },
    })
  },
}
