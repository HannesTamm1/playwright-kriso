import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  private readonly musicBooksCategory: Locator;
  private readonly guitarCategory: Locator;
  private readonly englishFilter: Locator;
  private readonly cdFilter: Locator;
  private readonly removeEnglishFilterButton: Locator;
  private readonly removeCdFilterButton: Locator;
  private readonly resultsTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.musicBooksCategory = this.page.getByRole("link", {
      name: "Muusikaraamatud ja noodid",
    });
    this.guitarCategory = this.page.getByRole("link", { name: "Kitarr" });
    this.englishFilter = this.page.getByRole("link", { name: /^Inglise/ });
    this.cdFilter = this.page.getByRole("link", { name: /^CD \(/ });
    this.removeEnglishFilterButton = this.page
      .getByRole("listitem")
      .filter({ hasText: /^Keel: Inglise/ })
      .getByRole("link");
    this.removeCdFilterButton = this.page
      .getByRole("listitem")
      .filter({ hasText: /^Formaat: CD/ })
      .getByRole("link");
    this.resultsTotal = this.page.locator(".sb-results-total");
  }

  async openMusicBooksCategory() {
    await this.musicBooksCategory.first().click();
  }

  async openGuitarCategory() {
    await this.guitarCategory.first().click();
  }

  async filterByEnglish() {
    await this.englishFilter.first().click();
  }

  async filterByCd() {
    await this.cdFilter.first().click();
  }

  async removeEnglishFilter() {
    await this.removeEnglishFilterButton.click();
  }

  async removeCdFilter() {
    await this.removeCdFilterButton.click();
  }

  async getResultsCount() {
    const text = await this.resultsTotal.first().textContent();
    return Number((text || "").replace(/\D/g, "")) || 0;
  }

  async verifyResultsCountLessThan(count: number) {
    expect(await this.getResultsCount()).toBeLessThan(count);
  }

  async verifyResultsCount(count: number) {
    expect(await this.getResultsCount()).toBe(count);
  }
}
