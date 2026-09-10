import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Label plus value. The value deliberately avoids tabular-nums: fixed-width
 * digits look loose at this size and only earn their keep in aligned columns.
 */
export function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  iconClass,
  alert = false,
}: {
  label: string
  value: number
  unit?: string
  icon: LucideIcon
  iconClass?: string
  alert?: boolean
}) {
  return (
    <div className="min-w-[76px]">
      <div className="flex items-center gap-1.5">
        <Icon className={cn('size-3.5', iconClass ?? 'text-muted-foreground')} />
        <span className="text-muted-foreground text-[11px]">{label}</span>
      </div>
      <p className={cn('mt-0.5 text-xl font-semibold', alert && value > 0 && 'text-destructive')}>
        {value}
        {unit && <span className="text-muted-foreground ml-0.5 text-xs font-medium">{unit}</span>}
      </p>
    </div>
  )
}
