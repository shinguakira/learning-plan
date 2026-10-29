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
