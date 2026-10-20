import type { SeedTask } from "@/types/task"
import { TASKS_CSV_API_URL } from "@/constants/task"

export async function fetchTasks(signal?: AbortSignal): Promise<{ tasks: SeedTask[] }> {
  let response: Response
  try {
    response = await fetch("/api/tasks", { signal })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as { tasks: SeedTask[] }
}

/** Downloads backend sample tasks, independently of page edits and filters. */
export async function downloadTasksCsv(): Promise<void> {
  let response: Response
  try {
    response = await fetch(TASKS_CSV_API_URL)
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
    link.download = "tasks.csv"
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}
