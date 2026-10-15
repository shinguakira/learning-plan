import { expect, test } from "@playwright/test"

/**
 * Pixel snapshots of Tasks, Profile, and the Add Task modal's initial render.
 * Fix the clock because sample task dates and overdue counts depend on today.
 */

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-14T12:00:00"))
})

test("tasks page, initial render", async ({ page }) => {
  await page.goto("/tasks")
  await expect(page.getByText("Loading sample tasks…")).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "Learning tasks" })).toBeVisible()
  await expect(page).toHaveScreenshot("tasks-page.png")
})

test("profile page, initial render", async ({ page }) => {
  await page.goto("/profile")
  await expect(page.getByRole("status")).toHaveCount(0)
  await expect(page).toHaveScreenshot("profile-page.png")
})

test("add task modal, initial render", async ({ page }) => {
  await page.goto("/tasks")
  await expect(page.getByText("Loading sample tasks…")).toHaveCount(0)
  await page.getByRole("button", { name: "Add a Task", exact: true }).click()
  await expect(page.getByRole("dialog", { name: "Add Task" })).toBeVisible()
  await expect(page).toHaveScreenshot("add-task-modal.png")
})
