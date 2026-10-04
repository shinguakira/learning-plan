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

test('lists the sample work history, most recent first', async ({ page }) => {
  const jobs = jobsIn(page)

  await expect(jobs.getByRole('listitem')).toHaveCount(4)
  await expect(jobs.getByRole('heading', { level: 3 })).toHaveText([
    'Senior Frontend Engineer',
    'Full Stack Engineer',
    'Web Developer',
    'Software Engineer Intern',
  ])
})

test('marks the open-ended role as current and dates the finished ones', async ({ page }) => {
  const jobs = jobsIn(page)

  const current = jobs.getByRole('listitem').first()
  await expect(current.getByText('Current')).toBeVisible()
  await expect(current.getByText('April 2024 - Present')).toBeVisible()

  const finished = jobs.getByRole('listitem').nth(1)
  await expect(finished.getByText('Current')).toHaveCount(0)
  await expect(finished.getByText('July 2021 - March 2024')).toBeVisible()
})

test('adds a job and places it by its start date', async ({ page }) => {
  const jobs = jobsIn(page)

  await page.getByLabel('Company').fill('Hoshino Robotics')
  await page.getByLabel('Job title').fill('Platform Engineer')
  await page.getByLabel('Started').fill('2022-05-01')
  await page.getByLabel('Ended').fill('2023-01-31')
  await page.getByRole('button', { name: 'Add job' }).click()

  await expect(jobs.getByRole('listitem')).toHaveCount(5)
  // Started 2022-05, so it sits between the 2024 and the 2021 role.
  await expect(jobs.getByRole('heading', { level: 3 }).nth(1)).toHaveText('Platform Engineer')
  await expect(jobs.getByText('May 2022 - January 2023')).toBeVisible()
})

test('refuses a job with no company or title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add job' }).click()

  await expect(page.getByText('Enter a company')).toBeVisible()
  await expect(page.getByText('Enter a job title')).toBeVisible()
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(4)
})

test('does not accept a job that ends before it starts', async ({ page }) => {
  await page.getByLabel('Company').fill('Acme')
  await page.getByLabel('Job title').fill('Engineer')
  await page.getByLabel('Started').fill('2024-06-01')
  await page.getByLabel('Ended').fill('2024-01-01')
  await page.getByRole('button', { name: 'Add job' }).click()

  // The Ended input carries min=start, so the browser refuses the submit before
  // our own message can show. Either way the role must not reach the list.
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(4)
})

test('removes a job', async ({ page }) => {
  const jobs = jobsIn(page)

  await page.getByRole('button', { name: 'Remove Web Developer at Studio Yotsuba' }).click()

  await expect(jobs.getByRole('listitem')).toHaveCount(3)
  await expect(jobs.getByText('Web Developer')).toHaveCount(0)
})

test('restores the sample work history on a reload - nothing is persisted', async ({ page }) => {
  await page.getByRole('button', { name: 'Remove Web Developer at Studio Yotsuba' }).click()
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(3)

  await page.reload()

  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(4)
})
