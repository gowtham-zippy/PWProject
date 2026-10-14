import { expect, type Locator, type Page } from '@playwright/test';
import type { ContactFormData } from '../../types';

/**
 * Base class for the add/edit contact modals. Both modals expose the same
 * name/email/phone fields and validation errors, differing only in their
 * `data-testid`s, so concrete subclasses just supply those ids (Open/Closed).
 */
export class ContactFormModal {
  readonly root: Locator;
  private readonly form: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page, modalTestId: string, formTestId: string) {
    this.root = page.getByTestId(modalTestId);
    this.form = this.root.getByTestId(formTestId);
    this.nameInput = this.form.getByTestId('name-input');
    this.emailInput = this.form.getByTestId('email-input');
    this.phoneInput = this.form.getByTestId('phone-input');
    this.saveButton = this.form.getByTestId('save-contact-button');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.form).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).not.toBeVisible();
  }

  async fill(data: ContactFormData): Promise<void> {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
  }

  async expectFieldValues(data: Required<ContactFormData>): Promise<void> {
    await expect(this.nameInput).toHaveValue(data.name);
    await expect(this.emailInput).toHaveValue(data.email);
    await expect(this.phoneInput).toHaveValue(data.phone);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async expectNameError(message: string): Promise<void> {
    await expect(this.root.getByTestId('name-error')).toHaveText(message);
  }

  async expectEmailError(message: string): Promise<void> {
    await expect(this.root.getByTestId('email-error')).toHaveText(message);
  }
}
