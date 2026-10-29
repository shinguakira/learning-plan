import { JOBS_API_URL } from "@/constants/job"
import type { Job, JobDraft } from "@/types/job"

export async function updateJob(id: string, draft: JobDraft): Promise<Job> {
  let response: Response
  try {
    response = await fetch(`${JOBS_API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }
  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(failure?.message ?? `Request failed (${response.status})`)
  }
  return (await response.json()) as Job
}
