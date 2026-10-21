import { useEffect, useRef, useState } from "react"
import { fetchChatReply } from "@/api/chat"
import type { ChatMessage, ChatPendingPhase } from "@/types/chat"
import type { MockUser } from "@/types/user"

export type ChatApi = {
  messages: ChatMessage[]
  pending: boolean
  phase: ChatPendingPhase
  send: (text: string) => void
  analyzeTasks: () => void
  cancel: () => void
  reset: () => void
}

export function useChat(user: MockUser): ChatApi {
  const [previousUser, setPreviousUser] = useState(user)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [phase, setPhase] = useState<ChatPendingPhase>(null)
  const request = useRef<AbortController | null>(null)
  const pendingMessage = useRef<string | null>(null)

  if (previousUser !== user) {
    setPreviousUser(user)
    setMessages([])
    setPhase(null)
  }

  useEffect(
    () => () => {
      request.current?.abort()
      request.current = null
      pendingMessage.current = null
    },
    [user],
  )

  const append = (message: ChatMessage) => setMessages((previous) => [...previous, message])

  const start = (raw: string, analyzeTasks = false) => {
    const text = raw.trim()
    if (text === "" || request.current !== null) return

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      analyzeTasks,
    }
    const next = [...messages, message]
    setMessages(next)
    setPhase(analyzeTasks ? "analysis" : "reply")

    const controller = new AbortController()
    request.current = controller
    pendingMessage.current = message.id

    void (async () => {
      try {
        // Error bubbles are our own messages, so exclude them from model history.
        const history = next.filter((item) => item.failed !== true)
        const content = await fetchChatReply(history, controller.signal, user)
        if (!controller.signal.aborted)
          append({ id: crypto.randomUUID(), role: "assistant", content })
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          append({
            id: crypto.randomUUID(),
            role: "assistant",
            content: error instanceof Error ? error.message : "The request failed.",
            failed: true,
          })
        }
      } finally {
        if (request.current === controller) {
          request.current = null
          pendingMessage.current = null
          setPhase(null)
        }
      }
    })()
  }

  return {
    messages,
    pending: phase !== null,
    phase,
    send: (text) => start(text),
    analyzeTasks: () => start("Analyze my tasks", true),
    cancel: () => {
      request.current?.abort()
      request.current = null
      const cancelledId = pendingMessage.current
      pendingMessage.current = null
      setMessages((previous) => previous.filter((message) => message.id !== cancelledId))
      setPhase(null)
    },
    reset: () => {
      request.current?.abort()
      request.current = null
      pendingMessage.current = null
      setMessages([])
      setPhase(null)
    },
  }
}
