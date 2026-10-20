import type { ChatConfig } from "../types/chatConfig.js";

/** An unset or invalid configuration disables chat without breaking sample-data routes. */
export function getChatConfig(): ChatConfig | null {
  const url = process.env.CHAT_API_URL ?? "";
  const model = process.env.CHAT_MODEL ?? "";
  const key = process.env.CHAT_API_KEY ?? "";
  if (url === "" || model.trim() === "") return null;
  try {
    const parsed = new URL(url);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
    if (parsed.username || parsed.password || parsed.hash || parsed.search)
      return null;
    if (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:"))
      return null;
    if (!local && key === "") return null;
    return { url: parsed.href, model, key };
  } catch {
    return null;
  }
}
