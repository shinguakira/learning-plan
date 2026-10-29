import { strengthRepository } from '../repositories/strengthRepository.js'
import type { Strength } from '../types/strength.js'
import type { MockUser } from '../types/user.js'
import { Prisma, type Strength as StrengthRow } from '@prisma/client'
import type {
  StrengthCreateRequest,
  StrengthUpdateRequest,
} from '../types/strengthDraft.js'

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

  async getStrength(id: string): Promise<Strength | null> {
    const row = await strengthRepository.findById(id)
    return row === null ? null : toStrength(row)
  },

  async addStrength(request: StrengthCreateRequest): Promise<Strength | null> {
    try {
      return toStrength(await strengthRepository.create(request))
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return null
      }
      throw error
    }
  },

  async updateStrength(
    id: string,
    request: StrengthUpdateRequest,
  ): Promise<Strength | null> {
    try {
      return toStrength(await strengthRepository.update(id, request))
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return null
      }
      throw error
    }
  },
}
