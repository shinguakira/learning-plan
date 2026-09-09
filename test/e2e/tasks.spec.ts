import { expect, test } from '@playwright/test'

/**
 * Every test starts in a fresh browser context, so localStorage is empty and the
 * seed data is re-created: 7 tasks, 1 of them done.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()
})

test('seeds sample tasks on a first visit', async ({ page }) => {
  await expect(page.getByText('7 shown')).toBeVisible()
  await expect(page.getByText('1 of 7 done')).toBeVisible()
  await expect(page.getByText('14%')).toBeVisible()
})

test('adds a task', async ({ page }) => {
  await page.getByLabel('Title').fill('Read the Rust ownership chapter')
  await page.getByRole('button', { name: 'Add task' }).click()

  await expect(page.getByText('Read the Rust ownership chapter')).toBeVisible()
  await expect(page.getByText('8 shown')).toBeVisible()
  // The form resets after a successful submit.
  await expect(page.getByLabel('Title')).toHaveValue('')
})

test('refuses a task with no title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add task' }).click()

  await expect(page.getByText('Enter a title')).toBeVisible()
  await expect(page.getByText('7 shown')).toBeVisible()
})

test('deletes a task behind a confirm step', async ({ page }) => {
  const title = 'Run two full AWS SAA practice exams'

  await page.getByRole('button', { name: `Delete "${title}"` }).click()
  // Still there until the confirm is clicked.
  await expect(page.getByText(title)).toBeVisible()

  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByText(title)).toHaveCount(0)
  await expect(page.getByText('6 shown')).toBeVisible()
})

test('cycles a task status', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Cycle status (currently: To do)' })).toHaveCount(4)

  await page.getByRole('button', { name: 'Cycle status (currently: To do)' }).first().click()

  await expect(page.getByRole('button', { name: 'Cycle status (currently: To do)' })).toHaveCount(3)
  await expect(
    page.getByRole('button', { name: 'Cycle status (currently: In progress)' }),
  ).toHaveCount(3)
})

test('filters by search text', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('docker')

  await expect(page.getByText('1 shown of 7')).toBeVisible()
  await expect(page.getByText('Build a local environment with Docker and docker compose')).toBeVisible()
})

test('filters by status', async ({ page }) => {
  await page.getByRole('button', { name: 'Done', exact: true }).click()

  await expect(page.getByText('1 shown of 7')).toBeVisible()
  await expect(
    page.getByText('Get React state management straight (useState / useReducer / Context)'),
  ).toBeVisible()
})

test('filters by category', async ({ page }) => {
  await page.getByLabel('Filter by category').selectOption('Database')

  await expect(page.getByText('1 shown of 7')).toBeVisible()
  await expect(page.getByText('Learn to read SQL execution plans and index properly')).toBeVisible()
})

test('switches to the timeline view', async ({ page }) => {
  await page.getByRole('button', { name: 'Timeline' }).click()

  await expect(page.getByText('Task', { exact: true })).toBeVisible()
  await expect(page.getByText('Today')).toBeVisible()
  await expect(page.getByTitle('Run two full AWS SAA practice exams').first()).toBeVisible()
  // Sorting is fixed to start date on the timeline, so the control is disabled.
  await expect(page.getByLabel('Sort order')).toBeDisabled()
})

test('persists tasks across a reload', async ({ page }) => {
  await page.getByLabel('Title').fill('Persisted task')
  await page.getByRole('button', { name: 'Add task' }).click()
  await expect(page.getByText('Persisted task')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Persisted task')).toBeVisible()
  await expect(page.getByText('8 shown')).toBeVisible()
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
  await expect(page.getByText('0 shown')).toBeVisible()

  await page.getByRole('button', { name: 'Reload sample data' }).click()

  await expect(page.getByText('7 shown')).toBeVisible()
})
