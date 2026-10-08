export type Certificate = {
  id: string
  name: string
  issuer: string
  dateEarned: string
  /** Optional issuer page where this credential can be viewed. */
  credentialUrl?: string
  createdAt: string
}