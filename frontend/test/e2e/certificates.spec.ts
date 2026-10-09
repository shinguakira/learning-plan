import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const certificatesIn = (page: Page) => page.getByRole('region', { name: 'Certificates' })

async function addCertificate(page: Page, name: string, issuer: string) {
  const section = certificatesIn(page)
  await section.getByLabel('Title', { exact: true }).fill(name)
  await section.getByLabel('Issued by').fill(issuer)
  await section.getByLabel('Date earned').fill('2025-06-30')
  await section.getByRole('button', { name: 'Add certificate' }).click()
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/profile', (route) =>
    route.fulfill({ json: { skills: [], jobs: [], certificates: [] } }),
  )
  await page.goto('/profile')
  await expect(certificatesIn(page).getByText('No certificates yet')).toBeVisible()
})

test('adds trimmed values and resets the form', async ({ page }) => {
  await addCertificate(page, '  Data Science  ', '  Academy  ')
  const section = certificatesIn(page)
  const item = section.getByRole('listitem')
  await expect(item).toHaveCount(1)
  await expect(item.getByRole('heading')).toHaveText('Data Science')
  await expect(item.getByText('Academy', { exact: true })).toBeVisible()
  await expect(item.getByText('2025-06-30')).toBeVisible()
  for (const label of ['Title', 'Issued by', 'Date earned']) {
    await expect(section.getByLabel(label, { exact: true })).toHaveValue('')
  }
})

test('rejects blank values and recovers after correction', async ({ page }) => {
  const section = certificatesIn(page)
  await section.getByLabel('Title', { exact: true }).fill('   ')
  await section.getByLabel('Issued by').fill('   ')
  await section.getByRole('button', { name: 'Add certificate' }).click()
  for (const message of [
    'Enter a certificate title',
    'Enter an issuer',
    'Enter a valid date earned',
  ]) {
    await expect(section.getByText(message, { exact: true })).toBeVisible()
  }
  await expect(section.getByRole('listitem')).toHaveCount(0)
  await addCertificate(page, 'Valid Certificate', 'Academy')
  await expect(section.getByRole('listitem')).toHaveCount(1)
  await expect(section.getByText('Enter a valid date earned')).toHaveCount(0)
})

test('removes the correct certificate with a shared title and returns to empty', async ({
  page,
}) => {
  await addCertificate(page, 'Data Science', 'First Academy')
  await addCertificate(page, 'Data Science', 'Second Academy')
  const section = certificatesIn(page)
  await expect(section.getByRole('listitem')).toHaveCount(2)
  await section.getByRole('button', { name: 'Remove Data Science from First Academy' }).click()
  await expect(section.getByRole('listitem')).toHaveCount(1)
  await expect(
    section.getByRole('listitem').getByText('Second Academy', { exact: true }),
  ).toBeVisible()
  await section.getByRole('button', { name: 'Remove Data Science from Second Academy' }).click()
  await expect(section.getByText('No certificates yet')).toBeVisible()
})

test('merges a certificate added during loading with the backend seed', async ({ page }) => {
  let releaseSeed = () => {}
  const ready = new Promise<void>((resolve) => {
    releaseSeed = resolve
  })
  await page.route('**/api/profile', async (route) => {
    await ready
    await route.fulfill({
      json: {
        skills: [],
        jobs: [],
        certificates: [
          {
            id: 'seed-certificate',
            name: 'Seeded Certificate',
            issuer: 'Seed Academy',
            dateEarned: '2024-01-01',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    })
  })
  await page.goto('/profile')
  await expect(certificatesIn(page).getByText('Loading certificates…')).toBeVisible()
  try {
    await addCertificate(page, 'Typed Certificate', 'Typed Academy')
  } finally {
    releaseSeed()
  }
  const section = certificatesIn(page)
  await expect(section.getByRole('listitem')).toHaveCount(2)
  await expect(section.getByRole('heading', { name: 'Typed Certificate' })).toBeVisible()
  await expect(section.getByRole('heading', { name: 'Seeded Certificate' })).toBeVisible()
  await section.getByRole('button', { name: 'Remove Seeded Certificate from Seed Academy' }).click()
  await expect(section.getByRole('listitem')).toHaveCount(1)
  await expect(section.getByRole('heading', { name: 'Typed Certificate' })).toBeVisible()
})

test('certificate edits reset on reload', async ({ page }) => {
  await addCertificate(page, 'Temporary Certificate', 'Academy')
  await expect(certificatesIn(page).getByRole('listitem')).toHaveCount(1)
  await page.reload()
  await expect(certificatesIn(page).getByText('No certificates yet')).toBeVisible()
})

test('certificate form fits a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await expect(certificatesIn(page).getByLabel('Issued by')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await addCertificate(page, 'Mobile Certificate', 'Academy')
  await expect(
    certificatesIn(page).getByRole('heading', { name: 'Mobile Certificate' }),
  ).toBeVisible()
})
