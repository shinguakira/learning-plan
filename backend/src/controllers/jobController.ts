import type { FastifyInstance } from "fastify"

import { JOB_CREATE_SCHEMA } from "../constants/jobSchema.js"
import { jobService } from "../services/jobService.js"
import type { JobCreateRequest } from "../types/jobDraft.js"

export default async function jobController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: JobCreateRequest }>(
    "/api/jobs",
    { schema: { body: JOB_CREATE_SCHEMA } },
    async (request, reply) => {
      const { startDate, endDate } = request.body
      if (endDate !== null && endDate < startDate) {
        return reply.code(400).send({ message: "End date must not precede the start date." })
      }
      return reply.code(201).send(await jobService.addJob(request.body))
    },
  )
}
