import { CHAT_API_KEY, CHAT_API_URL, CHAT_MODEL, CHAT_SYSTEM_PROMPT } from '@/constants/chat'
import type { ChatMessage } from '@/types/chat'

/**
 * Chat completions over plain fetch, called straight from the browser.
 *
 * The request body is the OpenAI-style `/chat/completions` shape, which most
 * providers and local runtimes speak, so the endpoint and model come entirely
 * from .env - nothing here is tied to a vendor.
 */
type ChatCompletion = {
  choices?: { message?: { content?: string } }[]
  error?: { message?: string }
}

export async function fetchChatReply(
  history: readonly ChatMessage[],
  signal: AbortSignal,
): Promise<string> {
  if (CHAT_API_URL === '' || CHAT_MODEL === '') {
    throw new Error('Set VITE_CHAT_API_URL and VITE_CHAT_MODEL in .env to use the chat.')
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  // A local runtime often needs no key at all.
  if (CHAT_API_KEY !== '') headers.Authorization = `Bearer ${CHAT_API_KEY}`

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...history.map(({ role, content }) => ({ role, content })),
      ],
    }),
    signal,
  })

  const body = (await response.json().catch(() => null)) as ChatCompletion | null

  if (!response.ok) {
    throw new Error(body?.error?.message ?? `Request failed (${response.status})`)
  }

  const text = body?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('The API returned an empty reply.')
  }
  return text
}
