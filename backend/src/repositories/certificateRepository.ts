import type { Certificate } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type {
  CertificateCreateRequest,
  CertificateUpdateRequest,
} from "../types/certificateDraft.js"

export const certificateRepository = {
  findByUserName(userName: string): Promise<Certificate[]> {
    return prisma.certificate.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: "asc" },
    })
  },

  findAll(): Promise<Certificate[]> {
    return prisma.certificate.findMany({ orderBy: { createdAt: "asc" } })
  },

  findById(id: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({ where: { id } })
  },

  create({
    user,
    name,
    issuer,
    dateEarned,
    credentialUrl,
  }: CertificateCreateRequest): Promise<Certificate> {
    return prisma.certificate.create({
      data: {
        user: { connect: { name: user } },
        name: name.trim(),
        issuer: issuer.trim(),
        dateEarned: new Date(`${dateEarned}T00:00:00.000Z`),
        credentialUrl,
      },
    })
  },

  update(
    id: string,
    { name, issuer, dateEarned, credentialUrl }: CertificateUpdateRequest,
  ): Promise<Certificate> {
    return prisma.certificate.update({
      where: { id },
      data: {
        name: name.trim(),
        issuer: issuer.trim(),
        dateEarned: new Date(`${dateEarned}T00:00:00.000Z`),
        credentialUrl: credentialUrl ?? null,
      },
    })
  },
}
