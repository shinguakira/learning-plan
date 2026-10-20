import { MOCK_USERS } from './user.js'
import type { Strength } from '../types/strength.js'
import type { MockUser } from '../types/user.js'

const at = '2026-01-01T00:00:00.000Z'

export const seedStrengthsByUser: Record<MockUser, Strength[]> = {
  Sanjar: [
    {
      id: 'sanjar-strength-1',
      name: 'Problem solving',
      description:
        'I break complex problems into smaller steps and work through them systematically.',
      createdAt: at,
    },
    {
      id: 'sanjar-strength-2',
      name: 'Quick learner',
      description: 'I learn new tools quickly and apply them in practical projects.',
      createdAt: at,
    },
    {
      id: 'sanjar-strength-3',
      name: 'Communication',
      description: 'I explain my ideas clearly and listen to other perspectives.',
      createdAt: at,
    },
  ],
  Akira: [
    {
      id: 'akira-strength-1',
      name: 'Debugging under pressure',
      description: 'I stay methodical during incidents and narrow a fault down to one cause.',
      createdAt: at,
    },
    {
      id: 'akira-strength-2',
      name: 'Writing things down',
      description: 'I leave a runbook behind so the next person does not repeat the work.',
      createdAt: at,
    },
  ],
  Mike: [
    {
      id: 'mike-strength-1',
      name: 'Asking the right question first',
      description: 'I find out what decision a number is for before I go and calculate it.',
      createdAt: at,
    },
    {
      id: 'mike-strength-2',
      name: 'Reproducible work',
      description: 'I automate a report the second time someone asks for it.',
      createdAt: at,
    },
    {
      id: 'mike-strength-3',
      name: 'Explaining data to non-engineers',
      description: 'I describe what a result does and does not support, without the jargon.',
      createdAt: at,
    },
  ],
  John: [
    {
      id: 'john-strength-1',
      name: 'Attention to detail',
      description: 'I check a layout against the design at more than one screen width.',
      createdAt: at,
    },
    {
      id: 'john-strength-2',
      name: 'Taking feedback',
      description: 'I treat review comments as the fastest way to learn the codebase.',
      createdAt: at,
    },
  ],
}

export const seedStrengths: Strength[] = MOCK_USERS.flatMap((user) => seedStrengthsByUser[user])
