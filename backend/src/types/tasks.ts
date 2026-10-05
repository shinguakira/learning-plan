export type Category =
  | 'Frontend'
  | 'Backend'
  | 'Infra / Cloud'
  | 'Database'
  | 'CS Fundamentals'
  | 'Certification'

export type Status = 'todo' | 'doing' | 'done'
export type Priority = 'low' | 'mid' | 'high'

export type Task = {
  id: string
  title: string
  category: Category
  status: Status
  priority: Priority
  startDate: string
  dueDate: string
  estimatedHours: number
  note: string
  createdAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt'>

export type SeedTask = Omit<TaskDraft, 'startDate' | 'dueDate'> & {
  offsetStart: number
  span: number
}