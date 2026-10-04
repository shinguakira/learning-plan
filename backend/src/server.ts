import Fastify from 'fastify'
import cors from '@fastify/cors'
import skillController from './controllers/skillController.js'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'
const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST ?? '0.0.0.0'

export const app = Fastify()

app.register(cors, {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'OPTIONS'],
})

/**
 * Controllers are registered by name rather than discovered from the directory.
 * Deployed, this is traced into a function from the files it imports, and a
 * directory read at startup finds nothing. Adding a controller means a line here.
 */
app.register(skillController)

/**
 * Started here rather than from a separate entry file: Vercel looks for an
 * `app`, `index` or `server` under the service root or `src/`, and captures the
 * server from this `listen` call. One file, one entry, nothing to detect wrong.
 */
app.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Listening on http://localhost:${PORT}`)
})

export default app
