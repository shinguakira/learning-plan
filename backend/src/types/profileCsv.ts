import type { PROFILE_CSV_COLUMNS } from "../constants/profileCsv.js"
import type { Profile } from "./profile.js"

export type ProfileCsvColumn = (typeof PROFILE_CSV_COLUMNS)[number]

export type ProfileCsvRow = {
  section: keyof Profile
} & Partial<Record<Exclude<ProfileCsvColumn, "section">, string>>
