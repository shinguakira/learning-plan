import type { FastifyInstance } from "fastify"
import { taskService } from "../services/taskService.js"
import { serializeCsv } from "../utils/csv.js"
import { TASK_CSV_COLUMNS } from "../constants/taskCsv.js"

export default async function taskController(app: FastifyInstance): Promise<void> {
  app.get("/api/tasks", async () => ({ tasks: taskService.getTasks() }))

  app.get("/api/tasks/csv", async (_request, reply) => {
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
  })
}
