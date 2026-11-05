export const PROFILE_SCHEMA = {
  $id: "profile",
  type: "object",
  required: ["skills", "strengths", "jobs", "certificates"],
  properties: {
    skills: { type: "array", items: { $ref: "skill#" } },
    strengths: { type: "array", items: { $ref: "strength#" } },
    jobs: { type: "array", items: { $ref: "job#" } },
    certificates: { type: "array", items: { $ref: "certificate#" } },
  },
} as const

export const PROFILE_QUERY_SCHEMA = {
  type: "object",
  properties: { user: { $ref: "mockUser#" } },
} as const
