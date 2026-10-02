import { useState } from 'react'
import { MOCK_USERS } from '@/constants/user'
import type { MockUser } from '@/types/user'

/** The person the header claims to be signed in as. Mock only - never sent anywhere. */
export function useMockUser() {
  const [user, setUser] = useState<MockUser>(MOCK_USERS[0])

  return { user, setUser }
}
