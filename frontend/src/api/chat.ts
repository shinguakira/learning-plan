import { CHAT_API_URL } from "@/constants/chat"
import type { ChatMessage, ChatReply } from "@/types/chat"
import type { MockUser } from "@/types/user"

export async function fetchChatReply(
  history: readonly ChatMessage[],
  signal: AbortSignal,
  user: MockUser,
): Promise<string> {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      messages: history.map(({ role, content, context }) => ({
        role,
        content: context ? `${content}\n\n${context}` : content,
      })),
    }),
    signal,
  }

  let response: Response
  try {
    response = await fetch(CHAT_API_URL, request)
  } catch (error) {
    if (signal.aborted) throw error
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  const body = (await response.json().catch(() => null)) as ChatReply | null

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  const text = body?.content
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("The API returned an empty reply.")
  }
  return text
}
