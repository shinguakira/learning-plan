import { PROFILE_CSV_COLUMNS } from "../constants/profileCsv.js"
import type { Profile } from "../types/profile.js"
import type { ProfileCsvRow } from "../types/profileCsv.js"

/** RFC 4180-style CSV: quote a field that needs it, double its internal quotes. */
function escapeField(field: string): string {
  return /[",\r\n]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field
}

/** Shared CSV serialization for profile and task downloads. */
export function serializeCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(escapeField).join(",")).join("\r\n")
}

/** Export every user-facing profile field through the existing CSV escaper. */
export function toCsv(profile: Profile): string {
  const rows: ProfileCsvRow[] = [
    ...profile.skills.map((skill) => ({
      section: "skills" as const,
      name: skill.name,
      level: skill.level,
      yearsOfExperience: String(skill.yearsOfExperience),
    })),
    ...profile.strengths.map((strength) => ({
      section: "strengths" as const,
      name: strength.name,
      description: strength.description,
    })),
    ...profile.jobs.map((job) => ({
      section: "jobs" as const,
      company: job.company,
      title: job.title,
      employmentType: job.employmentType,
      startDate: job.startDate,
      endDate: job.endDate ?? "",
      summary: job.summary,
    })),
    ...profile.certificates.map((certificate) => ({
      section: "certificates" as const,
      name: certificate.name,
      issuer: certificate.issuer,
      dateEarned: certificate.dateEarned,
      credentialUrl: certificate.credentialUrl ?? "",
    })),
  ]

  return serializeCsv([
    PROFILE_CSV_COLUMNS,
    ...rows.map((row) => PROFILE_CSV_COLUMNS.map((column) => row[column] ?? "")),
  ])
}
