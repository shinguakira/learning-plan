import type { MockUser } from "./user.js"

export type ChatRequest = {
  user: MockUser
  analyzeTasks?: boolean
  messages: { role: "user" | "assistant"; content: string }[]
}

export type ChatCompletion = {
  choices?: { message?: { content?: unknown } }[]
}

export type ChatResult =
  { ok: true; content: string } | { ok: false; status: 422 | 502; message: string }
