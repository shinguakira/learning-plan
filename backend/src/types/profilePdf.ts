import type { Profile } from "./profile.js"
import type { MockUser } from "./user.js"

export type ProfilePdfRequest = {
  user: MockUser
  profile: Profile
}
