import type { Skill } from "@prisma/client"

import { prisma } from "../lib/prisma.js"
import type { SkillCreateRequest, SkillUpdateRequest } from "../types/skillDraft.js"

export const skillRepository = {
  findByUserName(userName: string): Promise<Skill[]> {
    return prisma.skill.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: "asc" },
    })
  },

  findAll(): Promise<Skill[]> {
    return prisma.skill.findMany({ orderBy: { createdAt: "asc" } })
  },

  findById(id: string): Promise<Skill | null> {
    return prisma.skill.findUnique({ where: { id } })
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

  update(id: string, { name, level, yearsOfExperience }: SkillUpdateRequest): Promise<Skill> {
    return prisma.skill.update({
      where: { id },
      data: { name, level, yearsOfExperience },
    })
  },
}
