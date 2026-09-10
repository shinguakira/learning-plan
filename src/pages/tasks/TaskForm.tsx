import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '@/constants/task'
import { addDays, today } from '@/utils/date'
import type { ISODate } from '@/types/date'
import type { Category, Priority, Status, TaskDraft } from '@/types/task'

function emptyDraft(): TaskDraft {
  return {
    title: '',
    category: CATEGORIES[0],
    status: 'todo',
    priority: 'mid',
    startDate: today(),
    dueDate: addDays(today(), 7),
    estimatedHours: 4,
    note: '',
  }
}

export function TaskForm({ onSubmit }: { onSubmit: (draft: TaskDraft) => void }) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft)
  const [touched, setTouched] = useState(false)

  const titleError = draft.title.trim() === '' ? 'Enter a title' : null
  const dateError =
    draft.dueDate < draft.startDate ? 'Due date must not precede the start date' : null
  const invalid = titleError !== null || dateError !== null

  const patch = (next: Partial<TaskDraft>) => setDraft((prev) => ({ ...prev, ...next }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)
    if (invalid) return
    onSubmit({ ...draft, title: draft.title.trim(), note: draft.note.trim() })
    setDraft(emptyDraft())
    setTouched(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className="mt-1.5"
                value={draft.title}
                placeholder="e.g. Build something with the Next.js App Router"
                onChange={(event) => patch({ title: event.target.value })}
              />
              {touched && titleError && (
                <p className="text-destructive mt-1 text-xs">{titleError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={draft.category}
                onValueChange={(value) => patch({ category: value as Category })}
              >
                <SelectTrigger id="category" aria-label="Category" className="mt-1.5 w-full">
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
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={draft.priority}
                onValueChange={(value) => patch({ priority: value as Priority })}
              >
                <SelectTrigger id="priority" aria-label="Priority" className="mt-1.5 w-full">
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
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={draft.status}
                onValueChange={(value) => patch({ status: value as Status })}
              >
                <SelectTrigger id="status" aria-label="Status" className="mt-1.5 w-full">
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
            </div>

            <div>
              <Label htmlFor="hours">
                Estimate <span className="text-muted-foreground font-normal">hours</span>
              </Label>
              <Input
                id="hours"
                type="number"
                min={0}
                max={999}
                step={0.5}
                className="mt-1.5"
                value={draft.estimatedHours}
                onChange={(event) => patch({ estimatedHours: Number(event.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="date"
                className="mt-1.5"
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
            </div>

            <div>
              <Label htmlFor="due">Due</Label>
              <Input
                id="due"
                type="date"
                className="mt-1.5"
                value={draft.dueDate}
                min={draft.startDate}
                onChange={(event) =>
                  patch({ dueDate: (event.target.value as ISODate) || draft.startDate })
                }
              />
              {touched && dateError && <p className="text-destructive mt-1 text-xs">{dateError}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="note">
                Note <span className="text-muted-foreground font-normal">optional</span>
              </Label>
              <Input
                id="note"
                className="mt-1.5"
                value={draft.note}
                placeholder="Material, definition of done, ..."
                onChange={(event) => patch({ note: event.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDraft(emptyDraft())
                setTouched(false)
              }}
            >
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
