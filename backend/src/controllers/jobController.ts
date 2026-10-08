import type { FastifyInstance } from 'fastify'
import { jobService } from '../services/jobService.js'

/** Owns /api/jobs: the work history shown on the profile page. */
export default async function jobController(app: FastifyInstance): Promise<void> {
  app.get('/api/jobs', async () => ({
    jobs: jobService.getJobs()
  }))
}
