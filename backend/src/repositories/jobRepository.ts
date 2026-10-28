import { prisma } from '../lib/prisma.js'
import type { Job } from '@prisma/client'

export const jobRepository = {
  findByUserName(userName: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: { user: { name: userName } },
      orderBy: { startDate: 'desc' },
    })
  },

  findAll(): Promise<Job[]> {
    return prisma.job.findMany({ orderBy: { startDate: 'desc' } })
  },
}
