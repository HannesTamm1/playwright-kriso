/**
 * Part I — Flat tests (no POM)
 * Test suite: Add Books to Shopping Cart
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://kaup24.ee/et/` to discover selectors.
 */
import { test, expect } from '@playwright/test';

test('Kodushop ostukorvi testimine', async ({ page }) => {

  // --- Ava kodushop.ee ---
  await page.goto('https://kodushop.ee/');
  await expect(page.getByRole('link', { name: 'kodushop.ee' })).toBeVisible();

  // --- Otsi märksõnaga "küps" ja kontrolli tulemusi ---
  await page.getByRole('banner').getByRole('textbox', { name: 'Search' }).fill('küps');
  await page.getByRole('banner').getByRole('textbox', { name: 'Search' }).press('Enter');
  await page.waitForLoadState('networkidle');
  const searchResults = await page.locator('.product').count();
  expect(searchResults).toBeGreaterThan(1);

  // --- Lisa esimene toode ostukorvi ---
  await page.getByRole('button', { name: /Add to cart.*20x20/ }).first().click();
  await expect(page.getByRole('link', { name: 'Vaata ostukorvi' })).toBeVisible({ timeout: 10000 });

  // --- Kontrolli ostukorvi loendur = 1 ---
  await expect(page.getByRole('link', { name: / 1 / })).toBeVisible({ timeout: 10000 });

  // --- Lisa teine toode ostukorvi ---
  await page.getByRole('button', { name: /Add to cart.*Kuumaõhu/ }).first().click();
  await expect(page.getByRole('link', { name: 'Vaata ostukorvi' })).toBeVisible({ timeout: 10000 });

  // --- Kontrolli ostukorvi loendur = 2 ---
  await expect(page.getByRole('link', { name: / 2 / })).toBeVisible({ timeout: 10000 });

  // --- Ava ostukorv ---
  await page.getByRole('link', { name: 'Vaata ostukorvi' }).click();
  await page.waitForLoadState('networkidle');

  // --- Kontrolli et ostukorvis on 2 õiget toodet ---
await expect(page.getByRole('link', { name: /Airfryer küpsetuspaber 50tk/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Kuumaõhufritüüri küpsetuspabervormid 50tk/ }).first()).toBeVisible();
 
  // --- Kontrolli koguhinda ---
  await expect(page.locator('.order-total, .cart-subtotal, td.product-subtotal, [class*="total"]').filter({ hasText: '€' }).first()).toBeVisible();
 
  // --- Salvesta hind enne eemaldamist ---
  const totalBefore = await page.locator('tr').filter({ hasText: 'Kokku' }).last().textContent();
 
  // --- Eemalda esimene toode ---
  await page.getByRole('button', { name: /Remove Airfryer/ }).click();
  await page.waitForLoadState('networkidle');
 
  // --- Kontrolli et esimene toode on eemaldatud ---
  await expect(page.getByRole('link', { name: /Airfryer küpsetuspaber 50tk/ }).first()).not.toBeVisible();
 
  // --- Kontrolli et teine toode on alles ---
  await expect(page.getByRole('link', { name: /Kuumaõhufritüüri küpsetuspabervormid 50tk/ }).first()).toBeVisible();
 
  // --- Kontrolli et koguhind muutus ---
  const totalAfter = await page.locator('tr').filter({ hasText: 'Kokku' }).last().textContent();
  expect(totalAfter).not.toBe(totalBefore);
});