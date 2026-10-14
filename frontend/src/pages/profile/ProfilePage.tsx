import { useProfile } from "@/hooks/useProfile"
import { JobForm } from "@/pages/profile/JobForm"
import { JobList } from "@/pages/profile/JobList"
import { SkillForm } from "@/pages/profile/SkillForm"
import { SkillList } from "@/pages/profile/SkillList"
import { CertificateForm } from "@/pages/profile/CertificateForm"
import { CertificateList } from "@/pages/profile/CertificateList"
import { StrengthForm } from "@/pages/profile/StrengthForm"
import { StrengthList } from "@/pages/profile/StrengthList"
import { ProfileSectionLoading } from "@/pages/profile/ProfileSectionLoading"
import { ProfileFormDialog } from "@/pages/profile/ProfileFormDialog"

export function ProfilePage() {
  const {
    skills,
    jobs,
    certificates,
    strengths,
    loading,
    error,
    addSkill,
    removeSkill,
    addJob,
    removeJob,
    addCertificate,
    removeCertificate,
    addStrength,
    removeStrength,
  } = useProfile()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          What goes on your resume. Edits here are not saved.
        </p>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      <section aria-labelledby="skills-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="skills-heading" className="text-base font-semibold">
              Skills
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {skills.length === 0
                ? "The technologies you can work with."
                : `${skills.length} technical skill${skills.length === 1 ? "" : "s"}.`}
            </p>
          </div>
          <ProfileFormDialog title="Add skill">
            {(close) => (
              <SkillForm
                existingNames={skills.map((skill) => skill.name)}
                onSubmit={(draft) => {
                  addSkill(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        {loading ? (
          <ProfileSectionLoading label="Loading skills…" />
        ) : (
          <SkillList skills={skills} onRemove={removeSkill} />
        )}
      </section>

      <section aria-labelledby="strengths-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="strengths-heading" className="text-base font-semibold">
              Strengths
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              What you do well and how you put it into practice.
            </p>
          </div>
          <ProfileFormDialog title="Add strength">
            {(close) => (
              <StrengthForm
                onSubmit={(draft) => {
                  addStrength(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>
        {loading ? (
          <ProfileSectionLoading label="Loading strengths…" />
        ) : (
          <StrengthList strengths={strengths} onRemove={removeStrength} />
        )}
      </section>

      <section aria-labelledby="jobs-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="jobs-heading" className="text-base font-semibold">
              Job history
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {jobs.length === 0
                ? "Where you have worked."
                : `${jobs.length} role${jobs.length === 1 ? "" : "s"}, most recent first.`}
            </p>
          </div>
          <ProfileFormDialog title="Add job">
            {(close) => (
              <JobForm
                onSubmit={(draft) => {
                  addJob(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        {loading ? (
          <ProfileSectionLoading label="Loading job history…" />
        ) : (
          <JobList jobs={jobs} onRemove={removeJob} />
        )}
      </section>

      <section aria-labelledby="certificates-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="certificates-heading" className="text-base font-semibold">
            Certificates
          </h2>
          <ProfileFormDialog title="Add certificate">
            {(close) => (
              <CertificateForm
                onSubmit={(draft) => {
                  addCertificate(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        {loading ? (
          <ProfileSectionLoading label="Loading certificates…" />
        ) : (
          <CertificateList certificates={certificates} onRemove={removeCertificate} />
        )}
      </section>
    </div>
  )
}
