import { cn } from '@/lib/utils'
import { AssistantAvatar } from '@/pages/chat/AssistantAvatar'
import { Markdown } from '@/pages/chat/Markdown'
import type { ChatMessage } from '@/types/chat'

export function ChatBubble({ message }: { message: ChatMessage }) {
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
