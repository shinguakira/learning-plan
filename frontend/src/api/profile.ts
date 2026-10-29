import { PROFILE_API_URL, PROFILE_CSV_API_URL, PROFILE_PDF_API_URL } from "@/constants/profile"

import type { MockUser } from "@/types/user"
import type { ProfileSeed } from "@/types/profile"

export async function fetchProfile(user: MockUser, signal?: AbortSignal): Promise<ProfileSeed> {
  let response: Response
  try {
    response = await fetch(`${PROFILE_API_URL}?${new URLSearchParams({ user })}`, { signal })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as ProfileSeed
}

/** Downloads the complete sample profile CSV from the backend. */
export async function downloadProfileCsv(): Promise<void> {
  let response: Response
  try {
    response = await fetch(PROFILE_CSV_API_URL)
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement("a")
    link.href = url
    link.download = "profile.csv"
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Posts the sections as the page has them, so unsaved edits reach the PDF. */
export async function downloadProfilePdf(user: MockUser, profile: ProfileSeed): Promise<void> {
  let response: Response
  try {
    response = await fetch(PROFILE_PDF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, profile }),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement("a")
    link.href = url
    link.download = `profile-${user.toLowerCase()}.pdf`
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}
