/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee/` to discover selectors.
 */
import { test, expect } from '@playwright/test';

test('Search for Books by Keywords', async ({ page }) => {

  await page.goto('https://www.kriso.ee/cgi-bin/shop/locale.html?k=est&v=est');
  await page.getByRole('button', { name: 'Keeldun' }).click({ timeout: 5000 }).catch(() => {});
  await expect(page).toHaveTitle(/Kriso/i);
  await expect(page.getByRole('link', { name: 'K', exact: true })).toBeVisible();

  await page.getByPlaceholder('Pealkiri, autor, ISBN').fill('xqzwmfkj');
  await page.getByPlaceholder('Pealkiri, autor, ISBN').press('Enter');
  await expect(page.getByText('Teie poolt sisestatud märksõnale vastavat raamatut ei leitud')).toBeVisible();

  await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('tolkien');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Otsingu tulemused' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^\d+\./ }).nth(1)).toBeVisible();
  await expect(page.getByRole('heading', { name: /tolkien/i }).first()).toBeVisible();

  await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('9780307588371');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: /Gone Girl/ }).first()).toBeVisible();
});