import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/** Owns the draft text; the page only hears about completed messages. */
export function ChatComposer({
  pending,
  onSend,
}: {
  pending: boolean
  onSend: (text: string) => void
}) {
  const [draft, setDraft] = useState('')

  const submit = () => {
    if (draft.trim() === '' || pending) return
    onSend(draft)
    setDraft('')
  }

  return (
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
  )
}
