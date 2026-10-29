import { CHAT_SYSTEM_PROMPT } from "../constants/chat.js"
import type { ChatCompletion, ChatRequest, ChatResult } from "../types/chat.js"
import type { ChatConfig } from "../types/chatConfig.js"
import { createTaskAnalysisContext } from "../utils/taskAnalysis.js"

/** Only the server chooses the upstream destination, model and credentials. */
export async function getChatReply(
  input: ChatRequest,
  config: ChatConfig,
  signal: AbortSignal,
): Promise<ChatResult> {
  try {
    const context = input.analyzeTasks ? createTaskAnalysisContext(input.user) : null
    if (input.analyzeTasks && context === null) {
      return {
        ok: false,
        status: 422,
        message: `No tasks to analyze. No backend tasks are assigned to ${input.user}.`,
      }
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (config.key !== "") headers.Authorization = `Bearer ${config.key}`
    const response = await fetch(config.url, {
      method: "POST",
      headers,
      redirect: "error",
      signal,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: `${CHAT_SYSTEM_PROMPT} You are talking to ${input.user}.`,
          },
          ...input.messages.map((message, index) =>
            context && index === input.messages.length - 1
              ? { ...message, content: `${message.content}\n\n${context}` }
              : message,
          ),
        ],
      }),
    })
    if (!response.ok) {
      await response.body?.cancel()
      return {
        ok: false,
        status: 502,
        message: "The chat provider could not complete the request.",
      }
    }
    const body = (await response.json()) as ChatCompletion | null
    const content = body?.choices?.[0]?.message?.content
    if (typeof content !== "string" || content.trim() === "") {
      return {
        ok: false,
        status: 502,
        message: "The chat provider returned an invalid reply.",
      }
    }
    return { ok: true, content }
  } catch {
    return {
      ok: false,
      status: 502,
      message: "Could not reach the chat provider.",
    }
  }
}
