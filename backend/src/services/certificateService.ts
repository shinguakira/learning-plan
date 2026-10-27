import type { Certificate as CertificateRow } from '@prisma/client'
import { certificateRepository } from "../repositories/certificateRepository.js"
import type { Certificate } from "../types/certificate.js"
import { MockUser } from '../types/user.js'

const toCertificate = (row: CertificateRow): Certificate => ({
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    dateEarned: row.dateEarned.toISOString().slice(0, 10),
    ...(row.credentialUrl === null ? {} : { credentialUrl: row.credentialUrl }),
    createdAt: row.createdAt.toISOString(),
})

export const certificateService = {
    async getCertificatesByUser(user: MockUser): Promise<Certificate[]> {
        return (await certificateRepository.findByUserName(user)).map(toCertificate)
    },

    async getCertificates(): Promise<Certificate[]> {
        return (await certificateRepository.findAll()).map(toCertificate)
    }
}
