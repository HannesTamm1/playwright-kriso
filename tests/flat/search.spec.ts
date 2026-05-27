/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://kaup24.ee/et/` to discover selectors.
 */
import { test, expect } from '@playwright/test';

test('Kodushop otsingu testimine', async ({ page }) => {

  // --- Ava kodushop.ee ---
  await page.goto('https://kodushop.ee/');
  await expect(page.getByRole('link', { name: 'kodushop.ee' })).toBeVisible();

  await page.getByRole('banner').getByRole('textbox', { name: 'Search' }).fill('xqfasdfjl');
    await page.getByRole('banner').getByRole('button', { name: 'Search ' }).click();
  await page.waitForLoadState('networkidle');
  const pageContent = await page.content();
  const noResults = await page.locator('.product').count();
  expect(noResults).toBe(0);

  await page.getByRole('banner').getByLabel('Puhasta otsing').click();
  await page.getByRole('banner').getByRole('textbox', { name: 'Search' }).fill('grill');
  await page.getByRole('banner').getByRole('button', { name: 'Search ' }).click();
  await expect(page.getByText('Quick view Grillkinnas, hõbe')).toBeVisible();
  await expect(page.getByText('Esperanza võileivagrill 1000W, roostevaba')).toBeVisible();

  await page.getByRole('banner').getByRole('textbox', { name: 'Search' }).fill('5901299954843');
  await page.getByRole('banner').getByRole('button', { name: 'Search ' }).click();
  await expect(page.getByRole('heading', { name: 'Esperanza võileivagrill 1000W' })).toBeVisible();

});