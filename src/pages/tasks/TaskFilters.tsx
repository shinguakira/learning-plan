import { CalendarRange, List, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, SORT_LABEL, STATUSES, STATUS_LABEL } from '@/constants/task'
import type { TaskFiltersApi } from '@/hooks/useTaskFilters'
import { SegmentedButton } from '@/pages/tasks/SegmentedButton'
import type { CategoryFilter, SortKey, ViewMode } from '@/types/task'

export function TaskFilters({
  filters,
  total,
  view,
  onViewChange,
}: {
  filters: TaskFiltersApi
  total: number
  view: ViewMode
  onViewChange: (next: ViewMode) => void
}) {
  const { statusFilter, setStatusFilter, categoryFilter, setCategoryFilter } = filters
  const { sortKey, setSortKey, query, setQuery, visible, filtering } = filters

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-2.5">
        <div className="bg-muted flex rounded-lg p-1">
          <SegmentedButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
            All
          </SegmentedButton>
          {STATUSES.map((status) => (
            <SegmentedButton
              key={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {STATUS_LABEL[status]}
            </SegmentedButton>
          ))}
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
        >
          <SelectTrigger size="sm" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortKey}
          onValueChange={(value) => setSortKey(value as SortKey)}
          disabled={view === 'timeline'}
        >
          <SelectTrigger
            size="sm"
            aria-label="Sort order"
            title={view === 'timeline' ? 'The timeline is always ordered by start date' : undefined}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SORT_LABEL[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            aria-label="Search tasks"
            className="h-7 w-48 pl-7 text-xs"
            placeholder="Search title and notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <span className="text-muted-foreground text-xs">
          {visible.length} shown{filtering && ` of ${total}`}
        </span>

        <div className="bg-muted ml-auto flex rounded-lg p-1">
          <SegmentedButton active={view === 'list'} onClick={() => onViewChange('list')}>
            <List />
            List
          </SegmentedButton>
          <SegmentedButton active={view === 'timeline'} onClick={() => onViewChange('timeline')}>
            <CalendarRange />
            Timeline
          </SegmentedButton>
        </div>
      </CardContent>
    </Card>
  )
}
