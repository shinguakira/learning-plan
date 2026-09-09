import { FALLBACK, TOPICS } from '@/constants/chat'

/** Pick the topic whose keywords match the input most strongly. */
export function pickReply(input: string): string {
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
