import type { FastifyInstance } from "fastify"

import { technologyService } from "../services/technologyService.js"

export default async function technologyController(app: FastifyInstance): Promise<void> {
  app.get("/api/technologies", async () => ({
    technologies: await technologyService.getTechnologies(),
  }))
}
