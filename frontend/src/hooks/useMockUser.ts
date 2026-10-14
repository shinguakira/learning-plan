import { createContext, useContext } from "react"
import type { MockUser } from "@/types/user"

export type MockUserContextValue = {
  user: MockUser
  setUser: (user: MockUser) => void
}

/** Supplied by `MockUserProvider`, which owns the actual state. */
export const MockUserContext = createContext<MockUserContextValue | null>(null)

/** The person the header claims to be signed in as. */
export function useMockUser(): MockUserContextValue {
  const context = useContext(MockUserContext)
  if (context === null) {
    throw new Error("useMockUser must be used within a MockUserProvider")
  }
  return context
}
