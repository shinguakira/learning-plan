/** One keyword-matched answer the chat backend can return. */
export interface Topic {
  readonly keywords: readonly string[]
  readonly reply: string
}
