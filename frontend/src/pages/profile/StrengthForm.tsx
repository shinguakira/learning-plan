import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/form/FormField'
import { useStrengthDraft } from '@/hooks/useStrengthDraft'
import type { StrengthDraft } from '@/types/strength'

export function StrengthForm({ onSubmit }: { onSubmit: (draft: StrengthDraft) => void }) {
  const { draft, touched, nameError, descriptionError, patch, submit } = useStrengthDraft()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ready = submit()
    if (ready) onSubmit(ready)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a strength</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <FormField label="Strength" htmlFor="strength-name" error={touched ? nameError : null}>
            <Input
              id="strength-name"
              value={draft.name}
              placeholder="e.g. Problem solving"
              onChange={(event) => patch({ name: event.target.value })}
              aria-invalid={touched && nameError !== null}
            />
          </FormField>
          <FormField
            label="Description"
            htmlFor="strength-description"
            error={touched ? descriptionError : null}
          >
            <Textarea
              id="strength-description"
              value={draft.description}
              placeholder="Explain what you do well, or give a concrete example."
              onChange={(event) => patch({ description: event.target.value })}
              aria-invalid={touched && descriptionError !== null}
            />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit">
              <Plus />
              Add strength
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
