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

test.describe('phone layout', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('collapses the nav behind the menu button', async ({ page }) => {
    await page.goto('/tasks')

    // The tab row is gone; the one button stands in for it.
    await expect(page.getByRole('link', { name: 'AI chat' })).toBeHidden()
    const menu = page.getByRole('button', { name: 'Menu' })
    await expect(menu).toBeVisible()

    await menu.click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('link')).toHaveText(['Tasks', 'AI chat', 'Profile'])
  })

  test('navigates from the menu and closes it behind you', async ({ page }) => {
    await page.goto('/tasks')

    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Profile' }).click()

    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})

test('shows the nav inline and no menu button on a wide screen', async ({ page }) => {
  await page.goto('/tasks')

  await expect(page.getByRole('link', { name: 'AI chat' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden()
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
