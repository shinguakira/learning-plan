import { useEffect, useRef, useState } from "react"
import { fetchChatReply } from "@/api/chat"
import { useMockUser } from "@/hooks/useMockUser"
import type { ChatMessage } from "@/types/chat"

export type ChatApi = {
  messages: ChatMessage[]
  pending: boolean
  send: (text: string, context?: string) => void
  cancel: () => void
  reset: () => void
}

export function useChat(): ChatApi {
  const { user } = useMockUser()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const request = useRef<AbortController | null>(null)
  const pendingMessage = useRef<string | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  const append = (message: ChatMessage) => setMessages((previous) => [...previous, message])

  return {
    messages,
    pending,
    send: (raw, context) => {
      const text = raw.trim()
      if (text === "" || pending) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        ...(context ? { context } : {}),
      }
      const next = [...messages, message]
      setMessages(next)
      setPending(true)

      const controller = new AbortController()
      request.current = controller
      pendingMessage.current = message.id

      // A failed reply stays on screen but is our error text, not something the
      // model said, so it is kept out of the history the request carries.
      const history = next.filter((message) => message.failed !== true)

      void fetchChatReply(history, controller.signal, user)
        .then((content) => {
          if (controller.signal.aborted) return
          append({ id: crypto.randomUUID(), role: "assistant", content })
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return
          append({
            id: crypto.randomUUID(),
            role: "assistant",
            content: error instanceof Error ? error.message : "The request failed.",
            failed: true,
          })
        })
        .finally(() => {
          if (request.current === controller) {
            request.current = null
            pendingMessage.current = null
            setPending(false)
          }
        })
    },
    cancel: () => {
      request.current?.abort()
      request.current = null
      const cancelledId = pendingMessage.current
      pendingMessage.current = null
      setMessages((previous) => previous.filter((message) => message.id !== cancelledId))
      setPending(false)
    },
    reset: () => {
      request.current?.abort()
      request.current = null
      pendingMessage.current = null
      setMessages([])
      setPending(false)
    },
  }
}
