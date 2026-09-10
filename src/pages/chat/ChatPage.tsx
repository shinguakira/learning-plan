import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from '@/pages/chat/ChatBubble'
import { ChatComposer } from '@/pages/chat/ChatComposer'
import { ChatEmpty } from '@/pages/chat/ChatEmpty'
import { ThinkingBubble } from '@/pages/chat/ThinkingBubble'

export function ChatPage() {
  const { messages, pending, send, reset } = useChat()
  const scrollRef = useAutoScroll<HTMLDivElement>([messages, pending])

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 py-4">
        <div>
          <h1 className="text-lg font-semibold">AI chat</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            A standalone chatbot, independent of your tasks.
          </p>
        </div>
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

      <div ref={scrollRef} className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && !pending ? (
          <ChatEmpty onPick={send} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {pending && <ThinkingBubble />}
          </>
        )}
      </div>

      <div className="sticky bottom-0 pb-4">
        <ChatComposer pending={pending} onSend={send} />
      </div>
    </div>
  )
}
