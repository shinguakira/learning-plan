import { useSkills } from '@/hooks/useSkills'
import { SkillForm } from '@/pages/profile/SkillForm'
import { SkillList } from '@/pages/profile/SkillList'

export function ProfilePage() {
  const { skills, addSkill, removeSkill } = useSkills()

  return (
    <div className="scrollbar-slim mx-auto h-full max-w-6xl space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Technical skills for your resume. Nothing is saved.
        </p>
      </div>

      <SkillForm existingNames={skills.map((skill) => skill.name)} onSubmit={addSkill} />

      <SkillList skills={skills} onRemove={removeSkill} />
    </div>
  )
}
