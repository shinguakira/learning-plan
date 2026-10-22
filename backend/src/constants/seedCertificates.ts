import { MOCK_USERS } from "./user.js"
import type { Certificate } from "../types/certificate.js"
import type { MockUser } from "../types/user.js"

const at = "2026-01-01T00:00:00.000Z"

export const seedCertificatesByUser: Record<MockUser, Certificate[]> = {
    Sanjar: [
        // Sample month/day; the certificate specifies only the award year, 2026.
        {
            id: "sanjar-cert-1",
            credentialUrl: "https://cs50.harvard.edu/certificates/6d9a7fd7-d5ac-4fa1-ac87-6f1f9f400241",
            name: "CS50x: Introduction to Computer Science",
            issuer: "Harvard University",
            dateEarned: "2026-01-01",
            createdAt: at
        },
        {
            id: "sanjar-cert-2",
            name: "IBM Data Science",
            issuer: "IBM",
            dateEarned: "2026-07-01",
            createdAt: at
        },
        {
            id: "sanjar-cert-3",
            name: "Google AI Essentials",
            issuer: "Google",
            dateEarned: "2026-01-15",
            createdAt: at
        },
        {
            id: "sanjar-cert-4",
            name: "Python For Everybody",
            issuer: "University of Michigan",
            dateEarned: "2025-06-30",
            createdAt: at
        }
    ],
    Akira: [
        {
            id: "akira-cert-1",
            name: "Certified Kubernetes Administrator",
            issuer: "The Linux Foundation",
            dateEarned: "2024-05-20",
            createdAt: at
        },
        {
            id: "akira-cert-2",
            name: "AWS Certified Solutions Architect - Associate",
            issuer: "Amazon Web Services",
            dateEarned: "2023-02-10",
            createdAt: at
        },
        {
            id: "akira-cert-3",
            name: "HashiCorp Certified: Terraform Associate",
            issuer: "HashiCorp",
            dateEarned: "2022-11-04",
            createdAt: at
        }
    ],
    Mike: [
        {
            id: "mike-cert-1",
            name: "Google Data Analytics",
            issuer: "Google",
            dateEarned: "2023-08-12",
            createdAt: at
        },
        {
            id: "mike-cert-2",
            name: "Databricks Certified Data Engineer Associate",
            issuer: "Databricks",
            dateEarned: "2024-03-22",
            createdAt: at
        }
    ],
    John: [
        {
            id: "john-cert-1",
            name: "Responsive Web Design",
            issuer: "freeCodeCamp",
            dateEarned: "2024-07-05",
            createdAt: at
        }
    ]
}

export const seedCertificates: Certificate[] = MOCK_USERS.flatMap((user) => seedCertificatesByUser[user])
