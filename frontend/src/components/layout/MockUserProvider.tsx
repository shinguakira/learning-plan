import { useState, type ReactNode } from "react"
import { MOCK_USERS } from "@/constants/user"
import { MockUserContext } from "@/hooks/useMockUser"
import type { MockUser } from "@/types/user"

/** Makes the header's active user available to `useMockUser` anywhere in the tree. */
export function MockUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser>(MOCK_USERS[0])

  return <MockUserContext.Provider value={{ user, setUser }}>{children}</MockUserContext.Provider>
}
