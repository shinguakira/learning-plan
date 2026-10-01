import { expect, test } from '@playwright/test'
import type { Page, Route } from '@playwright/test'

const ENDPOINT = '**/v1/chat/completions'

type RequestBody = {
  model: string
  messages: { role: string; content: string }[]
}

/** Answer the chat endpoint with `reply`, and record what was sent. */
async function stubReply(page: Page, reply: string): Promise<RequestBody[]> {
  const sent: RequestBody[] = []
  await page.route(ENDPOINT, (route: Route) => {
    sent.push(route.request().postDataJSON() as RequestBody)
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { content: reply } }] }),
    })
  })
  return sent
}

test.beforeEach(async ({ page }) => {
  await page.goto('/chat')
  await expect(page.getByRole('heading', { name: 'AI chat' })).toBeVisible()
})

test('shows starter prompts while the conversation is empty', async ({ page }) => {
  await expect(page.getByText('What do you want to work out?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'How should I learn React?' })).toBeVisible()
})

test('sends a typed message and renders the reply', async ({ page }) => {
  await stubReply(page, 'Start with the docs.')

  await page.getByLabel('Message').fill('how do I learn react')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('Start with the docs.')).toBeVisible()
  await expect(page.getByLabel('Message')).toHaveValue('')
})

test('sends a starter prompt', async ({ page }) => {
  await stubReply(page, 'Use a multi-stage build.')

  await page.getByRole('button', { name: 'How do I shrink a Docker image?' }).click()

  await expect(page.getByText('How do I shrink a Docker image?')).toBeVisible()
  await expect(page.getByText('Use a multi-stage build.')).toBeVisible()
})

test('sends the system prompt, the model and the full history', async ({ page }) => {
  const sent = await stubReply(page, 'ok')

  await page.getByLabel('Message').fill('first')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('ok')).toBeVisible()

  await page.getByLabel('Message').fill('second')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('ok')).toHaveCount(2)

  expect(sent).toHaveLength(2)
  expect(sent[1]?.model).toBe('stub-model')
  expect(sent[1]?.messages.map((message) => message.role)).toEqual([
    'system',
    'user',
    'assistant',
    'user',
  ])
  expect(sent[1]?.messages.at(-1)?.content).toBe('second')
})

test('renders fenced code blocks in a reply', async ({ page }) => {
  await stubReply(page, 'Try this:\n\n```dockerfile\nFROM node:22-slim\n```')

  await page.getByLabel('Message').fill('docker')
  await page.getByLabel('Message').press('Enter')

  await expect(page.locator('pre code')).toContainText('FROM node:22-slim')
})

test('shows the provider error message when the request fails', async ({ page }) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Invalid API key' } }),
    }),
  )

  await page.getByLabel('Message').fill('anything')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('Invalid API key')).toBeVisible()
})

test('reports an empty reply rather than showing a blank bubble', async ({ page }) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { content: '' } }] }),
    }),
  )

  await page.getByLabel('Message').fill('anything')
  await page.getByLabel('Message').press('Enter')

  await expect(page.getByText('The API returned an empty reply.')).toBeVisible()
})

test('clears the conversation', async ({ page }) => {
  await stubReply(page, 'Some answer.')

  await page.getByLabel('Message').fill('question')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('Some answer.')).toBeVisible()

  await page.getByRole('button', { name: 'New chat' }).click()

  await expect(page.getByText('Some answer.')).toHaveCount(0)
  await expect(page.getByText('What do you want to work out?')).toBeVisible()
})

test('does not persist the conversation across a reload', async ({ page }) => {
  await stubReply(page, 'Some answer.')

  await page.getByLabel('Message').fill('question')
  await page.getByLabel('Message').press('Enter')
  await expect(page.getByText('Some answer.')).toBeVisible()

  await page.reload()

  await expect(page.getByText('What do you want to work out?')).toBeVisible()
})
