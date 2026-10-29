import type { FastifyInstance, FastifyReply } from "fastify"
import { profileService } from "../services/profileService.js"
import { toCsv } from "../utils/csv.js"
import { toPdf } from "../utils/pdf.js"
import { MOCK_USERS } from "../constants/user.js"
import { PROFILE_PDF_REQUEST_SCHEMA } from "../constants/profilePdfSchema.js"
import type { ProfilePdfRequest } from "../types/profilePdf.js"
import type { MockUser } from "../types/user.js"

export default async function profileController(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { user?: MockUser } }>(
    "/api/profile",
    {
      schema: {
        querystring: {
          type: "object",
          properties: { user: { type: "string", enum: MOCK_USERS } },
        },
      },
    },
    async (request) => profileService.getProfile(request.query.user),
  )

  app.get("/api/profile/csv", async (_request, reply: FastifyReply) => {
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header("Content-Disposition", 'attachment; filename="profile.csv"')
      .send(toCsv(await profileService.getProfile()))
  })

  /** POST, not GET: the body carries the profile as the page has it, edits included. */
  app.post<{ Body: ProfilePdfRequest }>(
    "/api/profile/pdf",
    { schema: { body: PROFILE_PDF_REQUEST_SCHEMA } },
    async (request, reply: FastifyReply) => {
      const { user, profile } = request.body
      const pdf = await toPdf(profile, user)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", `attachment; filename="profile-${user.toLowerCase()}.pdf"`)
        .send(pdf)
    },
  )
}
