// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Delete a contact with confirm/cancel', async ({ contactManagerPage, seededContacts }) => {
    // 1. Navigate to the app, then click delete-button-{id} for the row containing 'Grace Hopper'
    const grace = seededContacts.find((contact) => contact.name === 'Grace Hopper')!;

    await contactManagerPage.goto();
    await contactManagerPage.openDeleteConfirm(grace.id);
    await contactManagerPage.confirmDialog.expectMessage(
      'Do you really want to remove Grace Hopper from your contacts?',
    );

    // 2. Click cancel-delete-button
    await contactManagerPage.confirmDialog.cancel();

    await contactManagerPage.confirmDialog.expectHidden();
    const row = contactManagerPage.table.row(grace.id);
    await expect(row).toBeVisible();

    // 3. Click delete-button-{id} for 'Grace Hopper' again, then click confirm-delete-button in the confirm-dialog
    await contactManagerPage.openDeleteConfirm(grace.id);
    await contactManagerPage.confirmDialog.confirm();

    await contactManagerPage.confirmDialog.expectHidden();
    await contactManagerPage.toast.expectMessage('Contact deleted');
    await expect(row).not.toBeVisible();
  });
});
