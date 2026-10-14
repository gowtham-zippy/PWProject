import { expect, type Locator, type Page } from '@playwright/test';

/** Toast notification shown after add/edit/delete actions. */
export class Toast {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('toast');
  }

  async expectMessage(message: string): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.root).toHaveText(message);
  }
}
