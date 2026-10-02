import { expect, test } from '@playwright/test'

test('redirects the root to the tasks page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()
})

test('redirects an unknown path to the tasks page', async ({ page }) => {
  await page.goto('/does-not-exist')

  await expect(page).toHaveURL(/\/tasks$/)
})

test('moves between the pages', async ({ page }) => {
  await page.goto('/tasks')

  await page.getByRole('link', { name: 'AI chat' }).click()
  await expect(page).toHaveURL(/\/chat$/)
  await expect(page.getByRole('heading', { name: 'AI chat' })).toBeVisible()

  await page.getByRole('link', { name: 'Profile' }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()

  await page.getByRole('link', { name: 'Tasks' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()
})

test('shows the app title from the environment', async ({ page }) => {
  await page.goto('/tasks')

  await expect(page).toHaveTitle('Learning Plan')
  await expect(page.getByText('Learning Plan')).toBeVisible()
})

test('defaults the header user to the first mock person and can switch', async ({ page }) => {
  await page.goto('/tasks')

  const userSelect = page.getByRole('combobox', { name: 'Active user' })
  await expect(userSelect).toHaveText('Sanjar')

  await userSelect.click()
  await page.getByRole('option', { name: 'Mike', exact: true }).click()
  await expect(userSelect).toHaveText('Mike')

  // Survives moving between pages - it belongs to the shared header, not one page.
  await page.getByRole('link', { name: 'Profile' }).click()
  await expect(userSelect).toHaveText('Mike')
})
