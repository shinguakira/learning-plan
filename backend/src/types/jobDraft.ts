import type { EmploymentType, Job } from "./job.js"
import type { MockUser } from "./user.js"

export type JobCreateRequest = Omit<Job, "id" | "createdAt"> & { user: MockUser }

export type JobUpdateRequest = {
  company: string
  title: string
  employmentType: EmploymentType
  startDate: string
  endDate: string | null
  summary: string
}
