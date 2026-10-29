import type { MockUser } from "./user.js"

export type CertificateCreateRequest = {
  user: MockUser
  name: string
  issuer: string
  dateEarned: string
  credentialUrl?: string
}
