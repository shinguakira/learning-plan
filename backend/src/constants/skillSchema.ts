import { MOCK_USERS } from "./user.js"

export const SKILL_LEVEL_SCHEMA = {
  $id: "skillLevel",
  type: "string",
  enum: ["beginner", "intermediate", "advanced", "expert"],
} as const

const SKILL_FIELDS = {
  name: { type: "string", minLength: 1 },
  level: { $ref: "skillLevel#" },
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

export const SKILL_SCHEMA = {
  type: "object",
  required: ["id", "name", "level", "yearsOfExperience", "createdAt"],
  properties: {
    id: { type: "string" },
    ...SKILL_FIELDS,
    createdAt: { type: "string", format: "date-time" },
  },
} as const
