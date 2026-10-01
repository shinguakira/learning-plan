import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** One option in a segmented control - the status filter and the view switch. */
export function SegmentedButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(!active && 'text-muted-foreground')}
    >
      {children}
    </Button>
  )
}
