import type { FastifyInstance, FastifyReply } from 'fastify'
import type {
  StrengthCreateRequest,
  StrengthUpdateRequest,
} from '../types/strengthDraft.js'
import { strengthService } from '../services/strengthService.js'
import {
  STRENGTH_CREATE_SCHEMA,
  STRENGTH_ID_SCHEMA,
  STRENGTH_UPDATE_SCHEMA,
} from '../constants/strengthSchema.js'

export default async function strengthController(
  app: FastifyInstance,
): Promise<void> {
  app.post<{ Body: StrengthCreateRequest }>(
    '/api/strength',
    { schema: { body: STRENGTH_CREATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { user, name } = request.body
      const strength = await strengthService.addStrength(request.body)

      if (strength === null) {
        return reply.code(409).send({ message: `${user} already has ${name}.` })
      }
      return reply.code(201).send(strength)
    },
  )

  app.put<{ Params: { id: string }; Body: StrengthUpdateRequest }>(
    '/api/strength/:id',
    { schema: { params: STRENGTH_ID_SCHEMA, body: STRENGTH_UPDATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { id } = request.params
      if ((await strengthService.getStrength(id)) === null) {
        return reply
          .code(404)
          .send({ message: 'That strength no longer exists.' })
      }

      const strength = await strengthService.updateStrength(id, request.body)
      if (strength === null) {
        return reply
          .code(409)
          .send({ message: `${request.body.name} is already registered.` })
      }
      return reply.send(strength)
    },
  )
}
