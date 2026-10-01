import { useSkills } from '@/hooks/useSkills'
import { SkillForm } from '@/pages/profile/SkillForm'
import { SkillList } from '@/pages/profile/SkillList'

export function ProfilePage() {
  const { skills, loading, error, addSkill, removeSkill } = useSkills()

  return (
    <div className="scrollbar-slim mx-auto h-full max-w-6xl space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {skills.length === 0
            ? 'Technical skills for your resume. Edits here are not saved.'
            : `${skills.length} technical skill${skills.length === 1 ? '' : 's'} for your resume. Edits here are not saved.`}
        </p>
      </div>

      <SkillForm existingNames={skills.map((skill) => skill.name)} onSubmit={addSkill} />

      {error && <p className="text-destructive text-xs">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading skills…</p>
      ) : (
        <SkillList skills={skills} onRemove={removeSkill} />
      )}
    </div>
  )
}
