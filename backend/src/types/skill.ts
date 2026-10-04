export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type Skill = {
  id: string
  name: string
  level: SkillLevel
  createdAt: string
}
