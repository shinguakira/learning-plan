import { strengthRepository } from '../repositories/strengthRepository.js'
import type { Strength } from '../types/strength.js'
import type { MockUser } from '../types/user.js'
import type { Strength as StrengthRow } from '@prisma/client'

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
}
