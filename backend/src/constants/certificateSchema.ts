const CERTIFICATE_FIELDS = {
  name: { type: "string", minLength: 1, pattern: "\\S" },
  issuer: { type: "string", minLength: 1, pattern: "\\S" },
  dateEarned: { type: "string", format: "date" },
  credentialUrl: { type: "string", format: "uri", pattern: "^https?://" },
} as const

export const CERTIFICATE_SCHEMA = {
  $id: "certificate",
  type: "object",
  required: ["id", "name", "issuer", "dateEarned", "createdAt"],
  properties: {
    id: { type: "string" },
    ...CERTIFICATE_FIELDS,
    createdAt: { type: "string", format: "date-time" },
  },
} as const

export const CERTIFICATE_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "name", "issuer", "dateEarned"],
  properties: {
    user: { $ref: "mockUser#" },
    ...CERTIFICATE_FIELDS,
  },
} as const

export const CERTIFICATE_ID_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
} as const

export const CERTIFICATE_UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "issuer", "dateEarned"],
  properties: CERTIFICATE_FIELDS,
} as const
