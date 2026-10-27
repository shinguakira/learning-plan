import { prisma } from '../lib/prisma.js'
import type { Certificate } from '@prisma/client'

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
}
