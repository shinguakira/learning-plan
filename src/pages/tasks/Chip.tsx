import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Small pill for a task's category, status or priority. */
export function Chip({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}
