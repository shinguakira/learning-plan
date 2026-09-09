import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/chat')
  await expect(page.getByRole('heading', { name: 'AI chat' })).toBeVisible()
})

test('shows starter prompts while the conversation is empty', async ({ page }) => {
  await expect(page.getByText('What do you want to work out?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'How should I learn React?' })).toBeVisible()
})

test('answers a starter prompt', async ({ page }) => {
  await page.getByRole('button', { name: 'How do I shrink a Docker image?' }).click()

  await expect(page.getByText('How do I shrink a Docker image?')).toBeVisible()
  await expect(page.getByText('Four things cover nearly all day-to-day Docker.')).toBeVisible()
})

test('answers a typed message on Enter', async ({ page }) => {
  await page.getByLabel('Message').fill('git conflict')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toBeVisible()
  // The composer empties once the message is sent.
  await expect(page.getByLabel('Message')).toHaveValue('')
})

test('renders fenced code blocks in a reply', async ({ page }) => {
  await page.getByRole('button', { name: 'How do I shrink a Docker image?' }).click()

  await expect(page.locator('pre code')).toContainText('FROM node:22-slim AS build')
})

test('falls back when nothing matches', async ({ page }) => {
  await page.getByLabel('Message').fill('qqqq zzzz nothing like this')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('I only know a handful of topics.')).toBeVisible()
})

test('keeps the conversation across turns', async ({ page }) => {
  await page.getByLabel('Message').fill('git conflict')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toBeVisible()

  await page.getByLabel('Message').fill('docker image')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('Four things cover nearly all day-to-day Docker.')).toBeVisible()
  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toBeVisible()
})

test('clears the conversation', async ({ page }) => {
  await page.getByLabel('Message').fill('git conflict')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toBeVisible()

  await page.getByRole('button', { name: 'New chat' }).click()

  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toHaveCount(0)
  await expect(page.getByText('What do you want to work out?')).toBeVisible()
})

test('does not persist the conversation across a reload', async ({ page }) => {
  await page.getByLabel('Message').fill('git conflict')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('Roughly ten Git commands cover daily use.')).toBeVisible()

  await page.reload()

  await expect(page.getByText('What do you want to work out?')).toBeVisible()
})
