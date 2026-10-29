import type { FastifyInstance } from "fastify"

import { JOB_CREATE_SCHEMA, JOB_ID_SCHEMA, JOB_UPDATE_SCHEMA } from "../constants/jobSchema.js"
import { jobService } from "../services/jobService.js"
import type { JobCreateRequest, JobUpdateRequest } from "../types/jobDraft.js"

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

  app.put<{ Params: { id: string }; Body: JobUpdateRequest }>(
    "/api/jobs/:id",
    { schema: { params: JOB_ID_SCHEMA, body: JOB_UPDATE_SCHEMA } },
    async (request, reply) => {
      const { startDate, endDate } = request.body
      if (endDate !== null && endDate < startDate) {
        return reply.code(400).send({ message: "End date must not precede the start date." })
      }

      const job = await jobService.updateJob(request.params.id, request.body)
      if (job === null) {
        return reply.code(404).send({ message: "That job no longer exists." })
      }
      return reply.send(job)
    },
  )
}
