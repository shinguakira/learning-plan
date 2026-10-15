import { PROFILE_CSV_COLUMNS } from '../constants/profileCsv.js'
import type { Profile } from '../types/profile.js'
import type { ProfileCsvRow } from '../types/profileCsv.js'
import { toCsv } from './csv.js'

/** Export every user-facing profile field through the existing CSV escaper. */
export function profileToCsv(profile: Profile): string {
  const rows: ProfileCsvRow[] = [
    ...profile.skills.map((skill) => ({
      section: 'skills' as const,
      name: skill.name,
      level: skill.level,
      yearsOfExperience: String(skill.yearsOfExperience),
    })),
    ...profile.strengths.map((strength) => ({
      section: 'strengths' as const,
      name: strength.name,
      description: strength.description,
    })),
    ...profile.jobs.map((job) => ({
      section: 'jobs' as const,
      company: job.company,
      title: job.title,
      employmentType: job.employmentType,
      startDate: job.startDate,
      endDate: job.endDate ?? '',
      summary: job.summary,
    })),
    ...profile.certificates.map((certificate) => ({
      section: 'certificates' as const,
      name: certificate.name,
      issuer: certificate.issuer,
      dateEarned: certificate.dateEarned,
      credentialUrl: certificate.credentialUrl ?? '',
    })),
  ]

  return toCsv([
    PROFILE_CSV_COLUMNS,
    ...rows.map((row) => PROFILE_CSV_COLUMNS.map((column) => row[column] ?? '')),
  ])
}
