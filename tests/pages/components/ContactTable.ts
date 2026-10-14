import { expect, type Locator, type Page } from '@playwright/test';

/** The contact list table and its rows. */
export class ContactTable {
  readonly root: Locator;
  readonly rows: Locator;
  readonly nameColumnCells: Locator;
  readonly headerColumns: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('contact-table');
    this.rows = this.root.locator('tbody tr');
    this.nameColumnCells = this.root.locator('tbody tr td:first-child');
    this.headerColumns = this.root.locator('thead tr').getByRole('columnheader');
  }

  row(id: string): Locator {
    return this.page.getByTestId(`contact-row-${id}`);
  }

  nameCell(id: string): Locator {
    return this.row(id).getByTestId(`contact-name-${id}`);
  }

  emailCell(id: string): Locator {
    return this.row(id).getByTestId(`contact-email-${id}`);
  }

  phoneCell(id: string): Locator {
    return this.row(id).getByTestId(`contact-phone-${id}`);
  }

  editButton(id: string): Locator {
    return this.row(id).getByTestId(`edit-button-${id}`);
  }

  deleteButton(id: string): Locator {
    return this.row(id).getByTestId(`delete-button-${id}`);
  }

  rowContaining(text: string): Locator {
    return this.root.locator('tbody tr', { hasText: text });
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async waitForFirstRow(): Promise<void> {
    await expect(this.rows.first()).toBeVisible();
  }

  async rowCount(): Promise<number> {
    return this.rows.count();
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.rows).toHaveCount(count);
  }
}
