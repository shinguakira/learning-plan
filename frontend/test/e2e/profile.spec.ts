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

const skillsIn = (page: Page) => page.getByRole('region', { name: 'Skills' })

/**
 * Every spec below starts from an empty page on purpose: `useSkills` seeds both
 * lists from the backend, and these run without one, so the page falls back to
 * empty and everything on screen is something the test added. Start the backend
 * on :3001 and they will fail - that is expected, not a regression.
 */

test('starts with no skills registered', async ({ page }) => {
  await expect(page.getByText('No skills registered yet')).toBeVisible()
  await expect(skillsIn(page).getByRole('listitem')).toHaveCount(0)
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
  await expect(skillsIn(page).getByRole('listitem')).toHaveCount(1)
})

test('refuses a custom skill that duplicates a predefined one', async ({ page }) => {
  await chooseOption(page, 'Skill', 'Go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await chooseOption(page, 'Skill', 'Other')
  await page.getByLabel('Custom skill').fill('go')
  await page.getByRole('button', { name: 'Add skill' }).click()

  await expect(page.getByText('Already registered')).toBeVisible()
  await expect(skillsIn(page).getByRole('listitem')).toHaveCount(1)
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

const jobsIn = (page: Page) => page.getByRole('region', { name: 'Job history' })

async function addJob(
  page: Page,
  values: { company: string; title: string; started: string; ended?: string },
) {
  await page.getByLabel('Company').fill(values.company)
  await page.getByLabel('Job title').fill(values.title)
  await page.getByLabel('Started').fill(values.started)
  if (values.ended !== undefined) await page.getByLabel('Ended').fill(values.ended)
  await page.getByRole('button', { name: 'Add job' }).click()
}

test('starts with no job history - it comes from the backend, not the frontend', async ({
  page,
}) => {
  await expect(page.getByText('No job history yet')).toBeVisible()
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(0)
  await expect(jobsIn(page).getByText('Where you have worked.')).toBeVisible()
})

test('adds a role to the list', async ({ page }) => {
  await addJob(page, {
    company: 'Westfield Robotics',
    title: 'Platform Engineer',
    started: '2022-05-01',
    ended: '2023-01-31',
  })

  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(1)
  await expect(jobsIn(page).getByText('May 2022 - January 2023')).toBeVisible()
})

test('puts a newer role above an older one', async ({ page }) => {
  await addJob(page, {
    company: 'Older Inc',
    title: 'Oldest Role',
    started: '1990-01-01',
    ended: '1991-01-31',
  })
  await addJob(page, { company: 'Newer Inc', title: 'Newest Role', started: '2099-01-01' })

  const headings = jobsIn(page).getByRole('heading', { level: 3 })
  await expect(headings.first()).toHaveText('Newest Role')
  await expect(headings.last()).toHaveText('Oldest Role')
})

test('marks a role with no end date as current', async ({ page }) => {
  await addJob(page, { company: 'Ongoing Ltd', title: 'Open Ended', started: '2025-03-01' })

  const added = jobsIn(page).getByRole('listitem').filter({ hasText: 'Open Ended' })
  await expect(added.getByText('Current')).toBeVisible()
  await expect(added.getByText('March 2025 - Present')).toBeVisible()
})

test('refuses a job with no company or title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add job' }).click()

  await expect(page.getByText('Enter a company')).toBeVisible()
  await expect(page.getByText('Enter a job title')).toBeVisible()
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(0)
})

test('removes the role you asked to remove', async ({ page }) => {
  await addJob(page, { company: 'Temp Co', title: 'Removable Role', started: '2015-01-01' })
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(1)

  await page.getByRole('button', { name: 'Remove Removable Role at Temp Co' }).click()

  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(0)
})

test('starts fresh on a reload - job edits are not persisted', async ({ page }) => {
  await addJob(page, { company: 'Temp Co', title: 'Vanishing Role', started: '2015-01-01' })
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(1)

  await page.reload()

  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(0)
})
