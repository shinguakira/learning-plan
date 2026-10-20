import {
  CHAT_MAX_OUTPUT_TOKENS,
  CHAT_SYSTEM_PROMPT,
  CHAT_TIMEOUT_MS,
} from "../constants/chat.js";
import type { ChatCompletion, ChatRequest, ChatResult } from "../types/chat.js";
import type { ChatConfig } from "../types/chatConfig.js";

/** Only the server chooses the upstream destination, model and credentials. */
export async function getChatReply(
  input: ChatRequest,
  config: ChatConfig,
  signal: AbortSignal,
): Promise<ChatResult> {
  const timeout = AbortSignal.timeout(CHAT_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.key !== "") headers.Authorization = `Bearer ${config.key}`;
    const response = await fetch(config.url, {
      method: "POST",
      headers,
      redirect: "error",
      signal: AbortSignal.any([signal, timeout]),
      body: JSON.stringify({
        model: config.model,
        max_tokens: CHAT_MAX_OUTPUT_TOKENS,
        messages: [
          {
            role: "system",
            content: `${CHAT_SYSTEM_PROMPT} You are talking to ${input.user}.`,
          },
          ...input.messages,
        ],
      }),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return {
        ok: false,
        status: 502,
        message: "The chat provider could not complete the request.",
      };
    }
    const body = (await response.json()) as ChatCompletion | null;
    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      return {
        ok: false,
        status: 502,
        message: "The chat provider returned an invalid reply.",
      };
    }
    return { ok: true, content };
  } catch {
    return timeout.aborted
      ? {
          ok: false,
          status: 504,
          message: "The chat provider took too long to respond.",
        }
      : {
          ok: false,
          status: 502,
          message: "Could not reach the chat provider.",
        };
  }
}
