import { expect, type Locator, type Page } from '@playwright/test';

/** Real-time name search input. */
export class SearchBar {
  readonly input: Locator;

  constructor(page: Page) {
    this.input = page.getByTestId('search-input');
  }

  async search(term: string): Promise<void> {
    await this.input.fill(term);
  }

  async clear(): Promise<void> {
    await this.input.fill('');
  }

  async expectValue(value: string): Promise<void> {
    await expect(this.input).toHaveValue(value);
  }
}
