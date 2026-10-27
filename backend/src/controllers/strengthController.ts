import type { FastifyInstance, FastifyReply } from 'fastify'
import { StrengthCreateRequest } from '../types/strengthDraft.js'
import { strengthService } from '../services/strengthService.js'
import { STRENGTH_CREATE_SCHEMA } from '../constants/strengthSchema.js'

export default async function strengthController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: StrengthCreateRequest }>(
    '/api/strength',
    { schema: { body: STRENGTH_CREATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { user, name, description } = request.body
      console.log(description, user, name)
      const strength = await strengthService.addStrength(request.body)

      if (strength === null) {
        return reply.code(409).send({ message: `${user} already has ${name}.` })
      }
      return reply.code(201).send(strength)
    },
  )
}
