// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Add a contact with empty name', async ({ contactManagerPage }) => {
    // 1. Navigate to the app, record the current number of rows in contact-table, then click add-contact-button to open the modal
    await contactManagerPage.goto();
    await contactManagerPage.table.waitForFirstRow();
    const rowCountBefore = await contactManagerPage.table.rowCount();

    await contactManagerPage.openAddContactModal();

    // 2. Leave name-input empty, fill email-input with a valid email such as 'valid@example.com', and click save-contact-button
    await contactManagerPage.addContactModal.fill({ email: 'valid@example.com' });
    await contactManagerPage.addContactModal.save();

    await contactManagerPage.addContactModal.expectNameError('Name is required');
    await contactManagerPage.toast.expectMessage('Invalid contact data');

    await expect(contactManagerPage.addContactModal.root).toBeVisible();
    await contactManagerPage.table.expectRowCount(rowCountBefore);
  });
});
