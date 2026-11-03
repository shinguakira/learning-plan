/**
 * Everything the document needs that no route can supply. The paths, bodies and
 * parameters are read off each route's own `schema` by `@fastify/swagger`.
 *
 * 3.1.0 rather than the plugin's 3.0.3 default: the route schemas in this folder
 * are plain JSON Schema, and 3.1 is a superset of it, so nothing is rewritten on
 * the way out.
 */
export const OPENAPI_DOCUMENT = {
  openapi: "3.1.0",
  info: {
    title: "learning-plan API",
    description: "Tasks, profiles, skills, strengths, certificates and job history.",
    version: "0.0.0",
  },
}
