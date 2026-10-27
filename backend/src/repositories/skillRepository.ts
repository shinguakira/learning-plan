import { prisma } from '../lib/prisma.js'
import type { Skill } from '@prisma/client'
import type { SkillCreateRequest } from '../types/skillDraft.js'

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
