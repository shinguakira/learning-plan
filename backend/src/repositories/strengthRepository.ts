import { prisma } from '../lib/prisma.js'
import type { Strength } from '@prisma/client'

export const strengthRepository = {
  findByUserName(userName: string): Promise<Strength[]> {
    return prisma.strength.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: 'asc' },
    })
  },

  findAll(): Promise<Strength[]> {
    return prisma.strength.findMany({ orderBy: { createdAt: 'asc' } })
  },
}
