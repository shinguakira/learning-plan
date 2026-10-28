import { useState } from "react"
import { Pencil, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StrengthEditDialog } from "@/pages/profile/StrengthEditDialog"
import type { Strength, StrengthDraft } from "@/types/strength"

export function StrengthList({
  strengths,
  onEdit,
  onRemove,
}: {
  strengths: Strength[]
  onEdit: (id: string, draft: StrengthDraft) => Promise<void>
  onRemove: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = strengths.find((strength) => strength.id === editingId) ?? null
  if (strengths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
        <Sparkles className="text-muted-foreground size-7" />
        <p className="text-sm font-medium">No strengths added yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Add what you do well and an example above.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {strengths.map((strength) => (
          <li key={strength.id} className="min-w-0">
            <Card size="sm" className="h-full">
              <CardContent className="flex items-start gap-3">
                <Sparkles className="text-primary mt-0.5 size-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold wrap-anywhere">{strength.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap wrap-anywhere">
                    {strength.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${strength.name}`}
                    onClick={() => setEditingId(strength.id)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${strength.name}`}
                    onClick={() => onRemove(strength.id)}
                  >
                    <X />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <StrengthEditDialog
        strength={editing}
        existingNames={strengths
          .filter((strength) => strength.id !== editingId)
          .map((strength) => strength.name)}
        onEdit={onEdit}
        onClose={() => setEditingId(null)}
      />
    </>
  )
}
