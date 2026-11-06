import type { PostApiSkillsResponse, PostApiStrengthResponse } from "@/api/generated"
import { useEffect, useRef, useState } from "react"
import { fetchProfile } from "@/api/profile"
import { createJob, updateJob } from "@/api/job"
import { createCertificate, updateCertificate } from "@/api/certificate"
import { EMPTY_PROFILE_STATE } from "@/constants/profile"
import type { ProfileState } from "@/types/profile"
import type { MockUser } from "@/types/user"
import type { Job, JobDraft } from "@/types/job"
import type { Certificate, CertificateDraft } from "@/types/certificate"

export type ProfileApi = {
  skills: PostApiSkillsResponse[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: PostApiStrengthResponse[]
  /** True only while the initial seed request from the backend is in flight. */
  loading: boolean
  /** Set if the initial seed request failed; all lists still work from empty. */
  error: string | null
  addSkill: (skill: PostApiSkillsResponse) => void
  editSkill: (id: string, skill: PostApiSkillsResponse) => void
  removeSkill: (id: string) => void
  addJob: (draft: JobDraft) => Promise<void>
  editJob: (id: string, draft: JobDraft) => Promise<void>
  removeJob: (id: string) => void
  addCertificate: (draft: CertificateDraft) => Promise<void>
  editCertificate: (id: string, draft: CertificateDraft) => Promise<void>
  removeCertificate: (id: string) => void
  addStrength: (strength: PostApiStrengthResponse) => void
  editStrength: (id: string, strength: PostApiStrengthResponse) => void
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
              jobs: [
                ...profile.jobs,
                ...seed.jobs.filter(
                  (job) => !profile.jobs.some((existing) => existing.id === job.id),
                ),
              ],
              certificates: [
                ...profile.certificates,
                ...seed.certificates.filter(
                  (certificate) =>
                    !profile.certificates.some((existing) => existing.id === certificate.id),
                ),
              ],
              strengths: [
                ...profile.strengths,
                ...seed.strengths.filter(
                  (strength) => !profile.strengths.some((existing) => existing.id === strength.id),
                ),
              ],
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
    addSkill: (skill) => {
      updateProfile((profile) => ({ ...profile, skills: [skill, ...profile.skills] }))
    },
    editSkill: (id, skill) => {
      updateProfile((profile) => ({
        ...profile,
        skills: profile.skills.map((existing) => (existing.id === id ? skill : existing)),
      }))
    },
    removeSkill: (id) => {
      updateProfile((profile) => ({
        ...profile,
        skills: profile.skills.filter((skill) => skill.id !== id),
      }))
    },
    addJob: async (draft) => {
      const job = await createJob(user, draft)
      updateProfile((profile) => ({
        ...profile,
        jobs: [job, ...profile.jobs.filter((existing) => existing.id !== job.id)],
      }))
    },
    editJob: async (id, draft) => {
      const job = await updateJob(id, draft)
      updateProfile((profile) => ({
        ...profile,
        jobs: profile.jobs.map((existing) => (existing.id === id ? job : existing)),
      }))
    },
    removeJob: (id) => {
      updateProfile((profile) => ({
        ...profile,
        jobs: profile.jobs.filter((job) => job.id !== id),
      }))
    },
    addCertificate: async (draft) => {
      const certificate = await createCertificate(user, draft)
      updateProfile((profile) => ({
        ...profile,
        certificates: [
          certificate,
          ...profile.certificates.filter((existing) => existing.id !== certificate.id),
        ],
      }))
    },
    editCertificate: async (id, draft) => {
      const certificate = await updateCertificate(id, draft)
      updateProfile((profile) => ({
        ...profile,
        certificates: profile.certificates.map((existing) =>
          existing.id === id ? certificate : existing,
        ),
      }))
    },
    removeCertificate: (id) => {
      updateProfile((profile) => ({
        ...profile,
        certificates: profile.certificates.filter((certificate) => certificate.id !== id),
      }))
    },
    addStrength: (strength) => {
      updateProfile((profile) => ({
        ...profile,
        strengths: [
          strength,
          ...profile.strengths.filter((existing) => existing.id !== strength.id),
        ],
      }))
    },
    editStrength: (id, strength) => {
      updateProfile((profile) => ({
        ...profile,
        strengths: profile.strengths.map((existing) => (existing.id === id ? strength : existing)),
      }))
    },
    removeStrength: (id) => {
      updateProfile((profile) => ({
        ...profile,
        strengths: profile.strengths.filter((strength) => strength.id !== id),
      }))
    },
  }
}
