/** Shown in place of the list or timeline when there is nothing to draw. */
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="max-w-sm text-xs text-slate-400">{description}</p>
    </div>
  )
}
