import type { FastifyInstance } from "fastify"

import { CSV_RESPONSE_SCHEMA } from "../constants/downloadSchema.js"
import { TASK_CSV_COLUMNS } from "../constants/taskCsv.js"
import { TASKS_SCHEMA } from "../constants/taskSchema.js"
import { taskService } from "../services/taskService.js"
import { serializeCsv } from "../utils/csv.js"

export default async function taskController(app: FastifyInstance): Promise<void> {
  app.get("/api/tasks", { schema: { response: { 200: TASKS_SCHEMA } } }, async () => ({
    tasks: taskService.getTasks(),
  }))

  app.get(
    "/api/tasks/csv",
    { schema: { response: { 200: CSV_RESPONSE_SCHEMA } } },
    async (_request, reply) => {
      const rows = [
        TASK_CSV_COLUMNS,
        ...taskService
          .getTasks()
          .map((task) => TASK_CSV_COLUMNS.map((column) => String(task[column]))),
      ]

      return reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header("Content-Disposition", 'attachment; filename="tasks.csv"')
        .send(serializeCsv(rows))
    },
  )
}
