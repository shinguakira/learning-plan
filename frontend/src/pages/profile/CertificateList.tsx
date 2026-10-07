import { Award, Building2, Calendar, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Certificate } from '@/types/certificate'

export function CertificateList({
  certificates,
  onRemove,
}: {
  certificates: Certificate[]
  onRemove: (id: string) => void
}) {
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
    <ul className="space-y-3">
      {certificates.map((certificate) => (
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
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${certificate.name} from ${certificate.issuer}`}
                onClick={() => onRemove(certificate.id)}
              >
                <X />
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
