import type { Certificate } from "../types/certificate.js"

export const seedCertificates: Certificate[] = [
    // Sample month/day; the certificate specifies only the award year, 2026.
    {
        id: "cs50-example",
        credentialUrl: "https://cs50.harvard.edu/certificates/6d9a7fd7-d5ac-4fa1-ac87-6f1f9f400241",
        name: "CS50x: Introduction to Computer Science",
        issuer: "Harvard University",
        dateEarned: "2026-01-01",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
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