import type { IncomingMessage, ServerResponse } from 'node:http'
import { skillService } from '../services/skillService.js'

/** Translates the HTTP layer into calls on skillService and writes the response. */
export const skillController = {
  getSkills(_req: IncomingMessage, res: ServerResponse): void {
    const skills = skillService.getSkills()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(skills))
  },
}
