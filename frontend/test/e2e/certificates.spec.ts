import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const certificatesIn = (page: Page) => page.getByRole('region', { name: 'Certificates' })

async function addCertificate(page: Page, name: string, issuer: string, credentialUrl?: string) {
  const section = certificatesIn(page)
  await section.getByLabel('Title', { exact: true }).fill(name)
  await section.getByLabel('Issued by').fill(issuer)
  await section.getByLabel('Date earned').fill('2025-06-30')
  if (credentialUrl !== undefined) await section.getByLabel('Credential URL').fill(credentialUrl)
  await section.getByRole('button', { name: 'Add certificate' }).click()
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/skills', (route) =>
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
  await expect(section.getByLabel('Credential URL')).toHaveValue('')
  await expect(section.getByRole('link')).toHaveCount(0)
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
  await page.route('**/api/skills', async (route) => {
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

test('shows a credential URL and opens it in a new tab', async ({ page }) => {
  const url = 'https://example.org/certificates/cs50-demo'
  await addCertificate(page, 'CS50x', 'Harvard University', `  ${url}  `)
  const section = certificatesIn(page)
  const link = section.getByRole('link', { name: 'View credential for CS50x' })
  await expect(link).toHaveAttribute('href', url)
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(section.getByLabel('Credential URL')).toHaveValue('')
  await page
    .context()
    .route(url, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<h1>Demo credential</h1>' }),
    )
  const popupReady = page.waitForEvent('popup')
  await link.click()
  const popup = await popupReady
  await expect(popup).toHaveURL(url)
  await expect(popup.getByRole('heading', { name: 'Demo credential' })).toBeVisible()
})

test('URL is optional and invalid URLs block submission', async ({ page }) => {
  const section = certificatesIn(page)
  for (const url of ['not-a-url', 'javascript:alert(1)', 'ftp://example.org/certificate']) {
    await addCertificate(page, 'CS50x', 'Harvard University', url)
    await expect(section.getByText('Enter a valid http:// or https:// URL')).toBeVisible()
    await expect(section.getByRole('listitem')).toHaveCount(0)
  }
  await section.getByLabel('Credential URL').fill('')
  await section.getByRole('button', { name: 'Add certificate' }).click()
  await expect(section.getByRole('listitem')).toHaveCount(1)
  await expect(section.getByRole('link')).toHaveCount(0)
})

test('renders a seeded credential link and hides unsafe seed URLs', async ({ page }) => {
  await page.route('**/api/skills', (route) =>
    route.fulfill({
      json: {
        skills: [],
        jobs: [],
        certificates: [
          {
            id: 'cs50',
            name: 'CS50x',
            issuer: 'Harvard University',
            dateEarned: '2025-06-30',
            createdAt: '2025-06-30T00:00:00Z',
            credentialUrl: 'https://example.org/cs50',
          },
          {
            id: 'unsafe',
            name: 'Unsafe Link',
            issuer: 'Demo',
            dateEarned: '2025-06-30',
            createdAt: '2025-06-30T00:00:00Z',
            credentialUrl: 'javascript:alert(1)',
          },
        ],
      },
    }),
  )
  await page.reload()
  const section = certificatesIn(page)
  await expect(section.getByRole('listitem')).toHaveCount(2)
  await expect(section.getByRole('link', { name: 'View credential for CS50x' })).toHaveAttribute(
    'href',
    'https://example.org/cs50',
  )
  await expect(section.getByRole('link')).toHaveCount(1)
})
