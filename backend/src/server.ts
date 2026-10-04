import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'

export const app = Fastify()

app.register(cors, {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'OPTIONS'],
})

/** Every file here registers its own route; adding a controller never touches this file. */
app.register(autoload, {
  dir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'controllers'),
})
