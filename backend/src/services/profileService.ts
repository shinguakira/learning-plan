import type { MockUser } from "../types/user.js"
import { certificateService } from "./certificateService.js"
import { jobService } from "./jobService.js"
import { skillService } from "./skillService.js"
import { strengthService } from "./strengthService.js"
import type { Profile } from "../types/profile.js"

/** Shared database reads for the profile page and its CSV download. */
export const profileService = {
  async getProfile(user?: MockUser): Promise<Profile> {
    if (user !== undefined) {
      return {
        skills: await skillService.getSkillsByUser(user),
        strengths: await strengthService.getStrengthsByUser(user),
        jobs: await jobService.getJobsByUser(user),
        certificates: await certificateService.getCertificatesByUser(user),
      }
    }
    return {
      skills: await skillService.getSkills(),
      strengths: await strengthService.getStrengths(),
      jobs: await jobService.getJobs(),
      certificates: await certificateService.getCertificates(),
    }
  },
}
