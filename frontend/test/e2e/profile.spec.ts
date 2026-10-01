import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/** shadcn's Select is a Radix listbox, not a native <select>. */
async function chooseOption(page: Page, selectLabel: string, option: string) {
  await page.getByRole('combobox', { name: selectLabel }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
})

test('starts with no skills registered', async ({ page }) => {
  await expect(page.getByText('No skills registered yet')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(0)
})

test('registers a predefined skill under its level group', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Docker')
  await page.getByRole('button', { name: 'Add skill' }).click()

  const group = page.getByRole('region', { name: 'Beginner skills' })
  await expect(group.getByText('Beginner', { exact: true })).toBeVisible()
  await expect(group.getByText('Docker')).toBeVisible()
})

test('registers a predefined skill at a chosen level', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Rust')
  await chooseOption(page, 'Level', 'Advanced')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(
    page.getByRole('region', { name: 'Advanced skills' }).getByText('Rust'),
  ).toBeVisible()
})

test('separates skills into their own level groups', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Docker')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await chooseOption(page, 'Skill', 'Rust')
  await chooseOption(page, 'Level', 'Advanced')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(
    page.getByRole('region', { name: 'Beginner skills' }).getByText('Docker'),
  ).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Advanced skills' }).getByText('Rust'),
  ).toBeVisible()
  // Each group only holds its own level.
  await expect(page.getByRole('region', { name: 'Beginner skills' }).getByText('Rust')).toHaveCount(
    0,
  )
  await expect(
    page.getByRole('region', { name: 'Advanced skills' }).getByText('Docker'),
  ).toHaveCount(0)
})

test('registers a custom skill via Other', async ({ page }) => {
  await expect(page.getByLabel('Custom skill')).toHaveCount(0)

  await chooseOption(page, 'Skill', 'Other')
  await page.getByLabel('Custom skill').fill('Zig')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(page.getByRole('region', { name: 'Beginner skills' }).getByText('Zig')).toBeVisible()
  // Picking "Other" again for the next entry starts from a blank field.
  await chooseOption(page, 'Skill', 'Other')
  await expect(page.getByLabel('Custom skill')).toHaveValue('')
})

test('refuses an Other skill with no name', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Other')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(page.getByText('Enter a skill name')).toBeVisible()
  await expect(page.getByText('No skills registered yet')).toBeVisible()
})

test('refuses a duplicate predefined skill', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await chooseOption(page, 'Skill', 'Go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(page.getByText('Already registered')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(1)
})

test('refuses a custom skill that duplicates a predefined one', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await chooseOption(page, 'Skill', 'Other')
  await page.getByLabel('Custom skill').fill('go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(page.getByText('Already registered')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(1)
})

test('removes a registered skill', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Docker')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await page.getByRole('button', { name: 'Remove Docker' }).click()

  await expect(page.getByText('No skills registered yet')).toBeVisible()
})

test('starts fresh on a reload - nothing is persisted', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Kubernetes')
  await page.getByRole('button', { name: 'Add skill' }).click()
  await expect(
    page.getByRole('region', { name: 'Beginner skills' }).getByText('Kubernetes'),
  ).toBeVisible()

  await page.reload()

  await expect(page.getByText('No skills registered yet')).toBeVisible()
})
