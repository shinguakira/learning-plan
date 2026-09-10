import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUp, Bot, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SUGGESTIONS } from '@/constants/chat'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { Markdown } from '@/pages/chat/Markdown'
import type { ChatMessage } from '@/types/chat'

function AssistantAvatar() {
  return (
    <div className="bg-primary text-primary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
      <Bot className="size-4" />
    </div>
  )
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="animate-fade-rise flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-rise flex gap-3">
      <AssistantAvatar />
      <div
        className={cn(
          'max-w-[80%] space-y-1 rounded-2xl rounded-tl-md border px-4 py-2.5 text-sm leading-relaxed',
          message.failed
            ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : 'bg-card text-card-foreground',
        )}
      >
        <Markdown text={message.content} />
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="animate-fade-rise flex gap-3">
      <AssistantAvatar />
      <div className="bg-card flex items-center gap-1 rounded-2xl rounded-tl-md border px-4 py-3.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="bg-muted-foreground/40 size-1.5 animate-bounce rounded-full"
            style={{ animationDelay: `${dot * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export function ChatPage() {
  const { messages, pending, send, reset } = useChat()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Stick to the bottom whenever the conversation grows.
  useLayoutEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, pending])

  const submit = () => {
    if (draft.trim() === '' || pending) return
    send(draft)
    setDraft('')
  }

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
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div>
              <p className="text-sm font-medium">What do you want to work out?</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Ask about learning software engineering, or start from a prompt below.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => send(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {pending && <ThinkingBubble />}
          </>
        )}
      </div>

      <div className="sticky bottom-0 pb-4">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
          className="bg-card focus-within:border-ring focus-within:ring-ring/50 flex items-end gap-2 rounded-2xl border p-2 transition focus-within:ring-3"
        >
          <Textarea
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                submit()
              }
            }}
            placeholder="Send a message (Enter to send, Shift + Enter for a new line)"
            aria-label="Message"
            // field-sizing-content on the shadcn Textarea grows it natively, so there is
            // no manual height effect here - only a floor and a ceiling.
            className="max-h-44 min-h-9 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            disabled={draft.trim() === '' || pending}
            aria-label="Send"
            title="Send"
            className="rounded-xl"
          >
            <ArrowUp />
          </Button>
        </form>
      </div>
    </div>
  )
}
