import type { FastifyInstance } from "fastify"

import { TECHNOLOGIES_SCHEMA } from "../constants/technologySchema.js"
import { technologyService } from "../services/technologyService.js"

export default async function technologyController(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/technologies",
    { schema: { response: { 200: TECHNOLOGIES_SCHEMA } } },
    async () => ({ technologies: await technologyService.getTechnologies() }),
  )
}
