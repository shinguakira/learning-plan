import type { MockUser } from "./user.js"

export type CertificateCreateRequest = {
  user: MockUser
  name: string
  issuer: string
  dateEarned: string
  credentialUrl?: string
}

export type CertificateUpdateRequest = {
  name: string
  issuer: string
  dateEarned: string
  credentialUrl?: string
}
