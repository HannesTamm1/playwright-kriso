/**
 * Part I — Flat tests (no POM)
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://kaup24.ee/et/` to discover selectors.
 */
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test("Navigate Products via Filters", async ({ page }) => {
  await page.goto("https://www.kriso.ee/cgi-bin/shop/locale.html?k=est&v=est");
  await page
    .getByRole("button", { name: "Keeldun" })
    .click({ timeout: 5000 })
    .catch(() => {});
  await expect(page).toHaveTitle(/Kriso/i);
  await expect(
    page.getByRole("link", { name: "K", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /Muusikaraamatud ja noodid/ }).first(),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Muusikaraamatud ja noodid/ })
    .first()
    .click();

  await page.getByRole("link", { name: /^Kitarr/ }).click();
  await expect(page).toHaveURL(/instrument=Guitar/);
  await expect(page.getByText("Otsingu vasteid leitud: 43176")).toBeVisible();

  await page.getByRole("link", { name: /^Inglise/ }).click();
  await expect(page.getByText("Keel: Inglise").first()).toBeVisible();
  await expect(page.getByText("Otsingu vasteid leitud: 8061")).toBeVisible();

  await page.getByRole("link", { name: /^CD/ }).click();
  await expect(page.getByText("Formaat: CD").first()).toBeVisible();
  await expect(page.getByText("Otsingu vasteid leitud: 1141")).toBeVisible();

  await page.goBack();
  await expect(page.getByText("Formaat: CD")).toHaveCount(0);
  await page.goBack();
  await expect(page.getByText("Keel: Inglise")).toHaveCount(0);
  await expect(page.getByText(/Otsingu vasteid leitud: \d+/)).toBeVisible();
});
