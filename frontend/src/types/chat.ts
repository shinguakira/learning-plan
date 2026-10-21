export type ChatRole = "user" | "assistant"
export type ChatPendingPhase = "analysis" | "reply" | null

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  /** Requests backend task context for this conversation. */
  analyzeTasks?: boolean
  /** The request failed; rendered in the error style. */
  failed?: boolean
}

/** Public backend response; provider payloads stay on the server. */
export type ChatReply = {
  content?: string
  message?: string
}
