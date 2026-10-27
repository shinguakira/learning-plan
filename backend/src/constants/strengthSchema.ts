import { MOCK_USERS } from './user.js'

export const STRENGTH_CREATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['user', 'name', 'description'],
  properties: {
    user: { type: 'string', enum: MOCK_USERS },
    name: { type: 'string', minLength: 1, pattern: '\\S' },
    description: { type: 'string', minLength: 1, pattern: '\\S' },
  },
} as const
