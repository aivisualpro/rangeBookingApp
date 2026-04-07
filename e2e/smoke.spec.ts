import { test, expect } from "@playwright/test";

test.describe("Dashboard smoke tests", () => {
  test("homepage loads with dashboard heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/");

    // Click Analytics in sidebar
    await page.getByRole("link", { name: "Analytics" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Analytics" })
    ).toBeVisible();

    // Click Charts in sidebar
    await page.getByRole("link", { name: "Charts" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Charts" })
    ).toBeVisible();
  });

  test("charts page loads all chart cards", async ({ page }) => {
    await page.goto("/charts");
    await expect(
      page.getByRole("heading", { name: "Charts" })
    ).toBeVisible();
    await expect(page.getByText("Team Skills Assessment")).toBeVisible();
    await expect(page.getByText("Device Usage")).toBeVisible();
    await expect(page.getByText("Budget Allocation")).toBeVisible();
    await expect(page.getByText("Marketing Spend vs Revenue")).toBeVisible();
    await expect(page.getByText("Revenue & Orders Trend")).toBeVisible();
  });

  test("theme toggle switches mode", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Direct toggle button (not a dropdown)
    const themeBtn = page.getByRole("button", { name: /toggle theme/i });
    const classBefore = await html.getAttribute("class");

    await themeBtn.click();
    const classAfterClick = await html.getAttribute("class");

    // Clicking again should revert
    await themeBtn.click();
    const classAfterSecondClick = await html.getAttribute("class");

    expect(classAfterClick).not.toBe(classBefore);
    expect(classAfterSecondClick).toBe(classBefore);
  });
});
