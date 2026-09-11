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
  // api.anthropic.com refuses browser origins unless the request opts in by
  // name. Sent only to that host, so every other endpoint sees the same
  // request it saw before.
  if (new URL(CHAT_API_URL).hostname === 'api.anthropic.com') {
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  const request = {
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
  }

  // fetch only rejects when the request never reached the endpoint at all, and
  // the browser gives the same opaque message whether the host is unreachable
  // or it refused this origin. Say which failure it is rather than repeat it.
  let response: Response
  try {
    response = await fetch(CHAT_API_URL, request)
  } catch (error) {
    if (signal.aborted) throw error
    throw new Error(
      `Could not reach ${new URL(CHAT_API_URL).origin}. The endpoint is unreachable, ` +
        'or it does not accept requests from a browser.',
    )
  }

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
