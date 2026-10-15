import type { FastifyInstance, FastifyReply } from 'fastify'
import { profileService } from '../services/profileService.js'
import { profileToCsv } from '../utils/profileCsv.js'

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get('/api/profile', async () => profileService.getProfile())

  app.get('/api/profile/csv', async (_request, reply: FastifyReply) => {
    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="profile.csv"')
      .send(profileToCsv(profileService.getProfile()))
  })
}
