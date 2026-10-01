import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '@/constants/task'
import { useTaskDraft } from '@/hooks/useTaskDraft'
import { today } from '@/utils/date'
import { FormField } from '@/pages/tasks/FormField'
import type { ISODate } from '@/types/date'
import type { Category, Priority, Status, TaskDraft } from '@/types/task'

export function TaskForm({ onSubmit }: { onSubmit: (draft: TaskDraft) => void }) {
  const { draft, patch, titleError, dateError, touched, submit, reset } = useTaskDraft()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ready = submit()
    if (ready) onSubmit(ready)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
            <FormField
              label="Title"
              htmlFor="title"
              error={touched ? titleError : null}
              className="col-span-2 lg:col-span-4"
            >
              <Input
                id="title"
                value={draft.title}
                placeholder="e.g. Build something with the Next.js App Router"
                onChange={(event) => patch({ title: event.target.value })}
              />
            </FormField>

            <FormField label="Category" htmlFor="category">
              <Select
                value={draft.category}
                onValueChange={(value) => patch({ category: value as Category })}
              >
                <SelectTrigger id="category" aria-label="Category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Priority" htmlFor="priority">
              <Select
                value={draft.priority}
                onValueChange={(value) => patch({ priority: value as Priority })}
              >
                <SelectTrigger id="priority" aria-label="Priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {PRIORITY_LABEL[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Status" htmlFor="status">
              <Select
                value={draft.status}
                onValueChange={(value) => patch({ status: value as Status })}
              >
                <SelectTrigger id="status" aria-label="Status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Estimate" htmlFor="hours" hint=" hours">
              <Input
                id="hours"
                type="number"
                min={0}
                max={999}
                step={0.5}
                value={draft.estimatedHours}
                onChange={(event) => patch({ estimatedHours: Number(event.target.value) || 0 })}
              />
            </FormField>

            <FormField label="Start" htmlFor="start">
              <Input
                id="start"
                type="date"
                value={draft.startDate}
                onChange={(event) => {
                  const startDate = (event.target.value as ISODate) || today()
                  patch({
                    startDate,
                    // Push the due date along if the start date moves past it.
                    dueDate: draft.dueDate < startDate ? startDate : draft.dueDate,
                  })
                }}
              />
            </FormField>

            <FormField label="Due" htmlFor="due" error={touched ? dateError : null}>
              <Input
                id="due"
                type="date"
                value={draft.dueDate}
                min={draft.startDate}
                onChange={(event) =>
                  patch({ dueDate: (event.target.value as ISODate) || draft.startDate })
                }
              />
            </FormField>

            <FormField label="Note" htmlFor="note" hint=" optional" className="col-span-2">
              <Input
                id="note"
                value={draft.note}
                placeholder="Material, definition of done, ..."
                onChange={(event) => patch({ note: event.target.value })}
              />
            </FormField>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={reset}>
              Clear
            </Button>
            <Button type="submit">
              <Plus />
              Add task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
