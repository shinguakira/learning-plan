import { useEffect, useRef, useState } from "react"
import { fetchProfile } from "@/api/profile"
import { createSkill } from "@/api/skill"
import { EMPTY_PROFILE_STATE } from "@/constants/profile"
import type { ProfileState } from "@/types/profile"
import type { MockUser } from "@/types/user"
import type { Job, JobDraft } from "@/types/job"
import type { Skill, SkillDraft } from "@/types/skill"
import type { Certificate, CertificateDraft } from "@/types/certificate"
import type { Strength, StrengthDraft } from "@/types/strength"

export type ProfileApi = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: Strength[]
  /** True only while the initial seed request from the backend is in flight. */
  loading: boolean
  /** Set if the initial seed request failed; all lists still work from empty. */
  error: string | null
  addSkill: (draft: SkillDraft) => Promise<void>
  removeSkill: (id: string) => void
  addJob: (draft: JobDraft) => void
  removeJob: (id: string) => void
  addCertificate: (draft: CertificateDraft) => void
  removeCertificate: (id: string) => void
  addStrength: (draft: StrengthDraft) => void
  removeStrength: (id: string) => void
}

export function useProfile(user: MockUser): ProfileApi {
  const [profiles, setProfiles] = useState<Partial<Record<MockUser, ProfileState>>>({})
  const loaded = useRef(new Set<MockUser>())

  useEffect(() => {
    if (loaded.current.has(user)) return
    let active = true
    const controller = new AbortController()

    fetchProfile(user, controller.signal)
      .then((seed) => {
        if (!active) return
        loaded.current.add(user)
        setProfiles((previous) => {
          const profile = previous[user] ?? EMPTY_PROFILE_STATE
          return {
            ...previous,
            [user]: {
              skills: [...profile.skills, ...seed.skills],
              jobs: [...profile.jobs, ...seed.jobs],
              certificates: [...profile.certificates, ...seed.certificates],
              strengths: [...profile.strengths, ...seed.strengths],
              loading: false,
              error: null,
            },
          }
        })
      })
      .catch((caught: unknown) => {
        if (!active) return
        setProfiles((previous) => ({
          ...previous,
          [user]: {
            ...(previous[user] ?? EMPTY_PROFILE_STATE),
            loading: false,
            error: caught instanceof Error ? caught.message : "Failed to load profile.",
          },
        }))
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [user])

  const updateProfile = (update: (profile: ProfileState) => ProfileState) => {
    setProfiles((previous) => ({
      ...previous,
      [user]: update(previous[user] ?? EMPTY_PROFILE_STATE),
    }))
  }

  return {
    ...(profiles[user] ?? EMPTY_PROFILE_STATE),
    addSkill: async (draft) => {
      const skill = await createSkill(user, draft)
      updateProfile((profile) => ({ ...profile, skills: [skill, ...profile.skills] }))
    },
    removeSkill: (id) => {
      updateProfile((profile) => ({
        ...profile,
        skills: profile.skills.filter((skill) => skill.id !== id),
      }))
    },
    addJob: (draft) => {
      const job: Job = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
      updateProfile((profile) => ({ ...profile, jobs: [job, ...profile.jobs] }))
    },
    removeJob: (id) => {
      updateProfile((profile) => ({
        ...profile,
        jobs: profile.jobs.filter((job) => job.id !== id),
      }))
    },
    addCertificate: (draft) => {
      const certificate: Certificate = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      updateProfile((profile) => ({
        ...profile,
        certificates: [certificate, ...profile.certificates],
      }))
    },
    removeCertificate: (id) => {
      updateProfile((profile) => ({
        ...profile,
        certificates: profile.certificates.filter((certificate) => certificate.id !== id),
      }))
    },
    addStrength: (draft) => {
      const strength: Strength = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      updateProfile((profile) => ({ ...profile, strengths: [strength, ...profile.strengths] }))
    },
    removeStrength: (id) => {
      updateProfile((profile) => ({
        ...profile,
        strengths: profile.strengths.filter((strength) => strength.id !== id),
      }))
    },
  }
}
