/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee` to discover selectors.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const searchInputName = /Pealkiri, autor, ISBN, märksõ/i;

test.describe('Search for Books by Keywords', () => {

  test.beforeEach(async ({ page }) => {
    await openHomePage(page);
  });

  test('loads the homepage with Kriso branding', async ({ page }) => {
    await expect(page).toHaveTitle(/kriso/i);
    await expect(page.getByRole('link', { name: 'K', exact: true }).first()).toBeVisible();
  });

  test('shows no products for an unknown keyword', async ({ page }) => {
    await searchByKeyword(page, 'xqzwmfkj');

    await expect(page.getByRole('heading', { level: 1, name: /Otsingu tulemus/i })).toBeVisible();
    await expect(page.getByText(/Samuti võite otsida teises andmebaasis/i)).toBeVisible();
    expect(await page.getByRole('heading', { level: 3, name: /^\d+\./ }).count()).toBe(0);
  });

  test('finds books by keyword and ISBN', async ({ page }) => {
    await searchByKeyword(page, 'tolkien');

    const resultsSummary = page.getByText(/Otsingu vasteid leitud:\s*\d+/);
    await expect(resultsSummary).toBeVisible();

    const resultsCount = extractResultsCount(await resultsSummary.innerText());
    expect(resultsCount).toBeGreaterThan(1);

    const visibleResults = page.getByRole('heading', { level: 3, name: /^\d+\./ });
    expect(await visibleResults.count()).toBeGreaterThan(1);

    const keywordMentions = page.getByText(/tolkien/i);
    expect(await keywordMentions.count()).toBeGreaterThanOrEqual(await visibleResults.count());

    await page.getByRole('link', { name: 'Täpsem otsing' }).click();

    const isbnField = page.getByRole('textbox', { name: 'ISBN', exact: true });
    await isbnField.fill('9780307588371');
    await isbnField.press('Enter');

    await expect(page.getByRole('heading', { name: /Gone Girl/i })).toBeVisible();
  });

});

async function openHomePage(page: Page) {
  await page.goto('/');
  await acceptCookies(page);
  await expect(page.getByRole('textbox', { name: searchInputName })).toBeVisible();
}

async function acceptCookies(page: Page) {
  const acceptCookiesButton = page.getByRole('button', { name: 'Nõustun' });

  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}

async function searchByKeyword(page: Page, keyword: string) {
  const searchInput = page.getByRole('textbox', { name: searchInputName });

  await searchInput.fill(keyword);
  await page.getByRole('button', { name: 'Search' }).click();
}

function extractResultsCount(value: string) {
  const match = value.match(/Otsingu vasteid leitud:\s*(\d+)/i);
  return Number(match?.[1] ?? 0);
}
