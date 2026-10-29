import { MOCK_USERS } from "./user.js"

const text = { type: "string" } as const

const skill = {
  type: "object",
  additionalProperties: false,
  required: ["id", "name", "level", "yearsOfExperience", "createdAt"],
  properties: {
    id: text,
    name: text,
    level: { type: "string", enum: ["beginner", "intermediate", "advanced", "expert"] },
    yearsOfExperience: { type: "number" },
    createdAt: text,
  },
} as const

const strength = {
  type: "object",
  additionalProperties: false,
  required: ["id", "name", "description", "createdAt"],
  properties: { id: text, name: text, description: text, createdAt: text },
} as const

const job = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "company",
    "title",
    "employmentType",
    "startDate",
    "endDate",
    "summary",
    "createdAt",
  ],
  properties: {
    id: text,
    company: text,
    title: text,
    employmentType: {
      type: "string",
      enum: ["full-time", "contract", "part-time", "internship"],
    },
    startDate: text,
    endDate: { type: ["string", "null"] },
    summary: text,
    createdAt: text,
  },
} as const

const certificate = {
  type: "object",
  additionalProperties: false,
  required: ["id", "name", "issuer", "dateEarned", "createdAt"],
  properties: {
    id: text,
    name: text,
    issuer: text,
    dateEarned: text,
    credentialUrl: text,
    createdAt: text,
  },
} as const

/** The page posts what it is currently showing, including edits the backend never saw. */
export const PROFILE_PDF_REQUEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "profile"],
  properties: {
    user: { type: "string", enum: MOCK_USERS },
    profile: {
      type: "object",
      additionalProperties: false,
      required: ["skills", "strengths", "jobs", "certificates"],
      properties: {
        skills: { type: "array", items: skill },
        strengths: { type: "array", items: strength },
        jobs: { type: "array", items: job },
        certificates: { type: "array", items: certificate },
      },
    },
  },
} as const
