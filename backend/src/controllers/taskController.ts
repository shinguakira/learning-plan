import type { FastifyInstance } from "fastify"

import { CSV_RESPONSE_SCHEMA } from "../constants/downloadSchema.js"
import { TASK_CSV_COLUMNS } from "../constants/taskCsv.js"
import { TASK_CREATE_SCHEMA, TASKS_SCHEMA } from "../constants/taskSchema.js"
import { taskService } from "../services/taskService.js"
import type { TaskCreateRequest } from "../types/taskDraft.js"
import { serializeCsv } from "../utils/csv.js"

export default async function taskController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: TaskCreateRequest }>(
    "/api/tasks",
    { schema: { body: TASK_CREATE_SCHEMA } },
    async ({ body }, reply) => {
      if (body.dueDate < body.startDate) {
        return reply.code(400).send({ message: "Due date must not precede the start date." })
      }

      return reply.code(201).send(await taskService.addTask(body))
    },
  )

  app.get("/api/tasks", { schema: { response: { 200: TASKS_SCHEMA } } }, async () => ({
    tasks: await taskService.getTasks(),
  }))

  app.get(
    "/api/tasks/csv",
    { schema: { response: { 200: CSV_RESPONSE_SCHEMA } } },
    async (_request, reply) => {
      const tasks = await taskService.getTasks()
      const rows = [
        TASK_CSV_COLUMNS,
        ...tasks.map((task) => TASK_CSV_COLUMNS.map((column) => String(task[column]))),
      ]

      return reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header("Content-Disposition", 'attachment; filename="tasks.csv"')
        .send(serializeCsv(rows))
    },
  )
}
