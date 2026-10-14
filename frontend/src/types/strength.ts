export type Strength = {
  id: string
  name: string
  description: string
  createdAt: string
}

export type StrengthDraft = Omit<Strength, "id" | "createdAt">
