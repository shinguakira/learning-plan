import type { SeedTask } from '@/types/task'

export async function fetchTasks(signal?: AbortSignal): Promise<{ tasks: SeedTask[] }> {
  let response: Response
  try {
    response = await fetch('/api/tasks', { signal })
  } catch (error) {
    throw new Error('Could not reach the backend. Is it running?', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as { tasks: SeedTask[] }
}
