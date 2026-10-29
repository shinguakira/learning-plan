import type { EmploymentType } from "./job.js"

export type JobUpdateRequest = {
  company: string
  title: string
  employmentType: EmploymentType
  startDate: string
  endDate: string | null
  summary: string
}
