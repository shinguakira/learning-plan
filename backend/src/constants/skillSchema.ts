import { MOCK_USERS } from './user.js'

export const SKILL_CREATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['user', 'name', 'level', 'yearsOfExperience'],
  properties: {
    user: { type: 'string', enum: MOCK_USERS },
    name: { type: 'string', minLength: 1 },
    level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
    yearsOfExperience: { type: 'integer', minimum: 0 },
  },
} as const
