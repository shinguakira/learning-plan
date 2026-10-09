import type { FastifyInstance } from "fastify";
import { taskService } from "../services/taskService.js";

export default async function taskController(
  app: FastifyInstance,
): Promise<void> {
  app.get("/api/tasks", async () => ({ tasks: taskService.getTasks() }));
}
