export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  /** Extra task context sent to the model, kept out of the visible bubble. */
  context?: string
  /** The request failed; rendered in the error style. */
  failed?: boolean
}
