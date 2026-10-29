import { MOCK_USERS } from "./user.js"

const STRENGTH_FIELDS = {
  name: { type: "string", minLength: 1 },
  description: { type: "string", minLength: 1 },
} as const

export const STRENGTH_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "name", "description"],
  properties: {
    user: { type: "string", enum: MOCK_USERS },
    ...STRENGTH_FIELDS,
  },
} as const

export const STRENGTH_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const

export const STRENGTH_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "description"],
  properties: STRENGTH_FIELDS,
} as const
