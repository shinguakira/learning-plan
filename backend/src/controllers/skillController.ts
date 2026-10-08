import type { FastifyInstance } from 'fastify'
import { skillService } from '../services/skillService.js'
import { certificateService } from '../services/certificateService.js'

/**
 * Owns /api/skills, which carries the skills and the certificates that back
 * them up. Job history has its own route; see jobController.
 */
export default async function skillController(app: FastifyInstance): Promise<void> {
  app.get('/api/skills', async () => ({
    skills: skillService.getSkills(),
    certificates: certificateService.getCertificates()
  }))
}
