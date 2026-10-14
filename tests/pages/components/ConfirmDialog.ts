import { expect, type Locator, type Page } from '@playwright/test';

/** Confirm/cancel dialog shown before deleting a contact. */
export class ConfirmDialog {
  readonly root: Locator;
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('confirm-dialog');
    this.confirmButton = this.root.getByTestId('confirm-delete-button');
    this.cancelButton = this.root.getByTestId('cancel-delete-button');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.confirmButton).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).not.toBeVisible();
  }

  async expectMessage(message: string): Promise<void> {
    await expect(this.root).toContainText(message);
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
