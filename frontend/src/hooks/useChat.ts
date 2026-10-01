import { useEffect, useRef, useState } from 'react'
import { fetchChatReply } from '@/api/chat'
import type { ChatMessage } from '@/types/chat'

export type ChatApi = {
  messages: ChatMessage[]
  pending: boolean
  send: (text: string) => void
  reset: () => void
}

export function useChat(): ChatApi {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const request = useRef<AbortController | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  const append = (message: ChatMessage) => setMessages((previous) => [...previous, message])

  return {
    messages,
    pending,
    send: (raw) => {
      const text = raw.trim()
      if (text === '' || pending) return

      const next = [...messages, { id: crypto.randomUUID(), role: 'user' as const, content: text }]
      setMessages(next)
      setPending(true)

      const controller = new AbortController()
      request.current = controller

      // A failed reply stays on screen but is our error text, not something the
      // model said, so it is kept out of the history the request carries.
      const history = next.filter((message) => message.failed !== true)

      void fetchChatReply(history, controller.signal)
        .then((content) => {
          if (controller.signal.aborted) return
          append({ id: crypto.randomUUID(), role: 'assistant', content })
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return
          append({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: error instanceof Error ? error.message : 'The request failed.',
            failed: true,
          })
        })
        .finally(() => {
          if (request.current === controller) request.current = null
          setPending(false)
        })
    },
    reset: () => {
      request.current?.abort()
      request.current = null
      setMessages([])
      setPending(false)
    },
  }
}
