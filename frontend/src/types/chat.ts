export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  /** The request failed; rendered in the error style. */
  failed?: boolean
}
