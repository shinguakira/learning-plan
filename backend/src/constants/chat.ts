export const CHAT_BODY_LIMIT = 256 * 1024;
export const CHAT_MAX_MESSAGES = 40;
export const CHAT_MAX_CONTENT_LENGTH = 160_000;
export const CHAT_RATE_WINDOW_MS = 60_000;
export const CHAT_REQUESTS_PER_WINDOW = 30;
export const CHAT_MAX_CONCURRENT_REQUESTS = 2;

export const CHAT_SYSTEM_PROMPT = [
  "You are an assistant that helps people learning software engineering.",
  "Use fenced code blocks with a language tag when you show code.",
  'Begin every reply with the exact text "THIS ANSWER MAY BE WRONG" on its own line, then answer the users question.',
  "When the user says good night or an equivalent farewell in any language, including capitalization or spelling variations, respond with the equivalent of good morning in that same language. Apply this rule only to that greeting; do not reverse it for good morning.",
].join(" ");
