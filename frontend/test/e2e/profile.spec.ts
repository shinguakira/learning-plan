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

/** The page holds two lists, so a bare listitem query would span both. */
const skillsIn = (page: Page) => page.getByRole('region', { name: 'Skills' })

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

/** Every assertion below is relative to this, never to the size of the sample. */
async function jobCount(page: Page): Promise<number> {
  return jobsIn(page).getByRole('listitem').count()
}

async function fillJob(
  page: Page,
  values: { company: string; title: string; started: string; ended?: string },
) {
  await page.getByLabel('Company').fill(values.company)
  await page.getByLabel('Job title').fill(values.title)
  await page.getByLabel('Started').fill(values.started)
  if (values.ended !== undefined) await page.getByLabel('Ended').fill(values.ended)
}

test('shows a work history on load, one heading per role', async ({ page }) => {
  const jobs = jobsIn(page)
  const initial = await jobCount(page)

  expect(initial).toBeGreaterThan(0)
  await expect(jobs.getByRole('heading', { level: 3 })).toHaveCount(initial)
})

test('puts a newer role above an older one', async ({ page }) => {
  const jobs = jobsIn(page)

  await fillJob(page, { company: 'Later Inc', title: 'Newest Role', started: '2099-01-01' })
  await page.getByRole('button', { name: 'Add job' }).click()
  await fillJob(page, {
    company: 'Earlier Inc',
    title: 'Oldest Role',
    started: '1990-01-01',
    ended: '1991-01-31',
  })
  await page.getByRole('button', { name: 'Add job' }).click()

  const headings = jobs.getByRole('heading', { level: 3 })
  await expect(headings.first()).toHaveText('Newest Role')
  await expect(headings.last()).toHaveText('Oldest Role')
})

test('marks a role with no end date as current', async ({ page }) => {
  const jobs = jobsIn(page)

  await fillJob(page, { company: 'Ongoing Ltd', title: 'Open Ended', started: '2025-03-01' })
  await page.getByRole('button', { name: 'Add job' }).click()

  const added = jobs.getByRole('listitem').filter({ hasText: 'Open Ended' })
  await expect(added.getByText('Current')).toBeVisible()
  await expect(added.getByText('March 2025 - Present')).toBeVisible()
})

test('dates a finished role from both ends and does not call it current', async ({ page }) => {
  const jobs = jobsIn(page)

  await fillJob(page, {
    company: 'Done Ltd',
    title: 'Finished Role',
    started: '2021-07-01',
    ended: '2024-03-31',
  })
  await page.getByRole('button', { name: 'Add job' }).click()

  const added = jobs.getByRole('listitem').filter({ hasText: 'Finished Role' })
  await expect(added.getByText('July 2021 - March 2024')).toBeVisible()
  await expect(added.getByText('Current')).toHaveCount(0)
})

test('adds one role to the list', async ({ page }) => {
  const before = await jobCount(page)

  await fillJob(page, {
    company: 'Hoshino Robotics',
    title: 'Platform Engineer',
    started: '2022-05-01',
    ended: '2023-01-31',
  })
  await page.getByRole('button', { name: 'Add job' }).click()

  expect(await jobCount(page)).toBe(before + 1)
})

test('refuses a job with no company or title', async ({ page }) => {
  const before = await jobCount(page)

  await page.getByRole('button', { name: 'Add job' }).click()

  await expect(page.getByText('Enter a company')).toBeVisible()
  await expect(page.getByText('Enter a job title')).toBeVisible()
  expect(await jobCount(page)).toBe(before)
})

test('does not accept a job that ends before it starts', async ({ page }) => {
  const before = await jobCount(page)

  await fillJob(page, {
    company: 'Acme',
    title: 'Engineer',
    started: '2024-06-01',
    ended: '2024-01-01',
  })
  await page.getByRole('button', { name: 'Add job' }).click()

  // The Ended input carries min=start, so the browser refuses the submit before
  // our own message can show. Either way the role must not reach the list.
  expect(await jobCount(page)).toBe(before)
})

test('removes the role you asked to remove', async ({ page }) => {
  const jobs = jobsIn(page)
  const before = await jobCount(page)

  await fillJob(page, { company: 'Temp Co', title: 'Removable Role', started: '2015-01-01' })
  await page.getByRole('button', { name: 'Add job' }).click()
  expect(await jobCount(page)).toBe(before + 1)

  await page.getByRole('button', { name: 'Remove Removable Role at Temp Co' }).click()

  expect(await jobCount(page)).toBe(before)
  await expect(jobs.getByText('Removable Role')).toHaveCount(0)
})

test('restores the sample work history on a reload - nothing is persisted', async ({ page }) => {
  const before = await jobCount(page)

  await fillJob(page, { company: 'Temp Co', title: 'Vanishing Role', started: '2015-01-01' })
  await page.getByRole('button', { name: 'Add job' }).click()
  expect(await jobCount(page)).toBe(before + 1)

  await page.reload()

  expect(await jobCount(page)).toBe(before)
  await expect(jobsIn(page).getByText('Vanishing Role')).toHaveCount(0)
})
