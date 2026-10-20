import { CHAT_MAX_CONTENT_LENGTH, CHAT_MAX_MESSAGES } from "./chat.js";

export const CHAT_REQUEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["user", "messages"],
  properties: {
    user: { type: "string", enum: ["Sanjar", "Akira", "Mike", "John"] },
    messages: {
      type: "array",
      minItems: 1,
      maxItems: CHAT_MAX_MESSAGES,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "content"],
        properties: {
          role: { type: "string", enum: ["user", "assistant"] },
          content: {
            type: "string",
            minLength: 1,
            maxLength: CHAT_MAX_CONTENT_LENGTH,
          },
        },
      },
    },
  },
} as const;
