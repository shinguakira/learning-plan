export const TASK_CATEGORY_SCHEMA = {
  $id: "taskCategory",
  type: "string",
  enum: ["Frontend", "Backend", "Infra / Cloud", "Database", "CS Fundamentals", "Certification"],
} as const

export const TASK_STATUS_SCHEMA = {
  $id: "taskStatus",
  type: "string",
  enum: ["todo", "doing", "done"],
} as const

export const TASK_PRIORITY_SCHEMA = {
  $id: "taskPriority",
  type: "string",
  enum: ["low", "mid", "high"],
} as const

export const TASK_SCHEMA = {
  $id: "task",
  type: "object",
  required: [
    "title",
    "category",
    "status",
    "priority",
    "estimatedHours",
    "note",
    "offsetStart",
    "span",
  ],
  properties: {
    title: { type: "string" },
    category: { $ref: "taskCategory#" },
    status: { $ref: "taskStatus#" },
    priority: { $ref: "taskPriority#" },
    estimatedHours: { type: "number" },
    note: { type: "string" },
    offsetStart: { type: "integer" },
    span: { type: "integer" },
  },
} as const

export const TASKS_SCHEMA = {
  type: "object",
  required: ["tasks"],
  properties: { tasks: { type: "array", items: { $ref: "task#" } } },
} as const

export const TASK_CREATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "category",
    "status",
    "priority",
    "estimatedHours",
    "note",
    "assignee",
    "startDate",
    "dueDate",
  ],
  properties: {
    title: { type: "string", minLength: 1, pattern: "\\S" },
    category: { $ref: "taskCategory#" },
    status: { $ref: "taskStatus#" },
    priority: { $ref: "taskPriority#" },
    estimatedHours: { type: "number" },
    note: { type: "string" },
    assignee: { $ref: "mockUser#" },
    startDate: { type: "string", format: "date" },
    dueDate: { type: "string", format: "date" },
  },
} as const
