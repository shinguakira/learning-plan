import { prisma } from '../lib/prisma.js'
import type { Skill } from '@prisma/client'

export const skillRepository = {
  findByUserName(userName: string): Promise<Skill[]> {
    return prisma.skill.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: 'asc' },
    })
  },

  findAll(): Promise<Skill[]> {
    return prisma.skill.findMany({ orderBy: { createdAt: 'asc' } })
  },
}
