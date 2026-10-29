import { TECHNOLOGIES_API_URL } from "@/constants/technology"
import type { Technology } from "@/types/technology"

export async function fetchTechnologies(signal?: AbortSignal): Promise<Technology[]> {
  let response: Response
  try {
    response = await fetch(TECHNOLOGIES_API_URL, { signal })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const body = (await response.json()) as { technologies: Technology[] }
  return body.technologies
}
