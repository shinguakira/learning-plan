import { MessageSquarePlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAutoScroll } from "@/hooks/useAutoScroll"
import { useChat } from "@/hooks/useChat"
import { useMockUser } from "@/hooks/useMockUser"
import { ChatBubble } from "@/pages/chat/ChatBubble"
import { ChatComposer } from "@/pages/chat/ChatComposer"
import { ChatEmpty } from "@/pages/chat/ChatEmpty"
import { ThinkingBubble } from "@/pages/chat/ThinkingBubble"

export function ChatPage() {
  const { user } = useMockUser()
  const { messages, pending, phase, send, analyzeTasks, cancel, reset } = useChat(user)
  const scrollRef = useAutoScroll<HTMLDivElement>([messages, pending])

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem-1px)] max-w-3xl flex-col px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div>
          <h1 className="text-lg font-semibold">AI chat</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Ask a question or review {user}'s tasks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={analyzeTasks}
          >
            <Sparkles />
            Analyze my tasks
          </Button>
          {pending && (
            <Button type="button" variant="outline" size="sm" onClick={cancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={messages.length === 0}
          >
            <MessageSquarePlus />
            New chat
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground pb-3 text-xs">
        Analysis reviews all tasks assigned to {user}. Unsaved edits on the Tasks page are not
        included. Switching users starts a new chat.
      </p>

      <div ref={scrollRef} className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && !pending ? (
          <ChatEmpty onPick={send} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {pending && (
              <ThinkingBubble
                label={phase === "analysis" ? "Analyzing your tasks…" : "Thinking…"}
              />
            )}
          </>
        )}
      </div>

      <div className="sticky bottom-0 pb-4">
        <ChatComposer pending={pending} onSend={send} />
      </div>
    </div>
  )
}
