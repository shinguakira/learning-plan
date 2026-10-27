import { PrismaClient } from '@prisma/client'
import { MOCK_USERS } from '../src/constants/user.js'
import type { SkillLevel } from '@prisma/client'
import type { MockUser } from '../src/types/user.js'

/**
 * Re-run on every `migrate dev` and `migrate reset`, so every write is an upsert
 * rather than a create.
 */
const prisma = new PrismaClient()

/** The Skill form's options, without its "Other" free-text escape hatch. */
const TECHNOLOGIES = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'HTML / CSS',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C#',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS',
  'Git',
  'Linux',
] as const

type SeedSkill = {
  name: string
  level: SkillLevel
  yearsOfExperience: number
}

const SKILLS: Record<MockUser, SeedSkill[]> = {
  Sanjar: [
    { name: 'TypeScript', level: 'expert', yearsOfExperience: 5 },
    { name: 'SQL', level: 'expert', yearsOfExperience: 4 },
    { name: 'React', level: 'advanced', yearsOfExperience: 3 },
    { name: 'Python', level: 'advanced', yearsOfExperience: 3 },
    { name: 'Docker', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'Git', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'Go', level: 'beginner', yearsOfExperience: 1 },
    { name: 'Kubernetes', level: 'beginner', yearsOfExperience: 1 },
  ],
  Akira: [
    { name: 'Go', level: 'expert', yearsOfExperience: 7 },
    { name: 'Kubernetes', level: 'expert', yearsOfExperience: 5 },
    { name: 'Terraform', level: 'advanced', yearsOfExperience: 4 },
    { name: 'PostgreSQL', level: 'advanced', yearsOfExperience: 6 },
    { name: 'Rust', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'TypeScript', level: 'intermediate', yearsOfExperience: 3 },
    { name: 'React', level: 'beginner', yearsOfExperience: 1 },
  ],
  Mike: [
    { name: 'Python', level: 'expert', yearsOfExperience: 8 },
    { name: 'SQL', level: 'expert', yearsOfExperience: 8 },
    { name: 'Airflow', level: 'advanced', yearsOfExperience: 4 },
    { name: 'Spark', level: 'advanced', yearsOfExperience: 3 },
    { name: 'dbt', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'Docker', level: 'intermediate', yearsOfExperience: 3 },
  ],
  John: [
    { name: 'JavaScript', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'React', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'HTML', level: 'advanced', yearsOfExperience: 3 },
    { name: 'CSS', level: 'advanced', yearsOfExperience: 3 },
    { name: 'Git', level: 'beginner', yearsOfExperience: 1 },
  ],
}

try {
  let skillCount = 0

  for (const name of MOCK_USERS) {
    const user = await prisma.user.upsert({ where: { name }, update: {}, create: { name } })

    for (const skill of SKILLS[name]) {
      await prisma.skill.upsert({
        where: { userId_name: { userId: user.id, name: skill.name } },
        update: {},
        create: { userId: user.id, ...skill },
      })
      skillCount += 1
    }
  }

  for (const name of TECHNOLOGIES) {
    await prisma.technology.upsert({ where: { name }, update: {}, create: { name } })
  }

  console.log(
    `Seeded ${MOCK_USERS.length} users, ${skillCount} skills and ${TECHNOLOGIES.length} technologies.`,
  )
} finally {
  await prisma.$disconnect()
}
