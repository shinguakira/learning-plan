import { seedTasks } from "../constants/seedTasks.js";
import type { SeedTask } from "../types/task.js";

/** Supplies the sample plan; edits are kept in browser memory. */
export const taskService = {
  getTasks(): SeedTask[] {
    return seedTasks;
  },
};
