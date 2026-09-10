import { useState } from 'react'
import type { FormEvent } from 'react'
import { CATEGORIES, PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '@/constants/task'
import { addDays, today } from '@/utils/date'
import { Field } from '@/pages/tasks/Field'
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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-sm font-semibold text-slate-800">Add a task</h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
        <Field label="Title" htmlFor="title" className="col-span-2 lg:col-span-4">
          <input
            id="title"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.title}
            placeholder="e.g. Build something with the Next.js App Router"
            onChange={(event) => patch({ title: event.target.value })}
          />
          {touched && titleError && <p className="mt-1 text-xs text-rose-600">{titleError}</p>}
        </Field>

        <Field label="Category" htmlFor="category">
          <select
            id="category"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.category}
            onChange={(event) => patch({ category: event.target.value as Category })}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" htmlFor="priority">
          <select
            id="priority"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.priority}
            onChange={(event) => patch({ priority: event.target.value as Priority })}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABEL[priority]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" htmlFor="status">
          <select
            id="status"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.status}
            onChange={(event) => patch({ status: event.target.value as Status })}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estimate" htmlFor="hours" hint="hours">
          <input
            id="hours"
            type="number"
            min={0}
            max={999}
            step={0.5}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.estimatedHours}
            onChange={(event) => patch({ estimatedHours: Number(event.target.value) || 0 })}
          />
        </Field>

        <Field label="Start" htmlFor="start">
          <input
            id="start"
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
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
        </Field>

        <Field label="Due" htmlFor="due">
          <input
            id="due"
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.dueDate}
            min={draft.startDate}
            onChange={(event) =>
              patch({ dueDate: (event.target.value as ISODate) || draft.startDate })
            }
          />
          {touched && dateError && <p className="mt-1 text-xs text-rose-600">{dateError}</p>}
        </Field>

        <Field label="Note" htmlFor="note" hint="optional" className="col-span-2">
          <input
            id="note"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={draft.note}
            placeholder="Material, definition of done, ..."
            onChange={(event) => patch({ note: event.target.value })}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setDraft(emptyDraft())
            setTouched(false)
          }}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          Clear
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
        >
          Add task
        </button>
      </div>
    </form>
  )
}
