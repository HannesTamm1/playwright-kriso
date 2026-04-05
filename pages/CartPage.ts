import { Page, Locator, expect } from '@playwright/test';

// ── Selectors ──────────────────────────────────────────────────────────────
const cartQuantity  = '.order-qty > .o-value';
const cartRowItems  = '.tbl-row > .subtotal';
const cartSum       = '.order-total > .o-value';
const cartItemRow   = '.tbl-row';
const cartRemoveBtn = '.icon-remove';

export class CartPage {

  private readonly cartQuantityEl: Locator;
  private readonly cartRowItemsEl: Locator;
  private readonly cartSumEl: Locator;
  private readonly cartItemRowEl: Locator;
  private readonly cartRemoveBtnEl: Locator;

  constructor(private page: Page) {
    this.cartQuantityEl  = page.locator(cartQuantity);
    this.cartRowItemsEl  = page.locator(cartRowItems);
    this.cartSumEl       = page.locator(cartSum);
    this.cartItemRowEl   = page.locator(cartItemRow);
    this.cartRemoveBtnEl = page.locator(cartRemoveBtn);
  }

  async verifyCartQuantity(number: number): Promise<void> {
    await expect(this.cartQuantityEl).toContainText(number.toString());
  }

  // Asserts that the displayed total equals the sum of all row prices,
  // then returns the sum so the test can compare two-item vs one-item totals.
  // This mirrors verifyCartSumIsCorrect() from the reference cartPage.js exactly.
  async verifyCartSumIsCorrect(): Promise<number> {
    const cartItems = await this.cartRowItemsEl.all();

    let cartItemsSum = 0;
    for (const item of cartItems) {
      cartItemsSum += parseFloat(
        (await item.textContent() ?? '').replace(/€/g, '').replace(',', '.').trim()
      );
    }

    const basketSum = await this.cartSumEl.textContent() ?? '';
    const basketSumNum = parseFloat(basketSum.replace(/€/g, '').replace(',', '.').trim());

    expect(basketSumNum).toBeCloseTo(cartItemsSum, 2);
    return cartItemsSum;
  }

  async removeItemFromCart(index: number): Promise<void> {
    await this.cartItemRowEl.nth(index).locator(cartRemoveBtn).click();
  }
}
