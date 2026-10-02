import { expect, test } from '@playwright/test'

/**
 * Pixel snapshots of the two initial renders asked for: the tasks page itself,
 * and the Add Task modal right after it opens. Nothing beyond that - no
 * interaction inside the modal, no other pages.
 */

test('tasks page, initial render', async ({ page }) => {
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()

  await expect(page).toHaveScreenshot('tasks-page.png')
})

test('add task modal, initial render', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Add Task' })).toBeVisible()

  await expect(page).toHaveScreenshot('add-task-modal.png')
})
