import { expect, test } from "@playwright/test"

const forms = [
  { section: "Skills", title: "Add skill", field: "Skill" },
  { section: "Strengths", title: "Add strength", field: "Strength" },
  { section: "Job history", title: "Add job", field: "Company" },
  { section: "Certificates", title: "Add certificate", field: "Title" },
] as const

test.beforeEach(async ({ page }) => {
  await page.route("**/api/profile", (route) =>
    route.fulfill({ json: { skills: [], strengths: [], jobs: [], certificates: [] } }),
  )
  await page.goto("/profile")
  await expect(page.getByRole("status")).toHaveCount(0)
})

for (const { section, title, field } of forms) {
  test(`${title} opens a modal and discards cancelled drafts`, async ({ page }) => {
    const region = page.getByRole("region", { name: section, exact: true })
    const trigger = region.getByRole("button", { name: title, exact: true })
    const dialog = page.getByRole("dialog", { name: title, exact: true })
    await expect(page.getByLabel(field, { exact: true })).toHaveCount(0)

    await trigger.click()
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel(field, { exact: true })).toBeFocused()
    if (field === "Skill") {
      await dialog.getByRole("combobox", { name: "Skill", exact: true }).click()
      await page.getByRole("option", { name: "Rust", exact: true }).click()
    } else {
      await dialog.getByLabel(field, { exact: true }).fill("Discard this draft")
    }
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(region.getByRole("listitem")).toHaveCount(0)

    await trigger.click()
    if (field === "Skill") {
      await expect(dialog.getByRole("combobox", { name: "Skill", exact: true })).toHaveText(
        "JavaScript",
      )
    } else {
      await expect(dialog.getByLabel(field, { exact: true })).toHaveValue("")
    }
    await page.keyboard.press("Escape")
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()

    await trigger.click()
    await dialog.getByRole("button", { name: "Close", exact: true }).click()
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(region.getByRole("listitem")).toHaveCount(0)
  })

  test(`${title} fits a small phone and keeps its actions reachable`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 600 })
    await page.getByRole("button", { name: title, exact: true }).click()
    const dialog = page.getByRole("dialog", { name: title, exact: true })
    await expect(dialog).toBeVisible()
    expect(
      await dialog.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return (
          bounds.left >= 0 &&
          bounds.top >= 0 &&
          bounds.right <= window.innerWidth &&
          bounds.bottom <= window.innerHeight &&
          element.scrollWidth <= element.clientWidth
        )
      }),
    ).toBe(true)
    await dialog.getByRole("button", { name: title, exact: true }).scrollIntoViewIfNeeded()
    await expect(dialog.getByRole("button", { name: title, exact: true })).toBeInViewport()
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
    await expect(dialog).toHaveCount(0)
  })
}
