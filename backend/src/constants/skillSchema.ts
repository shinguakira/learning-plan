import { MOCK_USERS } from "./user.js"

const SKILL_FIELDS = {
  name: { type: "string", minLength: 1 },
  level: { type: "string", enum: ["beginner", "intermediate", "advanced", "expert"] },
  yearsOfExperience: { type: "integer", minimum: 0 },
} as const

export const SKILL_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "name", "level", "yearsOfExperience"],
  properties: {
    user: { type: "string", enum: MOCK_USERS },
    ...SKILL_FIELDS,
  },
} as const

export const SKILL_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "level", "yearsOfExperience"],
  properties: SKILL_FIELDS,
} as const

export const SKILL_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const

/**
 * What a skill route sends back. Fastify serialises through this, so every field
 * the client is typed against has to be listed here.
 */
export const SKILL_SCHEMA = {
  type: "object",
  required: ["id", "name", "level", "yearsOfExperience", "createdAt"],
  properties: {
    id: { type: "string" },
    ...SKILL_FIELDS,
    createdAt: { type: "string", format: "date-time" },
  },
} as const
