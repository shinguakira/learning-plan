export const EMPLOYMENT_TYPE_SCHEMA = {
  $id: "employmentType",
  type: "string",
  enum: ["full-time", "contract", "part-time", "internship"],
} as const

const JOB_FIELDS = {
  company: { type: "string", minLength: 1, pattern: "\\S" },
  title: { type: "string", minLength: 1, pattern: "\\S" },
  employmentType: { $ref: "employmentType#" },
  startDate: { type: "string", format: "date" },
  endDate: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
  summary: { type: "string" },
} as const

export const JOB_SCHEMA = {
  $id: "job",
  type: "object",
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
    id: { type: "string" },
    ...JOB_FIELDS,
    createdAt: { type: "string", format: "date-time" },
  },
} as const

export const JOB_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "company", "title", "employmentType", "startDate", "endDate", "summary"],
  properties: {
    user: { $ref: "mockUser#" },
    ...JOB_FIELDS,
  },
} as const

export const JOB_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["company", "title", "employmentType", "startDate", "endDate", "summary"],
  properties: JOB_FIELDS,
} as const

export const JOB_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const
