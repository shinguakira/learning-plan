import { expect, test } from '@playwright/test'

for (const outcome of ['success', 'failure'] as const) {
  test(`shows section spinners until the profile request ends in ${outcome}`, async ({ page }) => {
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route('**/api/profile', async (route) => {
      await gate
      if (outcome === 'failure') {
        await route.fulfill({ status: 503, json: {} })
      } else {
        await route.fulfill({
          json: {
            strengths: [
              {
                id: 'strength',
                name: 'Loaded strength',
                description: 'A strength from the backend.',
                createdAt: '2026-01-01T00:00:00.000Z',
              },
            ],
            skills: [
              {
                id: 'skill',
                name: 'Loaded skill',
                level: 'beginner',
                yearsOfExperience: 1,
                createdAt: '2026-01-01T00:00:00.000Z',
              },
            ],
            jobs: [
              {
                id: 'job',
                company: 'Loaded company',
                title: 'Loaded role',
                employmentType: 'full-time',
                startDate: '2020-01-01',
                endDate: '',
                summary: '',
                createdAt: '2026-01-01T00:00:00.000Z',
              },
            ],
            certificates: [
              {
                id: 'certificate',
                name: 'Loaded certificate',
                issuer: 'Loaded issuer',
                dateEarned: '2025-01-01',
                createdAt: '2026-01-01T00:00:00.000Z',
              },
            ],
          },
        })
      }
    })
    await page.goto('/profile')

    try {
      for (const [section, label, button] of [
        ['Skills', 'Loading skills…', 'Add skill'],
        ['Job history', 'Loading job history…', 'Add job'],
        ['Certificates', 'Loading certificates…', 'Add certificate'],
        ['Strengths', 'Loading strengths…', 'Add strength'],
      ]) {
        const region = page.getByRole('region', { name: section, exact: true })
        await expect(region.getByRole('status', { name: label })).toBeVisible()
        await expect(region.getByRole('listitem')).toHaveCount(0)
        await expect(region.getByRole('button', { name: button, exact: true })).toBeEnabled()
      }
      // Actually submit while the request is pending to verify the form remains usable.
      await page.getByLabel('Company', { exact: true }).fill('Local company')
      await page.getByLabel('Job title').fill('Local role')
      await page.getByLabel('Started', { exact: true }).fill('2024-01-01')
      await page.getByRole('button', { name: 'Add job', exact: true }).click()
      await expect(page.getByRole('status')).toHaveCount(4)
    } finally {
      release()
    }

    await expect(page.getByRole('status')).toHaveCount(0)
    await expect(page.getByText('Local role', { exact: true })).toBeVisible()
    if (outcome === 'success') {
      await expect(page.getByText('Loaded skill', { exact: true })).toBeVisible()
      await expect(page.getByText('Loaded role', { exact: true })).toBeVisible()
      await expect(page.getByText('Loaded certificate', { exact: true })).toBeVisible()
      await expect(page.getByText('Loaded strength', { exact: true })).toBeVisible()
    } else {
      await expect(page.getByText('Request failed (503)', { exact: true })).toBeVisible()
      await expect(page.getByText('No skills registered yet')).toBeVisible()
    }
  })
}
