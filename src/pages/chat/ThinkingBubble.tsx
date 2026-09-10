import { AssistantAvatar } from '@/pages/chat/AssistantAvatar'

/** Placeholder while a reply is in flight. */
export function ThinkingBubble() {
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
