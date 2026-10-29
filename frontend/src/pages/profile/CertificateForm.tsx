import { useState, type FormEvent } from "react"
import { Plus, Save, X } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/form/FormField"
import { useCertificateDraft } from "@/hooks/useCertificateDraft"
import type { Certificate, CertificateDraft } from "@/types/certificate"

export function CertificateForm({
  certificate = null,
  existingNames = [],
  onSubmit,
}: {
  certificate?: Certificate | null
  existingNames?: readonly string[]
  onSubmit: (draft: CertificateDraft) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { draft, patch, touched, nameError, issuerError, dateError, urlError, submit } =
    useCertificateDraft(certificate, existingNames)
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
      setError(caught instanceof Error ? caught.message : "Could not save the certificate.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
        <FormField
          label="Title"
          htmlFor="certificate-title"
          error={touched ? nameError : null}
          className="min-w-0"
        >
          <Input
            id="certificate-title"
            value={draft.name}
            onChange={(event) => patch({ name: event.target.value })}
          />
        </FormField>
        <FormField
          label="Issued by"
          htmlFor="certificate-issuer"
          error={touched ? issuerError : null}
          className="min-w-0"
        >
          <Input
            id="certificate-issuer"
            value={draft.issuer}
            onChange={(event) => patch({ issuer: event.target.value })}
          />
        </FormField>
        <FormField
          label="Date earned"
          htmlFor="certificate-date-earned"
          error={touched ? dateError : null}
          className="min-w-0"
        >
          <Input
            id="certificate-date-earned"
            type="date"
            value={draft.dateEarned}
            onChange={(event) => patch({ dateEarned: event.target.value })}
          />
        </FormField>
      </div>
      <FormField
        label="Credential URL"
        hint="optional"
        htmlFor="certificate-url"
        error={touched ? urlError : null}
      >
        <Input
          id="certificate-url"
          type="url"
          placeholder="https://…"
          value={draft.credentialUrl}
          onChange={(event) => patch({ credentialUrl: event.target.value })}
          aria-invalid={touched && urlError !== null}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Link to your certificate on the issuer’s website.
        </p>
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
          {certificate === null ? <Plus /> : <Save />}
          {saving ? "Saving…" : certificate === null ? "Add certificate" : "Save certificate"}
        </Button>
      </div>
    </form>
  )
}
