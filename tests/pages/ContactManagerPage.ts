import { expect, type Locator, type Page } from '@playwright/test';
import { ContactTable } from './components/ContactTable';
import { SearchBar } from './components/SearchBar';
import { SortByNameButton } from './components/SortByNameButton';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import { AddContactModal } from './components/AddContactModal';
import { EditContactModal } from './components/EditContactModal';

/**
 * Top-level page object for the Contact Manager app. Composes the smaller,
 * single-purpose components rather than exposing raw locators (SRP), so
 * tests only depend on this public API (DIP).
 */
export class ContactManagerPage {
  readonly table: ContactTable;
  readonly searchBar: SearchBar;
  readonly sortByNameButton: SortByNameButton;
  readonly toast: Toast;
  readonly confirmDialog: ConfirmDialog;
  readonly addContactModal: AddContactModal;
  readonly editContactModal: EditContactModal;

  private readonly heading: Locator;
  private readonly newContactButton: Locator;
  private readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.table = new ContactTable(page);
    this.searchBar = new SearchBar(page);
    this.sortByNameButton = new SortByNameButton(page);
    this.toast = new Toast(page);
    this.confirmDialog = new ConfirmDialog(page);
    this.addContactModal = new AddContactModal(page);
    this.editContactModal = new EditContactModal(page);

    this.heading = page.getByRole('heading', { name: 'Contact Manager' });
    this.newContactButton = page.getByTestId('new-contact-button');
    this.emptyState = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async openAddContactModal(): Promise<void> {
    await this.newContactButton.click();
    await this.addContactModal.expectVisible();
  }

  async openEditContactModal(id: string): Promise<void> {
    await this.table.editButton(id).click();
    await this.editContactModal.expectVisible();
  }

  async openDeleteConfirm(id: string): Promise<void> {
    await this.table.deleteButton(id).click();
    await this.confirmDialog.expectVisible();
  }

  async expectEmptyState(message: string): Promise<void> {
    await expect(this.page.getByTestId('contact-table')).toHaveCount(0);
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toHaveText(message);
  }
}
