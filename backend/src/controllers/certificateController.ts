import type { FastifyInstance, FastifyReply } from "fastify"

import {
  CERTIFICATE_CREATE_SCHEMA,
  CERTIFICATE_ID_SCHEMA,
  CERTIFICATE_UPDATE_SCHEMA,
} from "../constants/certificateSchema.js"
import { certificateService } from "../services/certificateService.js"
import type {
  CertificateCreateRequest,
  CertificateUpdateRequest,
} from "../types/certificateDraft.js"

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

  app.put<{ Params: { id: string }; Body: CertificateUpdateRequest }>(
    "/api/certificate/:id",
    { schema: { params: CERTIFICATE_ID_SCHEMA, body: CERTIFICATE_UPDATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { id } = request.params
      if ((await certificateService.getCertificate(id)) === null) {
        return reply.code(404).send({ message: "That certificate no longer exists." })
      }

      const certificate = await certificateService.updateCertificate(id, request.body)
      if (certificate === null) {
        return reply.code(409).send({ message: `${request.body.name} is already registered.` })
      }
      return reply.send(certificate)
    },
  )
}
