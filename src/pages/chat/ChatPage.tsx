import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SUGGESTIONS } from '@/constants/chat'
import { useChat } from '@/hooks/useChat'
import { Markdown } from '@/pages/chat/Markdown'
import type { ChatMessage } from '@/types/chat'

function AssistantAvatar() {
  return (
    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
      AI
    </div>
  )
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="animate-fade-rise flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm whitespace-pre-wrap text-white shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-rise flex gap-3">
      <AssistantAvatar />
      <div className="max-w-[80%] space-y-1 rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-200 ring-inset">
        <Markdown text={message.content} />
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="animate-fade-rise flex gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-200 ring-inset">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-slate-300"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Stick to the bottom whenever the conversation grows.
  useLayoutEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, pending])

  // Grow the textarea with its content, up to about eight lines.
  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 176)}px`
  }, [draft])

  const submit = () => {
    if (draft.trim() === '' || pending) return
    send(draft)
    setDraft('')
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">AI chat</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            A standalone chatbot, independent of your tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={messages.length === 0}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
        >
          New chat
        </button>
      </div>

      <div ref={scrollRef} className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && !pending ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div>
              <p className="text-sm font-medium text-slate-600">What do you want to work out?</p>
              <p className="mt-1 text-xs text-slate-400">
                Ask about learning software engineering, or start from a prompt below.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-600 shadow-xs transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  {suggestion}
                </button>
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
          className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
        >
          <textarea
            ref={textareaRef}
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
            className="max-h-44 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={draft.trim() === '' || pending}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400"
            aria-label="Send"
            title="Send"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M8 13V3M8 3 3.5 7.5M8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
