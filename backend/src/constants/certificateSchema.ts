import { MOCK_USERS } from './user.js'

export const CERTIFICATE_CREATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['user', 'name', 'issuer', 'dateEarned'],
  properties: {
    user: { type: 'string', enum: MOCK_USERS },
    name: { type: 'string', minLength: 1, pattern: '\\S' },
    issuer: { type: 'string', minLength: 1, pattern: '\\S' },
    dateEarned: { type: 'string', format: 'date' },
    credentialUrl: { type: 'string', format: 'uri', pattern: '^https?://' },
  },
} as const
