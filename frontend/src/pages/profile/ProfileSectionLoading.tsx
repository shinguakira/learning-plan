import { Spinner } from "@/components/ui/spinner"

export function ProfileSectionLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="text-muted-foreground flex min-h-32 flex-col items-center justify-center gap-3"
    >
      <Spinner role="presentation" aria-hidden="true" className="size-8" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
