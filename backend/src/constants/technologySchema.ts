export const TECHNOLOGY_SCHEMA = {
  $id: "technology",
  type: "object",
  required: ["id", "name"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
} as const

export const TECHNOLOGIES_SCHEMA = {
  type: "object",
  required: ["technologies"],
  properties: { technologies: { type: "array", items: { $ref: "technology#" } } },
} as const
