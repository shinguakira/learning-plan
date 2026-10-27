import { useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/form/FormField"
import { useStrengthDraft } from "@/hooks/useStrengthDraft"
import { EMPTY_STRENGTH_DRAFT } from "@/constants/strength"
import type { StrengthDraft } from "@/types/strength"

export function StrengthForm({
  existingNames,
  onSubmit,
}: {
  existingNames: readonly string[]
  onSubmit: (draft: StrengthDraft) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { draft, touched, nameError, descriptionError, patch, submit } = useStrengthDraft(
    existingNames,
    EMPTY_STRENGTH_DRAFT,
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    const ready = submit()
    if (ready === null) return
    setSaving(true)
    setError(null)
    try {
      await onSubmit(ready)
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not save the strength.")
    } finally {
      setSaving(false)
    }
  }

  return (
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
      {error !== null && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            <X />
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          <Plus />
          {saving ? "Saving…" : "Add strength"}
        </Button>
      </div>
    </form>
  )
}
