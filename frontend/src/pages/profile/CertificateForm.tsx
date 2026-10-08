import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/form/FormField'
import { useCertificateDraft } from '@/hooks/useCertificateDraft'
import type { CertificateDraft } from '@/types/certificate'

export function CertificateForm({ onSubmit }: { onSubmit: (draft: CertificateDraft) => void }) {
  const { draft, patch, touched, nameError, issuerError, dateError, urlError, submit } =
    useCertificateDraft()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ready = submit()
    if (ready) onSubmit(ready)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <FormField
              label="Title"
              htmlFor="certificate-title"
              error={touched ? nameError : null}
              className="min-w-48 flex-1"
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
              className="min-w-48 flex-1"
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
              className="min-w-48 flex-1"
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
          <div className="flex justify-end">
            <Button type="submit">
              <Plus />
              Add certificate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
