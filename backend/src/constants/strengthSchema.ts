const STRENGTH_FIELDS = {
  name: { type: "string", minLength: 1 },
  description: { type: "string", minLength: 1 },
} as const

export const STRENGTH_SCHEMA = {
  $id: "strength",
  type: "object",
  required: ["id", "name", "description", "createdAt"],
  properties: {
    id: { type: "string" },
    ...STRENGTH_FIELDS,
    createdAt: { type: "string", format: "date-time" },
  },
} as const

export const STRENGTH_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "name", "description"],
  properties: {
    user: { $ref: "mockUser#" },
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
