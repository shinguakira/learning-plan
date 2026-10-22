import type { ProfileState } from "@/types/profile"

export const PROFILE_API_URL = "/api/profile"

/** Downloads all four sample profile sections in one CSV file. */
export const PROFILE_CSV_API_URL = "/api/profile/csv"

export const EMPTY_PROFILE_STATE: ProfileState = {
  skills: [],
  jobs: [],
  certificates: [],
  strengths: [],
  loading: true,
  error: null,
}
