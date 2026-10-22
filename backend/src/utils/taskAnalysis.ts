import { MOCK_USERS } from "../constants/user.js";
import { taskService } from "../services/taskService.js";
import type { MockUser } from "../types/user.js";

/** Match the frontend sample dates and assignment rotation without sending tasks to the browser. */
export function createTaskAnalysisContext(user: MockUser): string | null {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const dateAtOffset = (offset: number): string => {
    const date = new Date(base);
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const tasks = taskService.getTasks().flatMap((task, index) => {
    if (MOCK_USERS[index % MOCK_USERS.length] !== user) return [];
    const { offsetStart, span, ...details } = task;
    return [
      {
        ...details,
        startDate: dateAtOffset(offsetStart),
        dueDate: dateAtOffset(offsetStart + span),
      },
    ];
  });
  if (tasks.length === 0) return null;
  return `Learning plan data:\n${JSON.stringify({ today: dateAtOffset(0), tasks })}`;
}
