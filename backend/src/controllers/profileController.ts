import type { FastifyInstance } from 'fastify'
import { jobService } from '../services/jobService.js'
import { skillService } from '../services/skillService.js'
import { certificateService } from '../services/certificateService.js'
import { strengthService } from '../services/strengthService.js'

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get('/api/profile', async () => ({
    skills: skillService.getSkills(),
    jobs: jobService.getJobs(),
    certificates: certificateService.getCertificates(),
    strengths: strengthService.getStrengths(),
  }))
}
