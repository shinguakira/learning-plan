/**
 * A file download, not JSON. Declaring `content` rather than a bare schema is
 * what stops Fastify serialising the body through it.
 */
export const CSV_RESPONSE_SCHEMA = {
  content: { "text/csv": { schema: { type: "string" } } },
} as const

export const PDF_RESPONSE_SCHEMA = {
  content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
} as const
