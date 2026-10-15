import type { FastifyInstance, FastifyReply } from 'fastify'
import { jobService } from '../services/jobService.js'
import { skillService } from '../services/skillService.js'
import { certificateService } from '../services/certificateService.js'
import { strengthService } from '../services/strengthService.js'
import { profileService } from '../services/profileService.js'
import { profileToCsv } from '../utils/profileCsv.js'

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get('/api/profile', async () => ({
    skills: skillService.getSkills(),
    jobs: jobService.getJobs(),
    certificates: certificateService.getCertificates(),
    strengths: strengthService.getStrengths(),
  }))

  app.get('/api/profile/csv', async (_request, reply: FastifyReply) => {
    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="profile.csv"')
      .send(profileToCsv(profileService.getProfile()))
  })
}
