import type { SeedTask } from "./task.js"
import type { MockUser } from "./user.js"

export type TaskCreateRequest = Omit<SeedTask, "offsetStart" | "span"> & {
  assignee: MockUser
  startDate: string
  dueDate: string
}
