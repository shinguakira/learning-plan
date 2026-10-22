import type { FastifyInstance, FastifyReply } from 'fastify'
import { profileService } from '../services/profileService.js'
import { toCsv } from '../utils/csv.js'
import { MOCK_USERS } from '../constants/user.js'
import type { MockUser } from '../types/user.js'

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { user?: MockUser } }>('/api/profile', {
    schema: {
      querystring: {
        type: 'object',
        properties: { user: { type: 'string', enum: MOCK_USERS } },
      },
    },
  }, async (request) => profileService.getProfile(request.query.user))

  app.get('/api/profile/csv', async (_request, reply: FastifyReply) => {
    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="profile.csv"')
      .send(toCsv(profileService.getProfile()))
  })
}
