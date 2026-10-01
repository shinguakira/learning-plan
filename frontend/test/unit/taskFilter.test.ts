import { describe, expect, it } from 'vitest'
import { filterTasks } from '@/utils/task'
import { addDays, today } from '@/utils/date'
import type { Task, TaskFilterCriteria } from '@/types/task'

let nextId = 0

function makeTask(overrides: Partial<Task> = {}): Task {
  nextId += 1
  return {
    id: `t${nextId}`,
    title: 'Learn something',
    category: 'Frontend',
    status: 'todo',
    priority: 'mid',
    startDate: today(),
    dueDate: addDays(today(), 7),
    estimatedHours: 4,
    note: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

/** Everything off: nothing is narrowed. */
const ALL: TaskFilterCriteria = { status: 'all', category: 'all', query: '' }

const titlesOf = (tasks: readonly Task[]) => tasks.map((task) => task.title)

describe('filterTasks', () => {
  describe('with no criteria', () => {
    it('returns every task', () => {
      const tasks = [makeTask(), makeTask(), makeTask()]
      expect(filterTasks(tasks, ALL)).toHaveLength(3)
    })

    it('preserves the input order', () => {
      const tasks = [makeTask({ title: 'a' }), makeTask({ title: 'b' }), makeTask({ title: 'c' })]
      expect(titlesOf(filterTasks(tasks, ALL))).toEqual(['a', 'b', 'c'])
    })

    it('returns an empty array for an empty input', () => {
      expect(filterTasks([], ALL)).toEqual([])
    })
  })

  describe('status', () => {
    const tasks = [
      makeTask({ title: 'todo one', status: 'todo' }),
      makeTask({ title: 'todo two', status: 'todo' }),
      makeTask({ title: 'doing one', status: 'doing' }),
      makeTask({ title: 'done one', status: 'done' }),
    ]

    it.each([
      ['todo', ['todo one', 'todo two']],
      ['doing', ['doing one']],
      ['done', ['done one']],
    ] as const)('keeps only %s', (status, expected) => {
      expect(titlesOf(filterTasks(tasks, { ...ALL, status }))).toEqual(expected)
    })

    it('keeps everything when set to all', () => {
      expect(filterTasks(tasks, { ...ALL, status: 'all' })).toHaveLength(4)
    })

    it('returns nothing when no task has that status', () => {
      const onlyTodo = [makeTask({ status: 'todo' })]
      expect(filterTasks(onlyTodo, { ...ALL, status: 'done' })).toEqual([])
    })
  })

  describe('category', () => {
    const tasks = [
      makeTask({ title: 'fe', category: 'Frontend' }),
      makeTask({ title: 'be', category: 'Backend' }),
      makeTask({ title: 'db', category: 'Database' }),
      makeTask({ title: 'fe two', category: 'Frontend' }),
    ]

    it('keeps only the chosen category', () => {
      expect(titlesOf(filterTasks(tasks, { ...ALL, category: 'Frontend' }))).toEqual([
        'fe',
        'fe two',
      ])
    })

    it('matches a category whose name contains a slash', () => {
      const infra = [makeTask({ title: 'k8s', category: 'Infra / Cloud' })]
      expect(filterTasks(infra, { ...ALL, category: 'Infra / Cloud' })).toHaveLength(1)
    })

    it('keeps everything when set to all', () => {
      expect(filterTasks(tasks, { ...ALL, category: 'all' })).toHaveLength(4)
    })
  })

  describe('query', () => {
    const tasks = [
      makeTask({ title: 'Learn Docker', note: 'multi-stage builds' }),
      makeTask({ title: 'Learn SQL', note: 'read EXPLAIN output' }),
      makeTask({ title: 'Sit the CKAD exam', note: '' }),
    ]

    it('matches against the title', () => {
      expect(titlesOf(filterTasks(tasks, { ...ALL, query: 'docker' }))).toEqual(['Learn Docker'])
    })

    it('matches against the note', () => {
      expect(titlesOf(filterTasks(tasks, { ...ALL, query: 'EXPLAIN' }))).toEqual(['Learn SQL'])
    })

    it('is case-insensitive in both directions', () => {
      expect(filterTasks(tasks, { ...ALL, query: 'DOCKER' })).toHaveLength(1)
      expect(filterTasks(tasks, { ...ALL, query: 'explain' })).toHaveLength(1)
    })

    it('matches a substring, not just a whole word', () => {
      expect(filterTasks(tasks, { ...ALL, query: 'ock' })).toHaveLength(1)
    })

    it('trims surrounding whitespace before matching', () => {
      expect(filterTasks(tasks, { ...ALL, query: '   docker  ' })).toHaveLength(1)
    })

    it('treats a whitespace-only query as no query', () => {
      expect(filterTasks(tasks, { ...ALL, query: '   ' })).toHaveLength(3)
    })

    it('returns nothing when the text appears nowhere', () => {
      expect(filterTasks(tasks, { ...ALL, query: 'kubernetes' })).toEqual([])
    })

    it('can span the title and note, which are joined by a space', () => {
      // Documented behaviour: the haystack is `${title} ${note}`.
      expect(filterTasks(tasks, { ...ALL, query: 'Docker multi-stage' })).toHaveLength(1)
    })

    it('does not match across a gap that is not really adjacent', () => {
      expect(filterTasks(tasks, { ...ALL, query: 'Docker EXPLAIN' })).toEqual([])
    })

    it('matches a task with an empty note', () => {
      expect(titlesOf(filterTasks(tasks, { ...ALL, query: 'CKAD' }))).toEqual(['Sit the CKAD exam'])
    })
  })

  describe('combining criteria', () => {
    const tasks = [
      makeTask({ title: 'Learn Docker', category: 'Infra / Cloud', status: 'todo' }),
      makeTask({ title: 'Learn Docker deeply', category: 'Infra / Cloud', status: 'done' }),
      makeTask({ title: 'Learn Docker on the backend', category: 'Backend', status: 'todo' }),
      makeTask({ title: 'Learn SQL', category: 'Database', status: 'todo' }),
    ]

    it('ANDs status and category', () => {
      const result = filterTasks(tasks, { ...ALL, status: 'todo', category: 'Infra / Cloud' })
      expect(titlesOf(result)).toEqual(['Learn Docker'])
    })

    it('ANDs all three criteria', () => {
      const result = filterTasks(tasks, {
        status: 'todo',
        category: 'Backend',
        query: 'docker',
      })
      expect(titlesOf(result)).toEqual(['Learn Docker on the backend'])
    })

    it('returns nothing when the criteria cannot be satisfied together', () => {
      const result = filterTasks(tasks, { status: 'done', category: 'Database', query: 'sql' })
      expect(result).toEqual([])
    })
  })

  describe('purity', () => {
    it('does not mutate the input array', () => {
      const tasks = [makeTask({ status: 'todo' }), makeTask({ status: 'done' })]
      const snapshot = [...tasks]
      filterTasks(tasks, { ...ALL, status: 'todo' })
      expect(tasks).toEqual(snapshot)
    })

    it('returns a new array rather than the input', () => {
      const tasks = [makeTask()]
      expect(filterTasks(tasks, ALL)).not.toBe(tasks)
    })

    it('returns the same task objects, not copies', () => {
      const task = makeTask()
      expect(filterTasks([task], ALL)[0]).toBe(task)
    })
  })
})
