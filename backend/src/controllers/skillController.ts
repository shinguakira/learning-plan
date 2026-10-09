import type { FastifyInstance } from 'fastify'
import { jobService } from '../services/jobService.js'
import { skillService } from '../services/skillService.js'
import { certificateService } from '../services/certificateService.js'

/**
 * Owns /api/skills, which carries the whole profile - skills and job history.
 * The name is deliberately kept: one request serves the page, and the route is
 * not renamed just because it grew a second list.
 */
export default async function skillController(app: FastifyInstance): Promise<void> {
  app.get('/api/skills', async () => ({
    skills: skillService.getSkills(),
    jobs: jobService.getJobs(),
    certificates: certificateService.getCertificates()
  }))
}
