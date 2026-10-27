import { prisma } from '../lib/prisma.js'
import type { Strength } from '@prisma/client'
import type { Skill } from '@prisma/client'
import { SkillCreateRequest } from '../types/skillDraft.js'

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

  create({ user, name, level, yearsOfExperience }: SkillCreateRequest): Promise<Skill> {
    return prisma.skill.create({
      data: {
        name,
        level,
        yearsOfExperience,
        user: { connect: { name: user } },
      },
    })
  },
}
