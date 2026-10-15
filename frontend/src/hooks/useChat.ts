import { useEffect, useRef, useState } from "react"
import { fetchChatReply } from "@/api/chat"
import { fetchTasks } from "@/api/tasks"
import { useMockUser } from "@/hooks/useMockUser"
import { createSeedTasks } from "@/utils/seed"
import { createTaskAnalysisContext } from "@/utils/taskAnalysis"
import type { ChatMessage, ChatPendingPhase } from "@/types/chat"

export type ChatApi = {
  messages: ChatMessage[]
  pending: boolean
  phase: ChatPendingPhase
  send: (text: string) => void
  analyzeTasks: () => void
  cancel: () => void
  reset: () => void
}

export function useChat(): ChatApi {
  const { user } = useMockUser()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [phase, setPhase] = useState<ChatPendingPhase>(null)
  const request = useRef<AbortController | null>(null)
  const pendingMessage = useRef<string | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  const append = (message: ChatMessage) => setMessages((previous) => [...previous, message])

  const start = (raw: string, loadContext?: (signal: AbortSignal) => Promise<string>) => {
    const text = raw.trim()
    if (text === "" || request.current !== null) return

    const message: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    const next = [...messages, message]
    setMessages(next)
    setPhase(loadContext ? "tasks" : "reply")

    const controller = new AbortController()
    request.current = controller
    pendingMessage.current = message.id

    void (async () => {
      try {
        let prepared = next
        if (loadContext) {
          const context = await loadContext(controller.signal)
          if (controller.signal.aborted) return
          const withContext = { ...message, context }
          prepared = next.map((item) => (item.id === message.id ? withContext : item))
          setMessages((previous) =>
            previous.map((item) => (item.id === message.id ? withContext : item)),
          )
          setPhase("analysis")
        }

        // Error bubbles are our own messages, so exclude them from model history.
        const history = prepared.filter((item) => item.failed !== true)
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
    analyzeTasks: () =>
      start("Analyze my tasks", async (signal) => {
        const response = await fetchTasks(signal)
        if (response.tasks.length === 0)
          throw new Error("No tasks to analyze. The backend returned an empty plan.")
        return createTaskAnalysisContext(createSeedTasks(response.tasks))
      }),
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
