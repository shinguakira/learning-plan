import { useJobs } from '@/hooks/useJobs'
import { useSkills } from '@/hooks/useSkills'
import { JobForm } from '@/pages/profile/JobForm'
import { JobList } from '@/pages/profile/JobList'
import { SkillForm } from '@/pages/profile/SkillForm'
import { SkillList } from '@/pages/profile/SkillList'

/**
 * Job history is above skills because it is the section that is ready on the
 * first render. Skills arrive from the backend and the section grows by a few
 * hundred pixels when they do; anything under it would be shoved out of view at
 * that moment, which looked like the job list appearing and then vanishing.
 * The section that changes height goes last.
 */
export function ProfilePage() {
  const { jobs, addJob, removeJob } = useJobs()
  const { skills, loading, error, addSkill, removeSkill } = useSkills()

  return (
    <div className="scrollbar-slim mx-auto h-full max-w-6xl space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          What goes on your resume. Edits here are not saved.
        </p>
      </div>

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
        <JobList jobs={jobs} onRemove={removeJob} />
      </section>

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

        {error && <p className="text-destructive text-xs">{error}</p>}

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading skills…</p>
        ) : (
          <SkillList skills={skills} onRemove={removeSkill} />
        )}
      </section>
    </div>
  )
}
