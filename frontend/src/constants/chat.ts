export const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL ?? ''
export const CHAT_API_KEY = import.meta.env.VITE_CHAT_API_KEY ?? ''
export const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL ?? ''

export const CHAT_SYSTEM_PROMPT = [
  'You are an assistant that helps people learning software engineering.',
  'Answer concisely and lead with the point. Skip preambles.',
  'Use fenced code blocks with a language tag when you show code.',
].join(' ')

/** Prompts offered on the empty chat screen. */
export const SUGGESTIONS = [
  'How should I learn React?',
  'Why is my SQL index not being used?',
  'How do I shrink a Docker image?',
  'I keep losing momentum studying',
] as const
