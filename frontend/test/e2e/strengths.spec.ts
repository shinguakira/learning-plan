import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const strengthsIn = (page: Page) => page.getByRole("region", { name: "Strengths", exact: true })

async function addStrength(page: Page, name: string, description: string) {
  await strengthsIn(page).getByRole("button", { name: "Add strength", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Add strength", exact: true })
  await dialog.getByLabel("Strength", { exact: true }).fill(name)
  await dialog.getByLabel("Description", { exact: true }).fill(description)
  await dialog.getByRole("button", { name: "Add strength", exact: true }).click()
}

test.beforeEach(async ({ page }) => {
  await page.route("**/api/profile", (route) =>
    route.fulfill({
      json: { skills: [], jobs: [], certificates: [], strengths: [] },
    }),
  )
})

test("adds trimmed values, resets the form, and starts fresh on reload", async ({ page }) => {
  await page.goto("/profile")
  const section = strengthsIn(page)
  await expect(section.getByText("No strengths added yet")).toBeVisible()
  await addStrength(page, "  Communication  ", "  I explain ideas clearly.  ")
  await expect(section.getByRole("heading", { name: "Communication", exact: true })).toHaveText(
    "Communication",
  )
  await expect(section.getByRole("listitem").getByText("I explain ideas clearly.")).toHaveText(
    "I explain ideas clearly.",
  )
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await section.getByRole("button", { name: "Add strength", exact: true }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByLabel("Strength", { exact: true })).toHaveValue("")
  await expect(dialog.getByLabel("Description", { exact: true })).toHaveValue("")
  await page.reload()
  await expect(section.getByText("No strengths added yet")).toBeVisible()
})

test("rejects whitespace-only fields and recovers after correction", async ({ page }) => {
  await page.goto("/profile")
  await addStrength(page, "   ", "   ")
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByText("Enter a strength", { exact: true })).toBeVisible()
  await expect(dialog.getByText("Describe your strength", { exact: true })).toBeVisible()
  await expect(dialog).toBeVisible()
  await dialog.getByLabel("Strength", { exact: true }).fill("Patience")
  await dialog.getByRole("button", { name: "Add strength", exact: true }).click()
  await expect(dialog.getByText("Enter a strength", { exact: true })).toHaveCount(0)
  await expect(dialog.getByText("Describe your strength", { exact: true })).toBeVisible()
  await expect(dialog).toBeVisible()
  await dialog.getByLabel("Description").fill("I stay calm in difficult situations.")
  await dialog.getByRole("button", { name: "Add strength", exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(strengthsIn(page).getByRole("heading", { name: "Patience" })).toBeVisible()
})

test("removes the correct entry when two strengths share a name", async ({ page }) => {
  await page.goto("/profile")
  const section = strengthsIn(page)
  await addStrength(page, "Leadership", "I mentor new teammates.")
  await addStrength(page, "Leadership", "I help the team agree on priorities.")
  await section
    .getByRole("listitem")
    .filter({ hasText: "I mentor new teammates." })
    .getByRole("button", { name: "Remove Leadership" })
    .click()
  await expect(section.getByText("I mentor new teammates.")).toHaveCount(0)
  await expect(section.getByText("I help the team agree on priorities.")).toBeVisible()
  await section.getByRole("button", { name: "Remove Leadership" }).click()
  await expect(section.getByText("No strengths added yet")).toBeVisible()
})

for (const outcome of ["success", "failure"] as const) {
  test(`preserves a strength added during a request that ends in ${outcome}`, async ({ page }) => {
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route("**/api/profile", async (route) => {
      await gate
      if (outcome === "failure") {
        await route.fulfill({ status: 503, json: {} })
      } else {
        await route.fulfill({
          json: {
            skills: [],
            jobs: [],
            certificates: [],
            strengths: [
              {
                id: "seed-strength",
                name: "Quick learner",
                description: "I learn new tools quickly.",
                createdAt: "2026-01-01T00:00:00.000Z",
              },
            ],
          },
        })
      }
    })
    await page.goto("/profile")
    const section = strengthsIn(page)
    try {
      await expect(section.getByRole("status")).toBeVisible()
      await expect(section.getByText("No strengths added yet")).toHaveCount(0)
      await addStrength(page, "Problem solving", "I break problems into smaller steps.")
      await expect(section.getByRole("status")).toBeVisible()
    } finally {
      release()
    }
    await expect(section.getByRole("status")).toHaveCount(0)
    await expect(
      section.getByRole("heading", { name: "Problem solving", exact: true }),
    ).toBeVisible()
    if (outcome === "success") {
      await expect(
        section.getByRole("heading", { name: "Quick learner", exact: true }),
      ).toBeVisible()
    } else {
      await expect(page.getByText("Request failed (503)", { exact: true })).toBeVisible()
    }
  })
}

test("strengths fit a phone viewport even with long words", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/profile")
  const longName = "Strength".repeat(30)
  const longDescription = "Example".repeat(60)
  await addStrength(page, longName, longDescription)
  const section = strengthsIn(page)
  await expect(section.getByRole("heading", { name: longName, exact: true })).toBeVisible()
  const fits = await section.evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    return (
      bounds.left >= 0 &&
      bounds.right <= window.innerWidth &&
      element.scrollWidth <= element.clientWidth
    )
  })
  expect(fits).toBe(true)
})

test("loads strength examples from the real backend", async ({ page }) => {
  await page.unroute("**/api/profile")
  const responsePromise = page.waitForResponse("**/api/profile")
  await page.goto("/profile")
  const response = await responsePromise
  expect(response.ok()).toBe(true)
  const seed = (await response.json()) as { strengths: { name: string; description: string }[] }
  expect(seed.strengths.length).toBeGreaterThan(0)
  for (const strength of seed.strengths) {
    await expect(
      strengthsIn(page).getByRole("heading", { name: strength.name, exact: true }),
    ).toBeVisible()
    await expect(strengthsIn(page).getByText(strength.description, { exact: true })).toBeVisible()
  }
})
