import { app } from './server.js'

const PORT = Number(process.env.PORT) || 3001

app.listen({ port: PORT }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Listening on http://localhost:${PORT}`)
})
