import { MOCK_USERS } from "./user.js"

const CERTIFICATE_FIELDS = {
  name: { type: "string", minLength: 1, pattern: "\\S" },
  issuer: { type: "string", minLength: 1, pattern: "\\S" },
  dateEarned: { type: "string", format: "date" },
  credentialUrl: { type: "string", format: "uri", pattern: "^https?://" },
} as const

export const CERTIFICATE_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "name", "issuer", "dateEarned"],
  properties: {
    user: { type: "string", enum: MOCK_USERS },
    ...CERTIFICATE_FIELDS,
  },
} as const

export const CERTIFICATE_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const

export const CERTIFICATE_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "issuer", "dateEarned"],
  properties: CERTIFICATE_FIELDS,
} as const
