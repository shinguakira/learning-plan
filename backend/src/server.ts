import path from "node:path"
import { fileURLToPath } from "node:url"

import autoload from "@fastify/autoload"
import cors from "@fastify/cors"
import swagger from "@fastify/swagger"
import Fastify from "fastify"

import { OPENAPI_DOCUMENT } from "./constants/openapi.js"
import { SHARED_SCHEMAS } from "./constants/sharedSchemas.js"

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://localhost:5173"

export const app = Fastify()

app.register(cors, {
  origin: ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
})

/** Collects each route's schema as it registers, so it has to come before them. */
app.register(swagger, {
  openapi: OPENAPI_DOCUMENT,
  refResolver: { buildLocalReference: (json) => String(json.$id) },
})

for (const schema of SHARED_SCHEMAS) {
  app.addSchema(schema)
}

/** Every file here registers its own route; adding a controller never touches this file. */
app.register(autoload, {
  dir: path.join(path.dirname(fileURLToPath(import.meta.url)), "controllers"),
})
