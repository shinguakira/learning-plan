import type { EmploymentType as EmploymentTypeRow } from "@prisma/client"

import type { EmploymentType } from "../types/job.js"

export const EMPLOYMENT_TYPE_API = {
  full_time: "full-time",
  contract: "contract",
  part_time: "part-time",
  internship: "internship",
} as const satisfies Record<EmploymentTypeRow, EmploymentType>

export const EMPLOYMENT_TYPE_DB = {
  "full-time": "full_time",
  contract: "contract",
  "part-time": "part_time",
  internship: "internship",
} as const satisfies Record<EmploymentType, EmploymentTypeRow>
