import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { TASKS_PER_PAGE } from '@/constants/pagination'
import { NEXT_STATUS } from '@/constants/task'
import { EmptyState } from '@/pages/tasks/EmptyState'
import { TaskRow } from '@/pages/tasks/TaskRow'
import type { Task, TaskDraft } from '@/types/task'

export function TaskListView({
  tasks,
  onUpdate,
  onRemove,
}: {
  tasks: readonly Task[]
  onUpdate: (id: string, patch: Partial<TaskDraft>) => void
  onRemove: (id: string) => void
}) {
  const [selectedPage, setSelectedPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(tasks.length / TASKS_PER_PAGE))
  const page = Math.min(selectedPage, pageCount)
  if (selectedPage !== page) setSelectedPage(page)
  const start = (page - 1) * TASKS_PER_PAGE
  const pageTasks = tasks.slice(start, start + TASKS_PER_PAGE)
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pageCount || Math.abs(number - page) <= 1,
  )

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks to show"
        description="Nothing matches the current filters, or no tasks have been added yet. Use the form above to add one."
      />
    )
  }

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden py-0">
        <ul aria-label="Tasks" className="divide-y">
          {pageTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onCycleStatus={() => onUpdate(task.id, { status: NEXT_STATUS[task.status] })}
              onRemove={() => onRemove(task.id)}
            />
          ))}
        </ul>
      </Card>
      <p className="text-muted-foreground text-center text-xs" role="status">
        Showing {start + 1}–{start + pageTasks.length} of {tasks.length} tasks
      </p>
      {pageCount > 1 && (
        <Pagination aria-label="Task pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : undefined}
                className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault()
                  if (page > 1) setSelectedPage(page - 1)
                }}
              />
            </PaginationItem>
            {pages.map((number, index) => (
              <PaginationItem key={number} className="flex items-center gap-0.5">
                {number - (pages[index - 1] ?? 0) > 1 && <PaginationEllipsis />}
                <PaginationLink
                  href="#"
                  aria-label={`Go to page ${number}`}
                  isActive={page === number}
                  onClick={(event) => {
                    event.preventDefault()
                    setSelectedPage(number)
                  }}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === pageCount}
                tabIndex={page === pageCount ? -1 : undefined}
                className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault()
                  if (page < pageCount) setSelectedPage(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
