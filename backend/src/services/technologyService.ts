import { technologyRepository } from "../repositories/technologyRepository.js"
import type { Technology } from "../types/technology.js"

export const technologyService = {
  async getTechnologies(): Promise<Technology[]> {
    const rows = await technologyRepository.findAll()
    return rows.map((row) => ({ id: row.id, name: row.name }))
  },
}
