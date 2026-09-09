import type { ReactNode } from 'react'

/** A labelled slot in the add-task form. */
export function Field({
  label,
  htmlFor,
  hint,
  className = '',
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor={htmlFor}>
        {label}
        {hint && <span className="ml-1.5 font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
