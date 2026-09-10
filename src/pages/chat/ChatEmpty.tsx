import { Button } from '@/components/ui/button'
import { SUGGESTIONS } from '@/constants/chat'

/** Shown before the first message: a prompt plus starter questions. */
export function ChatEmpty({ onPick }: { onPick: (prompt: string) => void }) {
  return (
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
            onClick={() => onPick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
