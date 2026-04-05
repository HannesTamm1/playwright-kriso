import { Page, Locator, expect } from '@playwright/test';
import { CartPage } from './CartPage';

// ── Selectors ──────────────────────────────────────────────────────────────
const homePageUrl    = 'https://www.kriso.ee/';
const logoSelector   = '.logo-icon';
const resultsTotal   = '.sb-results-total';
const addToCartLink  = 'Lisa ostukorvi';   
const cartMessage    = '.item-messagebox';
const cartProducts   = '.cart-products';
const cartBackBtn    = '.cartbtn-event.back';
const cartForwardBtn = '.cartbtn-event.forward';

export class HomePage {

  private readonly logo: Locator;
  private readonly consentButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly resultsTotalEl: Locator;
  private readonly addToCartLinks: Locator;
  private readonly cartMessageEl: Locator;
  private readonly cartProductsEl: Locator;
  private readonly continueShoppingBtn: Locator;
  private readonly goToCartBtn: Locator;

  constructor(private page: Page) {
    this.logo               = page.locator(logoSelector);
    this.consentButton      = page.getByRole('button', { name: 'Nõustun' });
    this.searchInput        = page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
    this.searchButton       = page.getByRole('button', { name: 'Search' });
    this.resultsTotalEl     = page.locator(resultsTotal);
    this.addToCartLinks     = page.getByRole('link', { name: addToCartLink });
    this.cartMessageEl      = page.locator(cartMessage);
    this.cartProductsEl     = page.locator(cartProducts);
    this.continueShoppingBtn = page.locator(cartBackBtn);
    this.goToCartBtn        = page.locator(cartForwardBtn);
  }

  async openUrl(): Promise<void> {
    await this.page.goto(homePageUrl);
  }

  async acceptCookies(): Promise<void> {
    await this.consentButton.click();
  }

  async verifyLogo(): Promise<void> {
    await expect(this.logo).toBeVisible();
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async verifyResultsCount(): Promise<void> {
    const text = await this.resultsTotalEl.textContent() ?? '';
    const count = Number(text.replace(/\D/g, '')) || 0;
    expect(count).toBeGreaterThan(1);
  }

  async addToCart(index: number): Promise<void> {
    await this.addToCartLinks.nth(index).click();
  }

  async verifyItemAddedToCart(): Promise<void> {
    await expect(this.cartMessageEl).toContainText('Toode lisati ostukorvi');
  }

  async verifyCartCount(count: string): Promise<void> {
    await expect(this.cartProductsEl).toContainText(count);
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingBtn.click();
  }

  async openShoppingCart(): Promise<CartPage> {
    await this.goToCartBtn.click();
    return new CartPage(this.page);
  }
}
