import type { Strength } from "@prisma/client"
import type { StrengthCreateRequest, StrengthUpdateRequest } from "../types/strengthDraft.js"
import { prisma } from "../lib/prisma.js"

export const strengthRepository = {
  findByUserName(userName: string): Promise<Strength[]> {
    return prisma.strength.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: "asc" },
    })
  },

  findAll(): Promise<Strength[]> {
    return prisma.strength.findMany({ orderBy: { createdAt: "asc" } })
  },

  findById(id: string): Promise<Strength | null> {
    return prisma.strength.findUnique({ where: { id } })
  },

  create({ user, name, description }: StrengthCreateRequest): Promise<Strength> {
    return prisma.strength.create({
      data: {
        user: { connect: { name: user } },
        name,
        description,
      },
    })
  },

  update(id: string, { name, description }: StrengthUpdateRequest): Promise<Strength> {
    return prisma.strength.update({
      where: { id },
      data: { name, description },
    })
  },
}
