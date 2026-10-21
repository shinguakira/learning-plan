import { Link } from "react-router-dom"
import type { To } from "react-router-dom"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  CATEGORY_THEME,
  PRIORITY_CHIP,
  PRIORITY_LABEL,
  STATUS_CHIP,
  STATUS_LABEL,
} from "@/constants/task"
import type { Task } from "@/types/task"

export function TaskDetails({
  task,
  loading,
  error,
  onRetry,
  backTo,
}: {
  task: Task | undefined
  loading: boolean
  error: string | null
  onRetry: () => void
  backTo: To
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
      <Button asChild variant="outline" size="sm">
        <Link to={backTo}>
          <ArrowLeft />
          Back to tasks
        </Link>
      </Button>

      {task ? (
        <Card>
          <CardHeader>
            <h1 className="text-xl font-semibold break-words">{task.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className={CATEGORY_THEME[task.category].chip}>
                {task.category}
              </Badge>
              <Badge variant="outline" className={STATUS_CHIP[task.status]}>
                {STATUS_LABEL[task.status]}
              </Badge>
              <Badge variant="outline" className={PRIORITY_CHIP[task.priority]}>
                {PRIORITY_LABEL[task.priority]} priority
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Assignee</dt>
                <dd className="mt-1 font-medium">{task.assignee}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Estimated hours</dt>
                <dd className="mt-1 font-medium">{task.estimatedHours}h</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Start date</dt>
                <dd className="mt-1 font-medium">
                  <time dateTime={task.startDate}>{task.startDate}</time>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Due date</dt>
                <dd className="mt-1 font-medium">
                  <time dateTime={task.dueDate}>{task.dueDate}</time>
                </dd>
              </div>
            </dl>
            <section aria-labelledby="task-notes-heading">
              <h2 id="task-notes-heading" className="mb-2 text-sm font-semibold">
                Notes
              </h2>
              <p className="text-muted-foreground text-sm break-words whitespace-pre-wrap">
                {task.note || "No notes for this task."}
              </p>
            </section>
          </CardContent>
        </Card>
      ) : loading ? (
        <p role="status" className="text-muted-foreground text-sm">
          Loading task…
        </p>
      ) : error ? (
        <div className="space-y-3">
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw />
            Retry loading task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Task unavailable</h1>
          <p className="text-muted-foreground text-sm">
            This task does not exist or is not visible to the selected user. Locally added tasks are
            only available until you leave the Tasks page or reload it.
          </p>
        </div>
      )}
    </div>
  )
}
