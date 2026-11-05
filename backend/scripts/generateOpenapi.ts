import { writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { app } from "../src/server.js"

/**
 * Writes the document the running server would serve. `app.ready()` is what makes
 * the routes register, which is when `@fastify/swagger` collects their schemas.
 * Nothing here connects to the database, so no environment is needed.
 */
const OUTPUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "openapi.json")

await app.ready()
await writeFile(OUTPUT, `${JSON.stringify(app.swagger(), null, 2)}\n`)
await app.close()

console.log(`Wrote ${path.basename(OUTPUT)}`)
