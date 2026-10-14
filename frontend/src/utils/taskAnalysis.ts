import { TASK_ANALYSIS_PROMPT } from "@/constants/taskAnalysis"
import type { Task } from "@/types/task"
import { today } from "@/utils/date"

export function createTaskAnalysisContext(tasks: readonly Task[]): string {
  const plan = {
    today: today(),
    tasks: tasks.map(
      ({ title, category, status, priority, startDate, dueDate, estimatedHours, note }) => ({
        title,
        category,
        status,
        priority,
        startDate,
        dueDate,
        estimatedHours,
        note,
      }),
    ),
  }
  return `${TASK_ANALYSIS_PROMPT}\n\nLearning plan data:\n${JSON.stringify(plan)}`
}
