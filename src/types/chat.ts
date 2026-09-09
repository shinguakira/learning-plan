export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

/** One keyword-matched answer the chat bot can return. */
export type Topic = {
  readonly keywords: readonly string[]
  readonly reply: string
}
