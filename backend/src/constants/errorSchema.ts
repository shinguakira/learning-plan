/** Every failure body a controller sends: the message the UI shows. */
export const ERROR_SCHEMA = {
  $id: "error",
  type: "object",
  required: ["message"],
  properties: { message: { type: "string" } },
} as const
