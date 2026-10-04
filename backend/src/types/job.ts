export type EmploymentType = 'full-time' | 'contract' | 'part-time' | 'internship'

export type Job = {
  id: string
  company: string
  title: string
  employmentType: EmploymentType
  /** Local 'YYYY-MM-DD'. */
  startDate: string
  /** Local 'YYYY-MM-DD', or null while this is the current role. */
  endDate: string | null
  summary: string
  createdAt: string
}
