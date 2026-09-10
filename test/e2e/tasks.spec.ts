import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const SEED_COUNT = 300

/** The filter row reads "300 shown" or "12 shown of 300". */
async function shownCount(page: Page): Promise<number> {
  const text = await page.getByText(/^\d+ shown/).innerText()
  return Number(text.split(' ')[0])
}

/**
 * Every test starts in a fresh browser context, so localStorage is empty and the
 * seed data is re-created.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()
})

test('seeds the sample plan on a first visit', async ({ page }) => {
  expect(await shownCount(page)).toBe(SEED_COUNT)
  await expect(page.getByText(new RegExp(`^\\d+ of ${SEED_COUNT} done$`))).toBeVisible()
})

test('adds a task', async ({ page }) => {
  await page.getByLabel('Title').fill('Read the Rust ownership chapter')
  await page.getByRole('button', { name: 'Add task' }).click()

  await expect(page.getByText('Read the Rust ownership chapter')).toBeVisible()
  expect(await shownCount(page)).toBe(SEED_COUNT + 1)
  // The form resets after a successful submit.
  await expect(page.getByLabel('Title')).toHaveValue('')
})

test('refuses a task with no title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add task' }).click()

  await expect(page.getByText('Enter a title')).toBeVisible()
  expect(await shownCount(page)).toBe(SEED_COUNT)
})

test('deletes a task behind a confirm step', async ({ page }) => {
  // Narrow to one row first, so the deletion target is unambiguous.
  const title = 'Sit the CKAD exam'
  await page.getByLabel('Search tasks').fill(title)
  expect(await shownCount(page)).toBe(1)

  await page.getByRole('button', { name: `Delete "${title}"` }).click()
  // Still there until the confirm is clicked.
  await expect(page.getByText(title)).toBeVisible()

  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByText('No tasks to show')).toBeVisible()

  await page.getByLabel('Search tasks').fill('')
  expect(await shownCount(page)).toBe(SEED_COUNT - 1)
})

test('cycles a task status', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('Sit the CKAD exam')

  const todo = page.getByRole('button', { name: 'Cycle status (currently: To do)' })
  await expect(todo).toHaveCount(1)

  await todo.click()

  await expect(todo).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Cycle status (currently: In progress)' }),
  ).toHaveCount(1)
})

test('filters by search text', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('kubectl')

  const shown = await shownCount(page)
  expect(shown).toBeGreaterThan(0)
  expect(shown).toBeLessThan(SEED_COUNT)
  await expect(page.getByText(`${shown} shown of ${SEED_COUNT}`)).toBeVisible()
})

test('the status filters partition the whole list', async ({ page }) => {
  let sum = 0
  for (const label of ['To do', 'In progress', 'Done']) {
    await page.getByRole('button', { name: label, exact: true }).click()
    sum += await shownCount(page)
  }
  expect(sum).toBe(SEED_COUNT)
})

test('the category filters partition the whole list', async ({ page }) => {
  const categories = [
    'Frontend',
    'Backend',
    'Infra / Cloud',
    'Database',
    'CS Fundamentals',
    'Certification',
  ]
  let sum = 0
  for (const category of categories) {
    await page.getByLabel('Filter by category').selectOption(category)
    sum += await shownCount(page)
  }
  expect(sum).toBe(SEED_COUNT)
})

test('switches to the timeline view', async ({ page }) => {
  await page.getByRole('button', { name: 'Timeline' }).click()

  await expect(page.getByText('Task', { exact: true })).toBeVisible()
  await expect(page.getByText('Today')).toBeVisible()
  await expect(page.getByTitle('Sit the CKAD exam').first()).toBeVisible()
  // Sorting is fixed to start date on the timeline, so the control is disabled.
  await expect(page.getByLabel('Sort order')).toBeDisabled()
})

test('persists tasks across a reload', async ({ page }) => {
  await page.getByLabel('Title').fill('Persisted task')
  await page.getByRole('button', { name: 'Add task' }).click()
  await expect(page.getByText('Persisted task')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Persisted task')).toBeVisible()
  expect(await shownCount(page)).toBe(SEED_COUNT + 1)
})

test('remembers the chosen view across a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Timeline' }).click()
  await expect(page.getByText('Today')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Today')).toBeVisible()
})

test('clears every task and restores the samples', async ({ page }) => {
  await page.getByRole('button', { name: 'Delete all' }).click()

  await expect(page.getByText('No tasks to show')).toBeVisible()
  expect(await shownCount(page)).toBe(0)

  await page.getByRole('button', { name: 'Reload sample data' }).click()

  expect(await shownCount(page)).toBe(SEED_COUNT)
})
