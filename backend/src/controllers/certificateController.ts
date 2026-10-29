import type { FastifyInstance } from "fastify"
import { CERTIFICATE_CREATE_SCHEMA } from "../constants/certificateSchema.js"
import { certificateService } from "../services/certificateService.js"
import type { CertificateCreateRequest } from "../types/certificateDraft.js"

export default async function certificateController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: CertificateCreateRequest }>(
    "/api/certificate",
    { schema: { body: CERTIFICATE_CREATE_SCHEMA } },
    async (request, reply) => {
      const certificate = await certificateService.addCertificate(request.body)

      if (certificate === null) {
        return reply.code(409).send({
          message: `${request.body.user} already has ${request.body.name.trim()}.`,
        })
      }

      return reply.code(201).send(certificate)
    },
  )
}
