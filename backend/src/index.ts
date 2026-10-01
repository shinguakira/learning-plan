import { server } from './server.js'

const PORT = Number(process.env.PORT) || 3001

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
