import { FALLBACK, TOPICS } from '@/constants/chat'

/**
 * The chat backend. It runs entirely in the browser today - keyword matching
 * over a fixed topic list - but this module is the only thing `useChat` talks
 * to, so swapping in a real request means changing this file alone.
 */
function pickReply(input: string): string {
  const text = input.toLowerCase()
  let best: { reply: string; score: number } | null = null

  for (const topic of TOPICS) {
    let score = 0
    for (const keyword of topic.keywords) {
      if (text.includes(keyword)) score += keyword.length
    }
    if (score > 0 && (best === null || score > best.score)) {
      best = { reply: topic.reply, score }
    }
  }

  return best?.reply ?? FALLBACK
}

export async function fetchChatReply(input: string): Promise<string> {
  // A short delay so the thinking indicator is visible rather than flashing.
  await new Promise((resolve) => setTimeout(resolve, 300))
  return pickReply(input)
}
