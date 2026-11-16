import type {
  EmploymentType as ApiEmploymentType,
  Job as ApiJob,
  PutApiJobsByIdData,
} from "@/api/generated"
import type { ISODate } from "@/types/date"

export type EmploymentType = ApiEmploymentType

export type Job = Omit<ApiJob, "startDate" | "endDate"> & {
  startDate: ISODate
  endDate: ISODate | null
}

export type JobDraft = Omit<PutApiJobsByIdData["body"], "startDate" | "endDate"> &
  Pick<Job, "startDate" | "endDate">
