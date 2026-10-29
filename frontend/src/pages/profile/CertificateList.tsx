import { useState } from "react"
import { Award, Building2, Calendar, ExternalLink, Pencil, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { parseCredentialUrl } from "@/utils/certificate"
import { CertificateEditDialog } from "@/pages/profile/CertificateEditDialog"
import type { Certificate, CertificateDraft } from "@/types/certificate"

export function CertificateList({
  certificates,
  onEdit,
  onRemove,
}: {
  certificates: Certificate[]
  onEdit: (id: string, draft: CertificateDraft) => Promise<void>
  onRemove: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = certificates.find((certificate) => certificate.id === editingId) ?? null
  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
        <Award className="text-muted-foreground/60 size-7" />
        <p className="text-sm font-medium">No certificates yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Add your professional certifications above.
        </p>
      </div>
    )
  }
  return (
    <>
      <ul className="space-y-3">
        {certificates.map((certificate) => {
          const credentialUrl = parseCredentialUrl(certificate.credentialUrl ?? "")
          return (
            <li key={certificate.id}>
              <Card size="sm">
                <CardContent className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Award className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{certificate.name}</h3>
                    <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-3.5" />
                        {certificate.issuer}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {certificate.dateEarned}
                      </span>
                    </p>
                    {credentialUrl && (
                      <Button variant="link" size="sm" className="mt-1 h-auto px-0" asChild>
                        <a
                          href={credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View credential for ${certificate.name}`}
                        >
                          <ExternalLink />
                          View credential
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${certificate.name} from ${certificate.issuer}`}
                      onClick={() => setEditingId(certificate.id)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${certificate.name} from ${certificate.issuer}`}
                      onClick={() => onRemove(certificate.id)}
                    >
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
      <CertificateEditDialog
        certificate={editing}
        existingNames={certificates
          .filter((certificate) => certificate.id !== editingId)
          .map((certificate) => certificate.name)}
        onEdit={onEdit}
        onClose={() => setEditingId(null)}
      />
    </>
  )
}
