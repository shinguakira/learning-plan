import { certificateService } from './certificateService.js'
import { jobService } from './jobService.js'
import { skillService } from './skillService.js'
import { strengthService } from './strengthService.js'
import type { Profile } from '../types/profile.js'

/** Shared sample data for the profile page and its CSV download. */
export const profileService = {
  getProfile(): Profile {
    return {
      skills: skillService.getSkills(),
      strengths: strengthService.getStrengths(),
      jobs: jobService.getJobs(),
      certificates: certificateService.getCertificates(),
    }
  },
}
