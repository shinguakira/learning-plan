import { MOCK_USERS } from './user.js'
import type { Skill } from '../types/skill.js'
import type { MockUser } from '../types/user.js'

const at = '2026-01-01T00:00:00.000Z'

export const seedSkillsByUser: Record<MockUser, Skill[]> = {
  Sanjar: [
    { id: 'sanjar-skill-1', name: 'TypeScript', level: 'expert', yearsOfExperience: 5, createdAt: at },
    { id: 'sanjar-skill-2', name: 'SQL', level: 'expert', yearsOfExperience: 4, createdAt: at },
    { id: 'sanjar-skill-3', name: 'React', level: 'advanced', yearsOfExperience: 3, createdAt: at },
    { id: 'sanjar-skill-4', name: 'Python', level: 'advanced', yearsOfExperience: 3, createdAt: at },
    { id: 'sanjar-skill-5', name: 'Docker', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'sanjar-skill-6', name: 'Git', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'sanjar-skill-7', name: 'Go', level: 'beginner', yearsOfExperience: 1, createdAt: at },
    { id: 'sanjar-skill-8', name: 'Kubernetes', level: 'beginner', yearsOfExperience: 1, createdAt: at },
  ],
  Akira: [
    { id: 'akira-skill-1', name: 'Go', level: 'expert', yearsOfExperience: 7, createdAt: at },
    { id: 'akira-skill-2', name: 'Kubernetes', level: 'expert', yearsOfExperience: 5, createdAt: at },
    { id: 'akira-skill-3', name: 'Terraform', level: 'advanced', yearsOfExperience: 4, createdAt: at },
    { id: 'akira-skill-4', name: 'PostgreSQL', level: 'advanced', yearsOfExperience: 6, createdAt: at },
    { id: 'akira-skill-5', name: 'Rust', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'akira-skill-6', name: 'TypeScript', level: 'intermediate', yearsOfExperience: 3, createdAt: at },
    { id: 'akira-skill-7', name: 'React', level: 'beginner', yearsOfExperience: 1, createdAt: at },
  ],
  Mike: [
    { id: 'mike-skill-1', name: 'Python', level: 'expert', yearsOfExperience: 8, createdAt: at },
    { id: 'mike-skill-2', name: 'SQL', level: 'expert', yearsOfExperience: 8, createdAt: at },
    { id: 'mike-skill-3', name: 'Airflow', level: 'advanced', yearsOfExperience: 4, createdAt: at },
    { id: 'mike-skill-4', name: 'Spark', level: 'advanced', yearsOfExperience: 3, createdAt: at },
    { id: 'mike-skill-5', name: 'dbt', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'mike-skill-6', name: 'Docker', level: 'intermediate', yearsOfExperience: 3, createdAt: at },
  ],
  John: [
    { id: 'john-skill-1', name: 'JavaScript', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'john-skill-2', name: 'React', level: 'intermediate', yearsOfExperience: 2, createdAt: at },
    { id: 'john-skill-3', name: 'HTML', level: 'advanced', yearsOfExperience: 3, createdAt: at },
    { id: 'john-skill-4', name: 'CSS', level: 'advanced', yearsOfExperience: 3, createdAt: at },
    { id: 'john-skill-5', name: 'Git', level: 'beginner', yearsOfExperience: 1, createdAt: at },
  ],
}

export const seedSkills: Skill[] = MOCK_USERS.flatMap((user) => seedSkillsByUser[user])
