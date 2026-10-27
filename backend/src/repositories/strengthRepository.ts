import type { Strength } from '@prisma/client'
import { StrengthCreateRequest } from '../types/strengthDraft.js'
import { prisma } from '../lib/prisma.js'

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

  create({ user, name, description }: StrengthCreateRequest): Promise<Strength> {
    return prisma.strength.create({
      data: {
        user: { connect: { name: user } },
        name,
        description
      },
    })
  },
}
