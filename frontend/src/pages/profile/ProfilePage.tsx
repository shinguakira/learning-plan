import { useProfile } from '@/hooks/useProfile'
import { JobForm } from '@/pages/profile/JobForm'
import { JobList } from '@/pages/profile/JobList'
import { SkillForm } from '@/pages/profile/SkillForm'
import { SkillList } from '@/pages/profile/SkillList'
import { CertificateForm } from '@/pages/profile/CertificateForm'
import { CertificateList } from '@/pages/profile/CertificateList'

export function ProfilePage() {
  const {
    skills,
    jobs,
    certificates,
    loading,
    error,
    addSkill,
    removeSkill,
    addJob,
    removeJob,
    addCertificate,
    removeCertificate,
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
        <div>
          <h2 id="skills-heading" className="text-base font-semibold">
            Skills
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {skills.length === 0
              ? 'The technologies you can work with.'
              : `${skills.length} technical skill${skills.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <SkillForm existingNames={skills.map((skill) => skill.name)} onSubmit={addSkill} />

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading skills…</p>
        ) : (
          <SkillList skills={skills} onRemove={removeSkill} />
        )}
      </section>

      <section aria-labelledby="jobs-heading" className="space-y-5">
        <div>
          <h2 id="jobs-heading" className="text-base font-semibold">
            Job history
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {jobs.length === 0
              ? 'Where you have worked.'
              : `${jobs.length} role${jobs.length === 1 ? '' : 's'}, most recent first.`}
          </p>
        </div>

        <JobForm onSubmit={addJob} />

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading job history…</p>
        ) : (
          <JobList jobs={jobs} onRemove={removeJob} />
        )}
      </section>

      <section aria-labelledby="certificates-heading" className="space-y-5">
        <div>
          <h2 id="certificates-heading" className="text-base font-semibold">
            Certificates
          </h2>
        </div>

        <CertificateForm onSubmit={addCertificate} />

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading certificates…</p>
        ) : (
          <CertificateList certificates={certificates} onRemove={removeCertificate} />
        )}
      </section>
    </div>
  )
}
