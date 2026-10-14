import { expect, type Locator, type Page } from '@playwright/test';

/** "Sort by name" toggle button, cycling none -> A->Z -> Z->A. */
export class SortByNameButton {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('sort-name-button');
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async expectLabel(label: string): Promise<void> {
    await expect(this.root).toHaveText(label);
  }
}
