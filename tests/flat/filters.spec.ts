/**
 * Part I — Flat tests (no POM)
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee` to discover selectors.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Navigate Products via Filters', () => {

  test.beforeEach(async ({ page }) => {
    await openHomePage(page);
  });

  test('shows Kriso branding and the music books section', async ({ page }) => {
    await expect(page).toHaveTitle(/kriso/i);

    const musicBooksLink = page.getByRole('link', { name: /^Muusikaraamatud ja noodid$/i }).first();
    await musicBooksLink.scrollIntoViewIfNeeded();

    await expect(musicBooksLink).toBeVisible();
  });

  test('filters guitar products by language and format, then clears filters', async ({ page }) => {
    const musicBooksLink = page.getByRole('link', { name: /^Muusikaraamatud ja noodid$/i }).first();
    await musicBooksLink.scrollIntoViewIfNeeded();
    await musicBooksLink.click();

    const guitarArrangementLink = page.getByRole('link', { name: /Kitarr \(\d+\)/i });
    await expect(guitarArrangementLink).toBeVisible();
    await guitarArrangementLink.click();

    await expect(page).toHaveURL(/instrument=Guitar/i);
    await expect(page.getByText('Arranžeering: kitarr').first()).toBeVisible();

    const guitarResultsCount = await getResultsCount(page);
    expect(guitarResultsCount).toBeGreaterThan(1);

    await page.getByRole('link', { name: /Inglise \(\d+\)/i }).click();
    await expect(page.getByText('Keel: Inglise').first()).toBeVisible();

    const englishResultsCount = await getResultsCount(page);
    expect(englishResultsCount).toBeLessThan(guitarResultsCount);

    await page.getByRole('link', { name: /CD \(\d+\)/i }).click();
    await expect(page.getByText('Formaat: CD').first()).toBeVisible();
    await expect(page.getByText('Keel: Inglise').first()).toBeVisible();
    await expect(page.getByText('Arranžeering: kitarr').first()).toBeVisible();

    const cdResultsCount = await getResultsCount(page);
    expect(cdResultsCount).toBeLessThan(englishResultsCount);

    await page.getByText('Eemalda kõik').click();

    const allMusicBooksLink = page.getByRole('link', { name: /Noodid ja raamatud \(\d+\)/i }).first();
    await expect(allMusicBooksLink).toBeVisible();

    const allMusicBooksCount = extractCount(await allMusicBooksLink.innerText());
    expect(allMusicBooksCount).toBeGreaterThan(cdResultsCount);

    await expect(page).toHaveTitle(/Muusikaraamatud ja noodid/i);
  });

});

async function openHomePage(page: Page) {
  await page.goto('/');
  await acceptCookies(page);
  await expect(page.getByRole('link', { name: /^Muusikaraamatud ja noodid$/i }).first()).toBeVisible();
}

async function acceptCookies(page: Page) {
  const acceptCookiesButton = page.getByRole('button', { name: 'Nõustun' });

  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}

async function getResultsCount(page: Page) {
  const resultsSummary = page.getByText(/Otsingu vasteid leitud:\s*\d+/i).first();
  await expect(resultsSummary).toBeVisible();

  return extractCount(await resultsSummary.innerText());
}

function extractCount(value: string) {
  const match = value.replace(/\s+/g, ' ').match(/(\d[\d\s]*)/);
  return Number((match?.[1] ?? '0').replace(/\s/g, ''));
}
