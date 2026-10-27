import { prisma } from '../lib/prisma.js'
import type { Strength } from '@prisma/client'
import type { StrengthCreateRequest } from '../types/strengthDraft.js'

export const strengthRepository = {
  create({ user, name, description }: StrengthCreateRequest): Promise<Strength> {
    return prisma.strength.create({
      data: { name, description, user: { connect: { name: user } } },
    })
  },

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
