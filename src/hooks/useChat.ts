import { useEffect, useRef, useState } from 'react'
import { REPLY_DELAY_MS } from '@/constants/chat'
import { pickReply } from '@/utils/chat'
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelPending = () => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
  }

  useEffect(() => cancelPending, [])

  return {
    messages,
    pending,
    send: (raw) => {
      const text = raw.trim()
      if (text === '' || pending) return

      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: 'user', content: text },
      ])
      setPending(true)

      // Nothing is loading - `pickReply` is synchronous. The pause exists only
      // so the typing indicator is visible instead of flashing.
      timer.current = setTimeout(() => {
        timer.current = null
        setMessages((previous) => [
          ...previous,
          { id: crypto.randomUUID(), role: 'assistant', content: pickReply(text) },
        ])
        setPending(false)
      }, REPLY_DELAY_MS)
    },
    reset: () => {
      cancelPending()
      setMessages([])
      setPending(false)
    },
  }
}
