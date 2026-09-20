/**
 * Part I — Flat tests (no POM)
 * Test suite: Add Books to Shopping Cart
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee/` to discover selectors.
 */
import { test, expect } from '@playwright/test';

test('Add Books to Shopping Cart', async ({ page }) => {
    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Keeldun' }).click();
    await expect(page).toHaveTitle(/Kriso/i);
    await expect(page.getByRole('link', { name: 'K', exact: true })).toBeVisible();

    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('lord of the rings');
    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).press('Enter');
    await expect(page.getByRole('heading', { name: /^2\./ })).toBeVisible();

    await page.getByRole('link', { name: /^6\. Lord of the Rings Little/ }).click();
    await page.getByRole('link', { name: 'Lisa ostukorvi' }).click();
    await expect(page.getByText('Toode lisati ostukorvi')).toBeVisible();
    await expect(page.getByText('Tooteid ostukorvis: 1')).toBeVisible();
    await page.getByRole('link', { name: /Jätka ostlemist/ }).click();

    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('harry potter');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('link', { name: /^1\. Harry Potter and the Half-/ }).click();
    await page.getByRole('link', { name: 'Lisa ostukorvi' }).click();
    await expect(page.getByText('Toode lisati ostukorvi')).toBeVisible();
    await page.getByRole('link', { name: /Mine ostukorvi/ }).click();
    await expect(page.getByText('Tooteid kokku: 2')).toBeVisible();

    await page.getByRole('link', { name: /Ostukorv/ }).first().click();
    await expect(page.getByRole('cell', { name: /Harry Potter and the Half-/ })).toBeVisible();
    await expect(page.getByRole('cell', { name: /Lord of the Rings Little Book/ })).toBeVisible();
    await expect(page.getByText('Kokku: 455,43 €').first()).toBeVisible();

    await expect(page.getByRole('columnheader', { name: 'Eemalda' })).toBeVisible();
  await expect(page.getByText('Tooteid kokku: 2')).toBeVisible();
  await expect(page.getByRole('cell', { name: /Harry Potter and the Half-/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Lord of the Rings Little Book/ })).toBeVisible();
  await expect(page.getByText('Kokku: 455,43 €').first()).toBeVisible();

  await page.getByRole('link').filter({ hasText: /^$/ }).nth(4).click();
  await expect(page.getByText('Tooteid kokku: 1')).toBeVisible();
  await expect(page.getByRole('cell', { name: /Harry Potter and the Half-/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Lord of the Rings Little Book/ })).toHaveCount(0);
  await expect(page.getByText('Kokku: 439,00 €').first()).toBeVisible();
});