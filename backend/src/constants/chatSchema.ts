export const CHAT_REPLY_SCHEMA = {
  type: "object",
  required: ["content"],
  properties: { content: { type: "string" } },
} as const

export const CHAT_REQUEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "messages"],
  properties: {
    analyzeTasks: { type: "boolean" },
    user: { $ref: "mockUser#" },
    messages: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "content"],
        properties: {
          role: { type: "string", enum: ["user", "assistant"] },
          content: { type: "string", minLength: 1 },
        },
      },
    },
  },
} as const
