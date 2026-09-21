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

test.describe.configure({ mode: "serial" });

test.describe("Add Books to Shopping Cart (POM)", () => {
  test("add two books, verify cart, remove one", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openUrl();
    await homePage.acceptCookies();
    await homePage.searchByKeyword("lord of the rings");
    await homePage.addToCartByIndex(0);
    await homePage.verifyAddToCartMessage();
    await homePage.verifyCartCount(1);
    await homePage.goBackFromCart();
    await homePage.searchByKeyword("harry potter");
    await homePage.addToCartByIndex(0);
    await homePage.verifyAddToCartMessage();
    await homePage.verifyCartCount(2);
    const cartPage = await homePage.openShoppingCart();
    await cartPage.verifyCartCount(2);
    await cartPage.verifyCartSumIsCorrect();
    await cartPage.removeItemByIndex(0);
    await cartPage.verifyCartCount(1);
    await cartPage.verifyCartSumIsCorrect();
  });
});
