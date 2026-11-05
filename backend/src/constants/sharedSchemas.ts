import { CERTIFICATE_SCHEMA } from "./certificateSchema.js"
import { ERROR_SCHEMA } from "./errorSchema.js"
import { EMPLOYMENT_TYPE_SCHEMA, JOB_SCHEMA } from "./jobSchema.js"
import { PROFILE_SCHEMA } from "./profileSchema.js"
import { SKILL_LEVEL_SCHEMA, SKILL_SCHEMA } from "./skillSchema.js"
import { STRENGTH_SCHEMA } from "./strengthSchema.js"
import {
  TASK_CATEGORY_SCHEMA,
  TASK_PRIORITY_SCHEMA,
  TASK_SCHEMA,
  TASK_STATUS_SCHEMA,
} from "./taskSchema.js"
import { TECHNOLOGY_SCHEMA } from "./technologySchema.js"
import { MOCK_USER_SCHEMA } from "./user.js"

/**
 * Registered on the app by `$id`, so a route reaches them with `$ref` and the
 * document carries each one once under `components.schemas`. That name is what
 * the frontend generates its own type and - for an enum - its own value from.
 */
export const SHARED_SCHEMAS = [
  ERROR_SCHEMA,
  MOCK_USER_SCHEMA,
  SKILL_LEVEL_SCHEMA,
  EMPLOYMENT_TYPE_SCHEMA,
  TASK_CATEGORY_SCHEMA,
  TASK_STATUS_SCHEMA,
  TASK_PRIORITY_SCHEMA,
  SKILL_SCHEMA,
  STRENGTH_SCHEMA,
  JOB_SCHEMA,
  CERTIFICATE_SCHEMA,
  TASK_SCHEMA,
  TECHNOLOGY_SCHEMA,
  PROFILE_SCHEMA,
]
