import { Inbox } from 'lucide-react'

/** Shown in place of the list or timeline when there is nothing to draw. */
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
      <Inbox className="text-muted-foreground/60 size-7" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-muted-foreground max-w-sm text-xs">{description}</p>
    </div>
  )
}
