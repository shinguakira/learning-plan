import type { EmploymentType as EmploymentTypeRow } from "@prisma/client"
import type { EmploymentType } from "../types/job.js"

export const EMPLOYMENT_TYPE_API = {
  full_time: "full-time",
  contract: "contract",
  part_time: "part-time",
  internship: "internship",
} as const satisfies Record<EmploymentTypeRow, EmploymentType>
