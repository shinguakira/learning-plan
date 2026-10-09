import { expect, test } from '@playwright/test'

const sample = {
  title: 'Task from the backend',
  category: 'Backend',
  status: 'todo',
  priority: 'mid',
  estimatedHours: 2,
  note: 'Returned by the task endpoint',
  offsetStart: 0,
  span: 3,
}

test('loads backend samples and preserves a task added while loading', async ({ page }) => {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/api/tasks', async (route) => {
    await gate
    await route.fulfill({ json: { tasks: [sample] } })
  })
  await page.goto('/tasks')
  await expect(page.getByRole('status')).toHaveText('Loading sample tasks…')
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await page.getByLabel('Title').fill('Added during loading')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  release()
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.getByText(sample.title, { exact: true })).toBeVisible()
  await expect(page.getByText('Added during loading', { exact: true })).toBeVisible()
  await expect(page.getByText('2 shown', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Reload sample data' }).click()
  await expect(page.getByText('Added during loading', { exact: true })).toHaveCount(0)
  await expect(page.getByText(sample.title, { exact: true })).toBeVisible()
  await expect(page.getByText('1 shown', { exact: true })).toBeVisible()
})

test('Delete all suppresses a pending seed but samples can still be restored', async ({ page }) => {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/api/tasks', async (route) => {
    await gate
    await route.fulfill({ json: { tasks: [sample] } })
  })
  await page.goto('/tasks')
  await expect(page.getByRole('status')).toBeVisible()
  await page.getByRole('button', { name: 'Delete all' }).click()
  release()
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.getByText(sample.title, { exact: true })).toHaveCount(0)
  await expect(page.getByText('0 shown', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Reload sample data' }).click()
  await expect(page.getByText(sample.title, { exact: true })).toBeVisible()
})

test('shows a failed request and retries without losing local tasks', async ({ page }) => {
  let fail = true
  await page.route('**/api/tasks', (route) =>
    fail
      ? route.fulfill({ status: 503, json: { error: 'Unavailable' } })
      : route.fulfill({ json: { tasks: [sample] } }),
  )
  await page.goto('/tasks')
  await expect(page.getByRole('alert')).toContainText('Request failed (503)')
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await page.getByLabel('Title').fill('Keep my local task')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  fail = false
  await page.getByRole('button', { name: 'Reload sample data' }).click()
  await expect(page.getByText(sample.title, { exact: true })).toBeVisible()
  await expect(page.getByText('Keep my local task', { exact: true })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('displays a connection error when the backend is unreachable', async ({ page }) => {
  await page.route('**/api/tasks', (route) => route.abort('failed'))
  await page.goto('/tasks')
  await expect(page.getByRole('alert')).toContainText('Could not reach the backend. Is it running?')
  await expect(page.getByRole('status')).toHaveCount(0)
})
