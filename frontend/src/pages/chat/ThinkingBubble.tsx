import { AssistantAvatar } from "@/pages/chat/AssistantAvatar"

/** Placeholder while a reply is in flight. */
export function ThinkingBubble({ label = "Thinking…" }: { label?: string }) {
  return (
    <div className="animate-fade-rise flex gap-3">
      <AssistantAvatar />
      <div
        role="status"
        className="bg-card flex flex-wrap items-center gap-2 rounded-2xl rounded-tl-md border px-4 py-3.5"
      >
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="bg-muted-foreground/40 size-1.5 animate-bounce rounded-full"
              style={{ animationDelay: `${dot * 0.12}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
