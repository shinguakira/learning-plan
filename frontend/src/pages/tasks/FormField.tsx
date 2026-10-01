import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/** A labelled slot in the add-task form, with room for a validation message. */
export function FormField({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string | null
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>
        {label}
        {hint && <span className="text-muted-foreground font-normal">{hint}</span>}
      </Label>
      <div className={cn('mt-1.5')}>{children}</div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
