/**
 * Part II — Page Object Model tests
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - No raw selectors in test files — all locators live in page classes
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */
import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Filter Books (POM)', () => {
  test('filter guitar books by English and CD, then remove filters', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    await homePage.openUrl();
    await homePage.acceptCookies();
    await productPage.openMusicBooksCategory();
    await productPage.openGuitarCategory();
    const guitarCount = await productPage.getResultsCount();
    await productPage.filterByEnglish();
    await productPage.verifyResultsCountLessThan(guitarCount);
    await productPage.filterByCd();
    await productPage.verifyResultsCountLessThan(guitarCount);
    await productPage.removeCdFilter();
    await productPage.verifyResultsCountLessThan(guitarCount);
    await productPage.removeEnglishFilter();
    await productPage.verifyResultsCount(guitarCount);
  });
});
