import { prisma } from '../lib/prisma.js'
import type { Certificate } from '@prisma/client'
import type { CertificateCreateRequest } from '../types/certificateDraft.js'

export const certificateRepository = {
  findByUserName(userName: string): Promise<Certificate[]> {
    return prisma.certificate.findMany({
      where: { user: { name: userName } },
      orderBy: { createdAt: 'asc' },
    })
  },

  findAll(): Promise<Certificate[]> {
    return prisma.certificate.findMany({ orderBy: { createdAt: 'asc' } })
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
}
