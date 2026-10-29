import type { Job } from "./job.js"
import type { MockUser } from "./user.js"

export type JobCreateRequest = Omit<Job, "id" | "createdAt"> & { user: MockUser }
