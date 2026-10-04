import { Briefcase, Building2, CalendarRange, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EMPLOYMENT_TYPE_CHIP, EMPLOYMENT_TYPE_LABEL } from '@/constants/job'
import { cn } from '@/lib/utils'
import { today } from '@/utils/date'
import { formatDuration, formatPeriod, sortJobs } from '@/utils/job'
import type { Job } from '@/types/job'

export function JobList({ jobs, onRemove }: { jobs: Job[]; onRemove: (id: string) => void }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
        <Briefcase className="text-muted-foreground/60 size-7" />
        <p className="text-sm font-medium">No job history yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Add the roles you want on your resume above.
        </p>
      </div>
    )
  }

  const now = today()

  return (
    <ul className="space-y-3">
      {sortJobs(jobs).map((job) => (
        <li key={job.id}>
          <Card size="sm">
            <CardContent className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{job.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('h-5', EMPLOYMENT_TYPE_CHIP[job.employmentType])}
                  >
                    {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
                  </Badge>
                  {job.endDate === null && (
                    <Badge
                      variant="outline"
                      className="h-5 border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                    >
                      Current
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarRange className="size-3.5" />
                    {formatPeriod(job)}
                    <span className="tabular-nums">({formatDuration(job, now)})</span>
                  </span>
                </p>

                {job.summary !== '' && <p className="mt-2 text-xs">{job.summary}</p>}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${job.title} at ${job.company}`}
                onClick={() => onRemove(job.id)}
              >
                <X />
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
