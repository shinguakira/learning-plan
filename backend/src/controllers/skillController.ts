import type { FastifyInstance, FastifyReply } from "fastify"

import {
  SKILL_CREATE_SCHEMA,
  SKILL_ID_SCHEMA,
  SKILL_UPDATE_SCHEMA,
} from "../constants/skillSchema.js"
import { skillService } from "../services/skillService.js"
import type { SkillCreateRequest, SkillUpdateRequest } from "../types/skillDraft.js"

export default async function skillController(app: FastifyInstance): Promise<void> {
  app.post<{ Body: SkillCreateRequest }>(
    "/api/skills",
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

  app.put<{ Params: { id: string }; Body: SkillUpdateRequest }>(
    "/api/skills/:id",
    { schema: { params: SKILL_ID_SCHEMA, body: SKILL_UPDATE_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { id } = request.params
      if ((await skillService.getSkill(id)) === null) {
        return reply.code(404).send({ message: "That skill no longer exists." })
      }

      const skill = await skillService.updateSkill(id, request.body)
      if (skill === null) {
        return reply.code(409).send({ message: `${request.body.name} is already registered.` })
      }
      return reply.send(skill)
    },
  )
}
