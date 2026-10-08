import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const SEED_COUNT = 300

/** shadcn's Select is a Radix listbox, not a native <select>. */
async function chooseOption(page: Page, selectLabel: string, option: string) {
  await page.getByRole('combobox', { name: selectLabel }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

/** The filter row reads "300 shown" or "12 shown of 300". */
async function shownCount(page: Page): Promise<number> {
  const text = await page.getByText(/^\d+ shown/).innerText()
  return Number(text.split(' ')[0])
}

/**
 * Nothing is persisted, so every visit starts from the same sample plan.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Learning tasks' })).toBeVisible()
})

test('starts from the sample plan', async ({ page }) => {
  expect(await shownCount(page)).toBe(SEED_COUNT)
  await expect(page.getByText(new RegExp(`^\\d+ of ${SEED_COUNT} done$`))).toBeVisible()
})

test('adds a task', async ({ page }) => {
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await page.getByLabel('Title').fill('Read the Rust ownership chapter')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()

  await expect(page.getByLabel('Title')).toHaveValue('')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await page.getByLabel('Search tasks').fill('Read the Rust ownership chapter')

  await expect(page.getByText('Read the Rust ownership chapter')).toBeVisible()
  await page.getByLabel('Search tasks').fill('')
  expect(await shownCount(page)).toBe(SEED_COUNT + 1)
})

test('refuses a task with no title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await page.getByRole('button', { name: 'Add task', exact: true }).click()

  await expect(page.getByText('Enter a title')).toBeVisible()
  expect(await shownCount(page)).toBe(SEED_COUNT)
})

test('counts note characters live and enforces the limit', async ({ page }) => {
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  const note = page.getByRole('textbox', { name: /^Note/ })
  await expect(note).toHaveAccessibleName('Note optional · 0/280')

  await note.pressSequentially('Read docs')
  await expect(note).toHaveAccessibleName('Note optional · 9/280')
  await note.press('Backspace')
  await expect(note).toHaveAccessibleName('Note optional · 8/280')

  // fill inserts text as a paste would, exercising the browser's length limit.
  await note.fill('a'.repeat(281))
  await expect(note).toHaveValue('a'.repeat(280))
  await expect(note).toHaveAccessibleName('Note optional · 280/280')
  await note.pressSequentially('b')
  await expect(note).toHaveValue('a'.repeat(280))

  await page.getByRole('button', { name: 'Clear', exact: true }).click()
  await expect(note).toHaveValue('')
  await expect(note).toHaveAccessibleName('Note optional · 0/280')

  await page.getByLabel('Title').fill('Task with a full note')
  await note.fill('a'.repeat(280))
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await expect(note).toHaveAccessibleName('Note optional · 0/280')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await page.getByLabel('Search tasks').fill('Task with a full note')
  await expect(page.getByText('a'.repeat(280), { exact: true })).toBeVisible()
})

test('deletes a task behind a confirm step', async ({ page }) => {
  // Narrow to one row first, so the deletion target is unambiguous.
  const title = 'Sit the CKAD exam'
  await page.getByLabel('Search tasks').fill(title)
  expect(await shownCount(page)).toBe(1)

  await page.getByRole('button', { name: `Delete "${title}"` }).click()
  // Still there until the confirm is clicked.
  await expect(page.getByText(title)).toBeVisible()

  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByText('No tasks to show')).toBeVisible()

  await page.getByLabel('Search tasks').fill('')
  expect(await shownCount(page)).toBe(SEED_COUNT - 1)
})

test('cycles a task status', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('Sit the CKAD exam')

  const todo = page.getByRole('button', { name: 'Cycle status (currently: To do)' })
  await expect(todo).toHaveCount(1)

  await todo.click()

  await expect(todo).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Cycle status (currently: In progress)' }),
  ).toHaveCount(1)
})

test('filters by search text', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('kubectl')

  const shown = await shownCount(page)
  expect(shown).toBeGreaterThan(0)
  expect(shown).toBeLessThan(SEED_COUNT)
  await expect(page.getByText(`${shown} shown of ${SEED_COUNT}`)).toBeVisible()
})

test('clear the search input', async ({ page }) => {
  await page.getByLabel('Search tasks').fill('kubectl')
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByLabel('Search tasks')).toHaveValue('')
  await expect(page.getByLabel('Search tasks')).toBeFocused()
})

test('the status filters partition the whole list', async ({ page }) => {
  let sum = 0
  for (const label of ['To do', 'In progress', 'Done']) {
    await page.getByRole('button', { name: label, exact: true }).click()
    sum += await shownCount(page)
  }
  expect(sum).toBe(SEED_COUNT)
})

test('the category filters partition the whole list', async ({ page }) => {
  const categories = [
    'Frontend',
    'Backend',
    'Infra / Cloud',
    'Database',
    'CS Fundamentals',
    'Certification',
  ]
  let sum = 0
  for (const category of categories) {
    await chooseOption(page, 'Filter by category', category)
    sum += await shownCount(page)
  }
  expect(sum).toBe(SEED_COUNT)
})

test('switches to the timeline view', async ({ page }) => {
  await page.getByRole('button', { name: 'Timeline' }).click()

  await expect(page.getByText('Task', { exact: true })).toBeVisible()
  await expect(page.getByText('Today')).toBeVisible()
  await expect(page.getByTitle('Sit the CKAD exam').first()).toBeVisible()
  // Sorting is fixed to start date on the timeline, so the control is disabled.
  await expect(page.getByRole('combobox', { name: 'Sort order' })).toBeDisabled()
})

test('starts fresh on a reload - nothing is persisted', async ({ page }) => {
  await page.getByRole('button', { name: 'Add a Task', exact: true }).click()
  await page.getByLabel('Title').fill('Not persisted')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await page.getByLabel('Search tasks').fill('Not persisted')
  await expect(page.getByText('Not persisted')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Not persisted')).toHaveCount(0)
  expect(await shownCount(page)).toBe(SEED_COUNT)
})

test('paginates every matching task without duplicates or omissions', async ({ page }) => {
  const total = await shownCount(page)
  const tasks = page.getByRole('list', { name: 'Tasks', exact: true })
  const pagination = page.getByRole('navigation', { name: 'Task pagination' })
  const previous = pagination.getByRole('link', { name: 'Go to previous page' })
  const next = pagination.getByRole('link', { name: 'Go to next page' })
  const firstNames = await tasks
    .getByRole('button', { name: /^Delete "/ })
    .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')))
  const pageSize = firstNames.length
  expect(pageSize).toBeGreaterThan(0)
  expect(pageSize).toBeLessThan(total)
  await expect(previous).toBeDisabled()
  await previous.click({ force: true })
  await expect(pagination.getByRole('link', { name: 'Go to page 1', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  const seen = new Set<string | null>()
  let currentPage = 1
  while (true) {
    const names = await tasks
      .getByRole('button', { name: /^Delete "/ })
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')))
    expect(names.length).toBeLessThanOrEqual(pageSize)
    for (const name of names) {
      expect(seen.has(name)).toBe(false)
      seen.add(name)
    }
    await expect(
      pagination.getByRole('link', { name: `Go to page ${currentPage}`, exact: true }),
    ).toHaveAttribute('aria-current', 'page')
    if ((await next.getAttribute('aria-disabled')) === 'true') break
    await next.click()
    currentPage += 1
  }
  expect(seen.size).toBe(total)
  await expect(next).toBeDisabled()
  await next.click({ force: true })
  await expect(
    pagination.getByRole('link', { name: `Go to page ${currentPage}`, exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await previous.click()
  await expect(
    pagination.getByRole('link', { name: `Go to page ${currentPage - 1}`, exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await next.click()
  await expect(
    pagination.getByRole('link', { name: `Go to page ${currentPage}`, exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await pagination.getByRole('link', { name: 'Go to page 1', exact: true }).click()
  expect(
    await tasks
      .getByRole('button', { name: /^Delete "/ })
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label'))),
  ).toEqual(firstNames)
})

test('resets pagination when filters or sorting change', async ({ page }) => {
  const pagination = page.getByRole('navigation', { name: 'Task pagination' })
  const first = pagination.getByRole('link', { name: 'Go to page 1', exact: true })
  await pagination.getByRole('link', { name: 'Go to next page' }).click()
  await chooseOption(page, 'Sort order', 'Recently added')
  await expect(first).toHaveAttribute('aria-current', 'page')
  await pagination.getByRole('link', { name: 'Go to next page' }).click()
  await page.getByRole('button', { name: 'To do', exact: true }).click()
  await expect(first).toHaveAttribute('aria-current', 'page')
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await pagination.getByRole('link', { name: 'Go to next page' }).click()
  await chooseOption(page, 'Filter by category', 'Frontend')
  await expect(first).toHaveAttribute('aria-current', 'page')
  await pagination.getByRole('link', { name: 'Go to next page' }).click()
  await page.getByLabel('Search tasks').fill('no matching pagination task')
  await expect(page.getByText('No tasks to show')).toBeVisible()
  await expect(pagination).toHaveCount(0)
  await page.getByLabel('Search tasks').fill('')
  await expect(first).toHaveAttribute('aria-current', 'page')
})

test('returns to the previous page when the final page is deleted', async ({ page }) => {
  const total = await shownCount(page)
  const tasks = page.getByRole('list', { name: 'Tasks', exact: true })
  const pageSize = await tasks.getByRole('listitem').count()
  const lastPage = Math.ceil(total / pageSize)
  const pagination = page.getByRole('navigation', { name: 'Task pagination' })
  await pagination.getByRole('link', { name: `Go to page ${lastPage}`, exact: true }).click()
  const remaining = await tasks.getByRole('listitem').count()
  for (let index = 0; index < remaining; index += 1) {
    await tasks
      .getByRole('button', { name: /^Delete "/ })
      .first()
      .click()
    await tasks.getByRole('button', { name: 'Delete', exact: true }).click()
  }
  await expect(
    pagination.getByRole('link', { name: `Go to page ${lastPage - 1}`, exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(tasks.getByRole('listitem')).toHaveCount(pageSize)
  expect(await shownCount(page)).toBe(total - remaining)
})

test('clears every task and restores the samples', async ({ page }) => {
  await page.getByRole('button', { name: 'Delete all' }).click()

  await expect(page.getByText('No tasks to show')).toBeVisible()
  expect(await shownCount(page)).toBe(0)

  await page.getByRole('button', { name: 'Reload sample data' }).click()

  expect(await shownCount(page)).toBe(SEED_COUNT)
})
