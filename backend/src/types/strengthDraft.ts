import type { MockUser } from "./user.js"

export type StrengthCreateRequest = {
  user: MockUser
  name: string
  description: string
}

export type StrengthUpdateRequest = {
  name: string
  description: string
}
