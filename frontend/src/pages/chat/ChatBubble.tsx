import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyText } from '@/hooks/useCopyText'
import { cn } from '@/lib/utils'
import { AssistantAvatar } from '@/pages/chat/AssistantAvatar'
import { Markdown } from '@/pages/chat/Markdown'
import type { ChatMessage } from '@/types/chat'

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { status, copy } = useCopyText(message.content)

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
          'group/reply max-w-[80%] space-y-1 rounded-2xl rounded-tl-md border px-4 py-2.5 text-sm leading-relaxed',
          message.failed
            ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : 'bg-card text-card-foreground',
        )}
      >
        <Markdown text={message.content} />
        {!message.failed && (
          <div className="flex items-center justify-end gap-2">
            <span role="status" className="text-muted-foreground text-xs">
              {status === 'copied'
                ? 'Copied'
                : status === 'error'
                  ? 'Could not copy. Try again.'
                  : ''}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={cn(
                'text-muted-foreground transition group-hover/reply:opacity-100 focus-visible:opacity-100',
                status === 'idle' && 'opacity-0 [@media(hover:none)]:opacity-100',
              )}
              aria-label={status === 'copied' ? 'Copied reply' : 'Copy reply'}
              title={status === 'copied' ? 'Copied' : 'Copy reply'}
              disabled={status === 'copying'}
              onClick={() => void copy()}
            >
              {status === 'copied' ? <Check /> : <Copy />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
