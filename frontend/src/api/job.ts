import { JOBS_API_URL } from "@/constants/job"
import type { Job, JobDraft } from "@/types/job"
import type { MockUser } from "@/types/user"

async function send(url: string, method: "POST" | "PUT", body: unknown): Promise<Job> {
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

export async function createJob(user: MockUser, draft: JobDraft): Promise<Job> {
  return send(JOBS_API_URL, "POST", { user, ...draft })
}

export async function updateJob(id: string, draft: JobDraft): Promise<Job> {
  return send(`${JOBS_API_URL}/${encodeURIComponent(id)}`, "PUT", draft)
}
