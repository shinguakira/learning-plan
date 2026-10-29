export const JOB_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["company", "title", "employmentType", "startDate", "endDate", "summary"],
  properties: {
    company: { type: "string", minLength: 1, pattern: "\\S" },
    title: { type: "string", minLength: 1, pattern: "\\S" },
    employmentType: { type: "string", enum: ["full-time", "contract", "part-time", "internship"] },
    startDate: { type: "string", format: "date" },
    endDate: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
    summary: { type: "string" },
  },
} as const

export const JOB_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const
