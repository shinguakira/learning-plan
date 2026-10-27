import type { FastifyInstance, FastifyReply } from 'fastify'
import { SKILL_CREATE_SCHEMA } from '../constants/skillSchema.js'
import { skillService } from '../services/skillService.js'
import type { SkillCreateRequest } from '../types/skillDraft.js'

export default async function skillController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: SkillCreateRequest }>(
    '/api/skills',
    { schema: { body: SKILL_CREATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { user, name } = request.body
      const skill = await skillService.addSkill(request.body)

      if (skill === null) {
        return reply.code(409).send({ message: `${user} already has ${name}.` })
      }
      return reply.code(201).send(skill)
    },
  )
}
