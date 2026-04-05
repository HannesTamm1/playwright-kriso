/**
 * Part II — Page Object Model tests
 * Test suite: Add Books to Shopping Cart
 *
 * Mirrors the structure of the Selenium reference (Jest-Selenium-Kriso/tests/cart.test.js).
 * Compare with tests/flat/cart.spec.ts — the test names and sequence are the same;
 * only the implementation differs: page objects replace raw selectors.
 *
 *   Flat:   await page.locator('.order-qty > .o-value').textContent()  →  parse  →  expect
 *   POM:    await cart.verifyCartQuantity(2)
 *
 * Assertions live inside page methods — tests are one or two method calls each.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';

test.describe.configure({ mode: 'serial' });

let page: Page;
let home: HomePage;
let cart: CartPage;
let cartSumOfTwo = 0;
let cartSumOfOne = 0;

test.describe('Add Books to Shopping Cart (POM)', () => {

  // use beforeAll when you need an action before ALL tests
  // use beforeEach when you need an action before EACH test

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    home = new HomePage(page);
    
    await home.openUrl();
    await home.acceptCookies();
  });

  test.afterAll(async () => {
    await page.context().close();
  });


  test('Test logo element is visible', async () => {
    await home.verifyLogo();
  });

  test('Test search by keyword', async () => {
    await home.search('harry potter');
    await home.verifyResultsCount();
  });

  test('Test add first item to shopping cart', async () => {
    await home.addToCart(0);
    await home.verifyItemAddedToCart();
    await home.verifyCartCount('1');
  });

  test('Test continue shopping', async () => {
    await home.continueShopping();
  });

  test('Test add second item to shopping cart', async () => {
    await home.addToCart(5);
    await home.verifyItemAddedToCart();
    await home.verifyCartCount('2');
  });

  test('Test verify cart has two items', async () => {
    cart = await home.openShoppingCart();
    await cart.verifyCartQuantity(2);
  });

  test('Test verify cart has correct sum of two', async () => {
    cartSumOfTwo = await cart.verifyCartSumIsCorrect();
  });

  test('Test remove one item from the shopping cart', async () => {
    await cart.removeItemFromCart(0);
    await cart.verifyCartQuantity(1);
  });

  test('Test verify cart has correct sum of one', async () => {
    cartSumOfOne = await cart.verifyCartSumIsCorrect();
    expect(cartSumOfOne).toBeLessThan(cartSumOfTwo);
  });

});
