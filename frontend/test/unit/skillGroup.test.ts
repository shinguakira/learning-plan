import { describe, expect, it } from 'vitest'
import { groupSkillsByLevel } from '@/utils/skill'
import type { Skill } from '@/types/skill'

let nextId = 0

function makeSkill(overrides: Partial<Skill> = {}): Skill {
  nextId += 1
  return {
    id: `s${nextId}`,
    name: 'Something',
    level: 'beginner',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('groupSkillsByLevel', () => {
  it('orders groups expert first, down to beginner', () => {
    const skills = [
      makeSkill({ name: 'a', level: 'beginner' }),
      makeSkill({ name: 'b', level: 'expert' }),
      makeSkill({ name: 'c', level: 'intermediate' }),
      makeSkill({ name: 'd', level: 'advanced' }),
    ]
    expect(groupSkillsByLevel(skills).map((group) => group.level)).toEqual([
      'expert',
      'advanced',
      'intermediate',
      'beginner',
    ])
  })

  it('leaves out a level with nothing registered', () => {
    const skills = [makeSkill({ level: 'beginner' }), makeSkill({ level: 'expert' })]
    expect(groupSkillsByLevel(skills).map((group) => group.level)).toEqual(['expert', 'beginner'])
  })

  it('keeps every skill of a level together, in registration order', () => {
    const skills = [
      makeSkill({ name: 'first', level: 'advanced' }),
      makeSkill({ name: 'second', level: 'advanced' }),
    ]
    expect(groupSkillsByLevel(skills)).toEqual([
      { level: 'advanced', skills: [skills[0], skills[1]] },
    ])
  })

  it('returns no groups for an empty list', () => {
    expect(groupSkillsByLevel([])).toEqual([])
  })
})
