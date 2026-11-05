/** The page posts what it is currently showing, including edits the backend never saw. */
export const PROFILE_PDF_REQUEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "profile"],
  properties: {
    user: { $ref: "mockUser#" },
    profile: { $ref: "profile#" },
  },
} as const
