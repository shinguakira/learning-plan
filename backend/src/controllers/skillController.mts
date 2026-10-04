import type { FastifyInstance } from 'fastify'
import { skillService } from '../services/skillService.mjs'

/** Owns /api/skills: declares its own route and translates HTTP to skillService. */
export default async function skillController(app: FastifyInstance): Promise<void> {
  app.get('/api/skills', async () => skillService.getSkills())
}
