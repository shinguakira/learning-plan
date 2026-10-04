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

/**
 * The forms are usable while the seed request is still in flight, so the seed has
 * to merge with whatever is already on screen. These stub the endpoint with a
 * delay to open that window deliberately; the rest of the file runs without a
 * backend, where the request simply fails.
 */
async function seedSlowly(page: Page) {
  await page.route('**/api/skills', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        skills: [
          {
            id: 's1',
            name: 'Seeded Skill',
            level: 'expert',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        jobs: [
          {
            id: 'j1',
            company: 'Seeded Co',
            title: 'Seeded Role',
            employmentType: 'full-time',
            startDate: '2020-01-01',
            endDate: '2021-01-31',
            summary: 'Seeded.',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      }),
    })
  })
}

test('keeps a job added while the seed request is still loading', async ({ page }) => {
  await seedSlowly(page)
  await page.goto('/profile')

  await addJob(page, { company: 'Typed Co', title: 'Typed Role', started: '2023-01-01' })
  await expect(jobsIn(page).getByText('Typed Role')).toBeVisible()

  // The seed lands after it; both must be there.
  await expect(jobsIn(page).getByText('Seeded Role')).toBeVisible()
  await expect(jobsIn(page).getByText('Typed Role')).toBeVisible()
  await expect(jobsIn(page).getByRole('listitem')).toHaveCount(2)
})

test('keeps a skill added while the seed request is still loading', async ({ page }) => {
  await seedSlowly(page)
  await page.goto('/profile')

  await chooseOption(page, 'Skill', 'Rust')
  await page.getByRole('button', { name: 'Add skill' }).click()

  // The seed lands after it; both must be there, each under its own level.
  await expect(
    page.getByRole('region', { name: 'Beginner skills' }).getByText('Rust'),
  ).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Expert skills' }).getByText('Seeded Skill'),
  ).toBeVisible()
})
