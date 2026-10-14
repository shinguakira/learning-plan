import type { FastifyInstance, FastifyReply } from 'fastify'
import { jobService } from '../services/jobService.js'
import { skillService } from '../services/skillService.js'
import { certificateService } from '../services/certificateService.js'
import { strengthService } from '../services/strengthService.js'
import { toCsv } from '../utils/csv.js'

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get('/api/profile', async () => ({
    skills: skillService.getSkills(),
    jobs: jobService.getJobs(),
    certificates: certificateService.getCertificates(),
    strengths: strengthService.getStrengths(),
  }))

  // Named after /api/profile, same as the page it downloads from, even
  // though - unlike that endpoint - only the skills go into the file.
  app.get('/api/profile/csv', async (_request, reply: FastifyReply) => {
    const rows = [
      ['name', 'level', 'yearsOfExperience'],
      ...skillService.getSkills().map((skill) => [
        skill.name,
        skill.level,
        String(skill.yearsOfExperience),
      ]),
    ]

    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="profile.csv"')
      .send(toCsv(rows))
  })
}
