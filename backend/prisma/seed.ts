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

const STRENGTHS: Record<MockUser, { name: string; description: string }[]> = {
  Sanjar: [
    {
      name: 'Problem solving',
      description:
        'I break complex problems into smaller steps and work through them systematically.',
    },
    {
      name: 'Quick learner',
      description: 'I learn new tools quickly and apply them in practical projects.',
    },
    {
      name: 'Communication',
      description: 'I explain my ideas clearly and listen to other perspectives.',
    },
  ],
  Akira: [
    {
      name: 'Debugging under pressure',
      description: 'I stay methodical during incidents and narrow a fault down to one cause.',
    },
    {
      name: 'Writing things down',
      description: 'I leave a runbook behind so the next person does not repeat the work.',
    },
  ],
  Mike: [
    {
      name: 'Asking the right question first',
      description: 'I find out what decision a number is for before I go and calculate it.',
    },
    {
      name: 'Reproducible work',
      description: 'I automate a report the second time someone asks for it.',
    },
    {
      name: 'Explaining data to non-engineers',
      description: 'I describe what a result does and does not support, without the jargon.',
    },
  ],
  John: [
    {
      name: 'Attention to detail',
      description: 'I check a layout against the design at more than one screen width.',
    },
    {
      name: 'Taking feedback',
      description: 'I treat review comments as the fastest way to learn the codebase.',
    },
  ],
}

type SeedCertificate = {
  name: string
  issuer: string
  dateEarned: string
  credentialUrl?: string
}

const CERTIFICATES: Record<MockUser, SeedCertificate[]> = {
  Sanjar: [
    {
      name: 'CS50x: Introduction to Computer Science',
      issuer: 'Harvard University',
      dateEarned: '2026-01-01',
      credentialUrl:
        'https://cs50.harvard.edu/certificates/6d9a7fd7-d5ac-4fa1-ac87-6f1f9f400241',
    },
    { name: 'IBM Data Science', issuer: 'IBM', dateEarned: '2026-07-01' },
    { name: 'Google AI Essentials', issuer: 'Google', dateEarned: '2026-01-15' },
    {
      name: 'Python For Everybody',
      issuer: 'University of Michigan',
      dateEarned: '2025-06-30',
    },
  ],
  Akira: [
    {
      name: 'Certified Kubernetes Administrator',
      issuer: 'The Linux Foundation',
      dateEarned: '2024-05-20',
    },
    {
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      dateEarned: '2023-02-10',
    },
    {
      name: 'HashiCorp Certified: Terraform Associate',
      issuer: 'HashiCorp',
      dateEarned: '2022-11-04',
    },
  ],
  Mike: [
    { name: 'Google Data Analytics', issuer: 'Google', dateEarned: '2023-08-12' },
    {
      name: 'Databricks Certified Data Engineer Associate',
      issuer: 'Databricks',
      dateEarned: '2024-03-22',
    },
  ],
  John: [
    { name: 'Responsive Web Design', issuer: 'freeCodeCamp', dateEarned: '2024-07-05' },
  ],
}

try {
  let skillCount = 0
  let strengthCount = 0
  let certificateCount = 0

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

    for (const strength of STRENGTHS[name]) {
      await prisma.strength.upsert({
        where: { userId_name: { userId: user.id, name: strength.name } },
        update: {},
        create: { userId: user.id, ...strength },
      })
      strengthCount += 1
    }

    for (const certificate of CERTIFICATES[name]) {
      await prisma.certificate.upsert({
        where: { userId_name: { userId: user.id, name: certificate.name } },
        update: {},
        create: {
          userId: user.id,
          ...certificate,
          dateEarned: new Date(certificate.dateEarned),
        },
      })
      certificateCount += 1
    }
  }

  for (const name of TECHNOLOGIES) {
    await prisma.technology.upsert({ where: { name }, update: {}, create: { name } })
  }

  console.log(
    `Seeded ${MOCK_USERS.length} users, ${skillCount} skills, ${strengthCount} strengths, ${certificateCount} certificates and ${TECHNOLOGIES.length} technologies.`,
  )
} finally {
  await prisma.$disconnect()
}
