import { skillService } from "../backend/src/services/skillService.js";

/**
 * GET /api/skills, as deployed. The Fastify route in `backend/` serves the same
 * data locally; both call `skillService`, so only the HTTP layer is written twice.
 *
 * This is a plain Vercel Function rather than a Fastify service on purpose - see
 * `doc/deployment.md` for the builder bug that rules the obvious approach out.
 */
export function GET(): Response {
  return Response.json(skillService.getSkills());
}
