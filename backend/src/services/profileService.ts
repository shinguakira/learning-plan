import { seedSkillsByUser } from '../constants/seedSkills.js'
import { seedStrengthsByUser } from '../constants/seedStrengths.js'
import { seedJobsByUser } from '../constants/seedJobs.js'
import { seedCertificatesByUser } from '../constants/seedCertificates.js'
import type { MockUser } from '../types/user.js'
import { certificateService } from './certificateService.js'
import { jobService } from './jobService.js'
import { skillService } from './skillService.js'
import { strengthService } from './strengthService.js'
import type { Profile } from '../types/profile.js'

/** Shared sample data for the profile page and its CSV download. */
export const profileService = {
  getProfile(user?: MockUser): Profile {
    if (user !== undefined) {
      return {
        skills: seedSkillsByUser[user],
        strengths: seedStrengthsByUser[user],
        jobs: seedJobsByUser[user],
        certificates: seedCertificatesByUser[user],
      }
    }
    return {
      skills: skillService.getSkills(),
      strengths: strengthService.getStrengths(),
      jobs: jobService.getJobs(),
      certificates: certificateService.getCertificates(),
    }
  },
}
