import { describe, expect, it } from 'vitest'
import { filterTasks, sortTasks } from '@/utils/task'
import { addDays, today } from '@/utils/date'
import type { Task } from '@/types/task'

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

const titlesOf = (tasks: readonly Task[]) => tasks.map((task) => task.title)

describe('sortTasks', () => {
  describe('by due date', () => {
    it('puts the nearest deadline first', () => {
      const tasks = [
        makeTask({ title: 'late', dueDate: addDays(today(), 30) }),
        makeTask({ title: 'soon', dueDate: addDays(today(), 1) }),
        makeTask({ title: 'mid', dueDate: addDays(today(), 10) }),
      ]
      expect(titlesOf(sortTasks(tasks, 'due'))).toEqual(['soon', 'mid', 'late'])
    })

    it('orders overdue tasks ahead of upcoming ones', () => {
      const tasks = [
        makeTask({ title: 'upcoming', dueDate: addDays(today(), 5) }),
        makeTask({ title: 'overdue', dueDate: addDays(today(), -5) }),
      ]
      expect(titlesOf(sortTasks(tasks, 'due'))).toEqual(['overdue', 'upcoming'])
    })

    it('compares dates chronologically, not as raw strings across months', () => {
      // '2026-09-02' vs '2026-10-01': a naive numeric compare on the day would
      // get this wrong. The ISO layout makes a string compare correct.
      const tasks = [
        makeTask({ title: 'october', dueDate: addDays(today(), 60) }),
        makeTask({ title: 'september', dueDate: addDays(today(), 2) }),
      ]
      expect(titlesOf(sortTasks(tasks, 'due'))).toEqual(['september', 'october'])
    })
  })

  describe('by start date', () => {
    it('puts the earliest start first', () => {
      const tasks = [
        makeTask({ title: 'third', startDate: addDays(today(), 10) }),
        makeTask({ title: 'first', startDate: addDays(today(), -10) }),
        makeTask({ title: 'second', startDate: today() }),
      ]
      expect(titlesOf(sortTasks(tasks, 'start'))).toEqual(['first', 'second', 'third'])
    })

    it('ignores the due date', () => {
      const tasks = [
        makeTask({
          title: 'starts later',
          startDate: addDays(today(), 5),
          dueDate: addDays(today(), 6),
        }),
        makeTask({ title: 'starts sooner', startDate: today(), dueDate: addDays(today(), 90) }),
      ]
      expect(titlesOf(sortTasks(tasks, 'start'))).toEqual(['starts sooner', 'starts later'])
    })
  })

  describe('by priority', () => {
    it('orders high, then medium, then low', () => {
      const tasks = [
        makeTask({ title: 'low', priority: 'low' }),
        makeTask({ title: 'high', priority: 'high' }),
        makeTask({ title: 'mid', priority: 'mid' }),
      ]
      expect(titlesOf(sortTasks(tasks, 'priority'))).toEqual(['high', 'mid', 'low'])
    })

    it('breaks ties on the due date', () => {
      const tasks = [
        makeTask({ title: 'high late', priority: 'high', dueDate: addDays(today(), 20) }),
        makeTask({ title: 'high soon', priority: 'high', dueDate: addDays(today(), 2) }),
        makeTask({ title: 'low soon', priority: 'low', dueDate: addDays(today(), 1) }),
      ]
      // Priority wins outright; the due date only separates equal priorities.
      expect(titlesOf(sortTasks(tasks, 'priority'))).toEqual(['high soon', 'high late', 'low soon'])
    })
  })

  describe('by creation time', () => {
    it('puts the most recently added first', () => {
      const tasks = [
        makeTask({ title: 'oldest', createdAt: '2026-01-01T00:00:00.000Z' }),
        makeTask({ title: 'newest', createdAt: '2026-03-01T00:00:00.000Z' }),
        makeTask({ title: 'middle', createdAt: '2026-02-01T00:00:00.000Z' }),
      ]
      expect(titlesOf(sortTasks(tasks, 'created'))).toEqual(['newest', 'middle', 'oldest'])
    })

    it('separates timestamps within the same day', () => {
      const tasks = [
        makeTask({ title: 'morning', createdAt: '2026-01-01T09:00:00.000Z' }),
        makeTask({ title: 'evening', createdAt: '2026-01-01T21:00:00.000Z' }),
      ]
      expect(titlesOf(sortTasks(tasks, 'created'))).toEqual(['evening', 'morning'])
    })
  })

  describe('purity', () => {
    it('does not mutate the input array', () => {
      const tasks = [
        makeTask({ title: 'b', dueDate: addDays(today(), 5) }),
        makeTask({ title: 'a', dueDate: addDays(today(), 1) }),
      ]
      const snapshot = [...tasks]
      sortTasks(tasks, 'due')
      expect(tasks).toEqual(snapshot)
    })

    it('returns a new array rather than the input', () => {
      const tasks = [makeTask()]
      expect(sortTasks(tasks, 'due')).not.toBe(tasks)
    })

    it('handles an empty list', () => {
      expect(sortTasks([], 'priority')).toEqual([])
    })
  })
})

describe('the search pipeline', () => {
  // What the tasks page actually runs: narrow, then order.
  const tasks = [
    makeTask({
      title: 'Learn Docker layer caching',
      category: 'Infra / Cloud',
      status: 'todo',
      priority: 'low',
      dueDate: addDays(today(), 30),
    }),
    makeTask({
      title: 'Learn Docker multi-stage builds',
      category: 'Infra / Cloud',
      status: 'todo',
      priority: 'high',
      dueDate: addDays(today(), 40),
    }),
    makeTask({
      title: 'Learn Docker compose',
      category: 'Infra / Cloud',
      status: 'done',
      priority: 'high',
      dueDate: addDays(today(), 1),
    }),
    makeTask({ title: 'Learn SQL indexes', category: 'Database', status: 'todo' }),
  ]

  it('filters first, then orders what survives', () => {
    const narrowed = filterTasks(tasks, {
      status: 'todo',
      category: 'Infra / Cloud',
      query: 'docker',
    })
    expect(titlesOf(sortTasks(narrowed, 'priority'))).toEqual([
      'Learn Docker multi-stage builds',
      'Learn Docker layer caching',
    ])
  })

  it('orders only the survivors, never re-admitting a filtered-out task', () => {
    // 'Learn Docker compose' has the nearest due date but is filtered out by status.
    const narrowed = filterTasks(tasks, { status: 'todo', category: 'all', query: 'docker' })
    expect(titlesOf(sortTasks(narrowed, 'due'))).toEqual([
      'Learn Docker layer caching',
      'Learn Docker multi-stage builds',
    ])
  })

  it('yields an empty list when the filter removes everything', () => {
    const narrowed = filterTasks(tasks, { status: 'all', category: 'all', query: 'rust' })
    expect(sortTasks(narrowed, 'due')).toEqual([])
  })
})
