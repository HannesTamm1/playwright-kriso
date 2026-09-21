/**
 * Part II — Page Object Model tests
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - No raw selectors in test files — all locators live in page classes
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */
import { test } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";

test.describe("Search for Books by Keywords (POM)", () => {
  test("search with nonsense keyword shows no results", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openUrl();
    await homePage.acceptCookies();
    await homePage.searchByKeyword("xqzwmfkj");
    await homePage.verifyNoProductsFoundMessage();
  });

  test("search with tolkien shows multiple results", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openUrl();
    await homePage.acceptCookies();
    await homePage.searchByKeyword("tolkien");
    await homePage.verifyResultsCountMoreThan(1);
  });

  test("search with ISBN shows Gone Girl", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openUrl();
    await homePage.acceptCookies();
    await homePage.searchByKeyword("9780307588371");
    await homePage.verifyProductVisible("Gone Girl");
  });
});
