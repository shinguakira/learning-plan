import Fastify from 'fastify'
import cors from '@fastify/cors'
import skillController from './controllers/skillController.mjs'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'

export const app = Fastify()

app.register(cors, {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'OPTIONS'],
})

/**
 * Controllers are registered by name rather than discovered from the directory.
 * Deployed, this runs as a bundled function built from the files it imports, and
 * a directory read at startup finds nothing there - every controller has to be
 * reachable by a static import. Adding one means adding a line here.
 */
app.register(skillController)
