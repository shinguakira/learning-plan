import { Award, Building2, Calendar } from 'lucide-react'
import { useSkills } from '@/hooks/useSkills'
import { JobForm } from '@/pages/profile/JobForm'
import { JobList } from '@/pages/profile/JobList'
import { SkillForm } from '@/pages/profile/SkillForm'
import { SkillList } from '@/pages/profile/SkillList'
import { Card, CardContent } from '@/components/ui/card'

export function ProfilePage() {
  const { skills, jobs, certificates, loading, error, addSkill, removeSkill, addJob, removeJob } =
    useSkills()

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

        {/* we need to make a form here */}

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading certificates…</p>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
            <Award className="text-muted-foreground/60 size-7" />
            <p className="text-sm font-medium">No certificates yet</p>
            <p className="text-muted-foreground max-w-sm text-xs">
              Add your professional certifications above.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {certificates.map((certificate) => (
              <li key={certificate.name}>
                <Card size="sm">
                  <CardContent className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Award className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{certificate.name}</h3>
                      <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="size-3.5" />
                          {certificate.issuer}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {certificate.dateEarned}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
