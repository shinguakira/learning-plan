import type { Certificate } from "../types/certificate.js"

export const seedCertificates: Certificate[] = [
    {
        id: "1",
        name: "IBM Data Science",
        issuer: "IBM",
        dateEarned: "2026-07-01",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: "2",
        name: "Google AI Essentials",
        issuer: "Google",
        dateEarned: "2026-01-15",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: "3",
        name: "Python For Everybody",
        issuer: "University of Michigan",
        dateEarned: "2025-06-30",
        createdAt: "2026-01-01T00:00:00.000Z"
    }
]