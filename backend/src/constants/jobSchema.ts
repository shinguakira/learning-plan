import { MOCK_USERS } from "./user.js"

export const JOB_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "company", "title", "employmentType", "startDate", "endDate", "summary"],
  properties: {
    user: { type: "string", enum: MOCK_USERS },
    company: { type: "string", minLength: 1, pattern: "\\S" },
    title: { type: "string", minLength: 1, pattern: "\\S" },
    employmentType: { type: "string", enum: ["full-time", "contract", "part-time", "internship"] },
    startDate: { type: "string", format: "date" },
    endDate: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
    summary: { type: "string" },
  },
} as const
