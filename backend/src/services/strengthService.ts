import { strengthRepository } from '../repositories/strengthRepository.js'
import type { Strength } from '../types/strength.js'
import type { MockUser } from '../types/user.js'
import { Prisma, Skill, type Strength as StrengthRow } from '@prisma/client'
import { skillRepository } from '../repositories/skillRepository.js'
import { SkillCreateRequest } from '../types/skillDraft.js'

const toStrength = (row: StrengthRow): Strength => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.createdAt.toISOString(),
})

export const strengthService = {
  async getStrengths(): Promise<Strength[]> {
    return (await strengthRepository.findAll()).map(toStrength)
  },

  async getStrengthsByUser(user: MockUser): Promise<Strength[]> {
    return (await strengthRepository.findByUserName(user)).map(toStrength)
  },

  async addSkill(request: strengthRepository): Promise<Skill | null> {
    try {
      return toSkill(await strengthRepository.create(request))
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return null
      }
      throw error
    }
  },
}
