/** One keyword-matched answer the chat backend can return. */
export type Topic = {
  readonly keywords: readonly string[]
  readonly reply: string
}
