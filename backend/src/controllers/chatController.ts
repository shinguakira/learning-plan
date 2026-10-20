import type { FastifyInstance } from "fastify";
import {
  CHAT_BODY_LIMIT,
  CHAT_MAX_CONCURRENT_REQUESTS,
  CHAT_RATE_WINDOW_MS,
  CHAT_REQUESTS_PER_WINDOW,
} from "../constants/chat.js";
import { CHAT_REQUEST_SCHEMA } from "../constants/chatSchema.js";
import { getChatReply } from "../services/chatService.js";
import type { ChatRequest } from "../types/chat.js";
import { getChatConfig } from "../utils/chatConfig.js";

export default async function chatController(
  app: FastifyInstance,
): Promise<void> {
  const config = getChatConfig();
  let windowStart = Date.now();
  let attempts = 0;
  let active = 0;

  app.post<{ Body: ChatRequest }>(
    "/api/chat",
    {
      bodyLimit: CHAT_BODY_LIMIT,
      schema: { body: CHAT_REQUEST_SCHEMA },
      onRequest: async (_request, reply) => {
        reply.header("Cache-Control", "no-store");
        if (!config) {
          return reply
            .code(503)
            .send({ message: "Chat is not configured on the backend." });
        }
        const now = Date.now();
        if (now - windowStart >= CHAT_RATE_WINDOW_MS) {
          windowStart = now;
          attempts = 0;
        }
        attempts += 1;
        if (attempts > CHAT_REQUESTS_PER_WINDOW) {
          return reply
            .header(
              "Retry-After",
              String(
                Math.ceil((windowStart + CHAT_RATE_WINDOW_MS - now) / 1000),
              ),
            )
            .code(429)
            .send({ message: "Chat is busy. Please try again in a minute." });
        }
      },
    },
    async (request, reply) => {
      if (!config) {
        return reply
          .code(503)
          .send({ message: "Chat is not configured on the backend." });
      }
      if (active >= CHAT_MAX_CONCURRENT_REQUESTS) {
        return reply.header("Retry-After", "5").code(429).send({
          message: "Chat is busy. Please try again shortly.",
        });
      }
      const controller = new AbortController();
      const cancel = () => {
        if (!reply.raw.writableEnded) controller.abort();
      };
      reply.raw.on("close", cancel);
      active += 1;
      try {
        const result = await getChatReply(
          request.body,
          config,
          controller.signal,
        );
        return result.ok
          ? reply.send({ content: result.content })
          : reply.code(result.status).send({ message: result.message });
      } finally {
        active -= 1;
        reply.raw.off("close", cancel);
      }
    },
  );
}
