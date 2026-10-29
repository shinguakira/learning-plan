import { JOBS_API_URL } from "@/constants/job"
import type { Job, JobDraft } from "@/types/job"
import type { MockUser } from "@/types/user"

export async function createJob(user: MockUser, draft: JobDraft): Promise<Job> {
  let response: Response
  try {
    response = await fetch(JOBS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, ...draft }),
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
