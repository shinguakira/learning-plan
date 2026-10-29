import { type Job as JobRow, Prisma } from "@prisma/client"

import { EMPLOYMENT_TYPE_API } from "../constants/job.js"
import { jobRepository } from "../repositories/jobRepository.js"
import type { Job } from "../types/job.js"
import type { JobCreateRequest, JobUpdateRequest } from "../types/jobDraft.js"
import type { MockUser } from "../types/user.js"

const toJob = (row: JobRow): Job => ({
  id: row.id,
  company: row.company,
  title: row.title,
  employmentType: EMPLOYMENT_TYPE_API[row.employmentType],
  startDate: row.startDate.toISOString().slice(0, 10),
  endDate: row.endDate === null ? null : row.endDate.toISOString().slice(0, 10),
  summary: row.summary,
  createdAt: row.createdAt.toISOString(),
})

/** Owns job history data access and any business rules around it. */
export const jobService = {
  async addJob(request: JobCreateRequest): Promise<Job> {
    return toJob(await jobRepository.create(request))
  },

  async getJobs(): Promise<Job[]> {
    return (await jobRepository.findAll()).map(toJob)
  },

  async getJobsByUser(user: MockUser): Promise<Job[]> {
    return (await jobRepository.findByUserName(user)).map(toJob)
  },

  async updateJob(id: string, request: JobUpdateRequest): Promise<Job | null> {
    try {
      return toJob(await jobRepository.update(id, request))
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null
      }
      throw error
    }
  },
}
