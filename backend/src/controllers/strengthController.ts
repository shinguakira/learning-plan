import type { FastifyInstance, FastifyReply } from 'fastify'
import { STRENGTH_CREATE_SCHEMA } from '../constants/strengthSchema.js'
import { strengthService } from '../services/strengthService.js'
import type { StrengthCreateRequest } from '../types/strengthDraft.js'

export default async function strengthController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: StrengthCreateRequest }>(
    '/api/strengths',
    { schema: { body: STRENGTH_CREATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const strength = await strengthService.addStrength(request.body)

      if (strength === null) {
        return reply.code(409).send({
          message: `${request.body.user} already has ${request.body.name}.`,
        })
      }
      return reply.code(201).send(strength)
    },
  )
}
