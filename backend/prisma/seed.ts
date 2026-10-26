import { PrismaClient } from '@prisma/client'
import { MOCK_USERS } from '../src/constants/user.js'

/**
 * Re-run on every `migrate dev` and `migrate reset`, so every write is an upsert
 * keyed on the unique name rather than a create.
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

try {
  for (const name of MOCK_USERS) {
    await prisma.user.upsert({ where: { name }, update: {}, create: { name } })
  }

  for (const name of TECHNOLOGIES) {
    await prisma.technology.upsert({ where: { name }, update: {}, create: { name } })
  }

  console.log(`Seeded ${MOCK_USERS.length} users and ${TECHNOLOGIES.length} technologies.`)
} finally {
  await prisma.$disconnect()
}
