import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
    this.musicBooksCategory = this.page.getByRole('link', { name: 'Muusikaraamatud ja noodid' });
    this.guitarCategory = this.page.getByRole('link', { name: 'Kitarr' });
    this.englishFilter = this.page.getByText('Inglise', { exact: true });
    this.cdFilter = this.page.getByText('CD', { exact: true });
    this.removeEnglishFilterButton = this.page.getByRole('link', { name: /Inglise/ });
    this.removeCdFilterButton = this.page.getByRole('link', { name: /CD/ });
    this.resultsTotal = this.page.getByText(/\d+ (toodet|tulemust)/);
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
    await this.removeEnglishFilterButton.first().click();
  }

  async removeCdFilter() {
    await this.removeCdFilterButton.first().click();
  }

  async getResultsCount() {
    const text = await this.resultsTotal.first().textContent();
    return Number((text || '').replace(/\D/g, '')) || 0;
  }

  async verifyResultsCountLessThan(count: number) {
    expect(await this.getResultsCount()).toBeLessThan(count);
  }

  async verifyResultsCount(count: number) {
    expect(await this.getResultsCount()).toBe(count);
  }
}