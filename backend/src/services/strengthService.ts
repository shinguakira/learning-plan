import { seedStrengths } from '../constants/seedStrengths.js'
import type { Strength } from '../types/strength.js'

export const strengthService = {
  getStrengths(): Strength[] {
    return seedStrengths
  },
}
