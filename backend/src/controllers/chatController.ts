import type { FastifyInstance } from "fastify"
import { CHAT_REQUEST_SCHEMA } from "../constants/chatSchema.js"
import { getChatReply } from "../services/chatService.js"
import type { ChatRequest } from "../types/chat.js"
import { getChatConfig } from "../utils/chatConfig.js"

export default async function chatController(app: FastifyInstance): Promise<void> {
  const config = getChatConfig()

  app.post<{ Body: ChatRequest }>(
    "/api/chat",
    {
      schema: { body: CHAT_REQUEST_SCHEMA },
      onRequest: async (_request, reply) => {
        reply.header("Cache-Control", "no-store")
        if (!config) {
          return reply.code(503).send({ message: "Chat is not configured on the backend." })
        }
      },
    },
    async (request, reply) => {
      if (!config) {
        return reply.code(503).send({ message: "Chat is not configured on the backend." })
      }
      const controller = new AbortController()
      const cancel = () => {
        if (!reply.raw.writableEnded) controller.abort()
      }
      reply.raw.on("close", cancel)
      try {
        const result = await getChatReply(request.body, config, controller.signal)
        return result.ok
          ? reply.send({ content: result.content })
          : reply.code(result.status).send({ message: result.message })
      } finally {
        reply.raw.off("close", cancel)
      }
    },
  )
}
