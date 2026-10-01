import { CATEGORY_THEME } from '@/constants/task'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/task'

/**
 * Names every category on screen, plus what the bar styles mean. The text is
 * what makes the categorical palette legible without relying on hue alone.
 */
export function TimelineLegend({ categories }: { categories: readonly Category[] }) {
  return (
    <div className="text-muted-foreground bg-muted/40 flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-2.5 text-[11px]">
      {categories.map((category) => (
        <span key={category} className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full', CATEGORY_THEME[category].dot)} />
          {category}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="bar-striped bg-muted-foreground size-2.5 rounded-xs" />
          In progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-muted-foreground size-2.5 rounded-xs opacity-45" />
          Done
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-primary h-3 w-px" />
          Today
        </span>
      </span>
    </div>
  )
}
