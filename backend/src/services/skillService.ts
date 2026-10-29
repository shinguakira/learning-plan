import type { Skill as SkillRow } from "@prisma/client"
import { Prisma } from "@prisma/client"

import { skillRepository } from "../repositories/skillRepository.js"
import type { Skill } from "../types/skill.js"
import type { SkillCreateRequest, SkillUpdateRequest } from "../types/skillDraft.js"
import type { MockUser } from "../types/user.js"

const toSkill = (row: SkillRow): Skill => ({
  id: row.id,
  name: row.name,
  level: row.level,
  yearsOfExperience: row.yearsOfExperience,
  createdAt: row.createdAt.toISOString(),
})

export const skillService = {
  async getSkills(): Promise<Skill[]> {
    return (await skillRepository.findAll()).map(toSkill)
  },

  async getSkillsByUser(user: MockUser): Promise<Skill[]> {
    return (await skillRepository.findByUserName(user)).map(toSkill)
  },

  async getSkill(id: string): Promise<Skill | null> {
    const row = await skillRepository.findById(id)
    return row === null ? null : toSkill(row)
  },

  async addSkill(request: SkillCreateRequest): Promise<Skill | null> {
    try {
      return toSkill(await skillRepository.create(request))
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return null
      }
      throw error
    }
  },

  async updateSkill(id: string, request: SkillUpdateRequest): Promise<Skill | null> {
    try {
      return toSkill(await skillRepository.update(id, request))
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return null
      }
      throw error
    }
  },
}
