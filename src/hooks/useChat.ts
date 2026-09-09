import { useEffect, useRef, useState } from 'react'
import { fetchChatReply } from '@/api/chat'
import type { ChatMessage } from '@/types/chat'

export interface ChatApi {
  messages: ChatMessage[]
  pending: boolean
  send: (text: string) => void
  reset: () => void
}

export function useChat(): ChatApi {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState(false)
  // Bumped on reset and on unmount so a reply in flight is discarded.
  const generation = useRef(0)

  useEffect(() => () => void (generation.current += 1), [])

  return {
    messages,
    pending,
    send: (raw) => {
      const text = raw.trim()
      if (text === '' || pending) return

      const current = generation.current
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: 'user', content: text },
      ])
      setPending(true)

      void fetchChatReply(text).then((reply) => {
        if (generation.current !== current) return
        setMessages((previous) => [
          ...previous,
          { id: crypto.randomUUID(), role: 'assistant', content: reply },
        ])
        setPending(false)
      })
    },
    reset: () => {
      generation.current += 1
      setMessages([])
      setPending(false)
    },
  }
}
