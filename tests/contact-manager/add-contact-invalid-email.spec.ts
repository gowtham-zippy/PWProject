// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Add a contact with invalid email', async ({ contactManagerPage }) => {
    // 1. Navigate to the app, record the current number of rows in contact-table, then click add-contact-button to open the modal
    await contactManagerPage.goto();
    await contactManagerPage.table.waitForFirstRow();
    const rowCountBefore = await contactManagerPage.table.rowCount();

    await contactManagerPage.openAddContactModal();

    // 2. Fill name-input with 'Test User' and email-input with 'not-an-email' (leave phone-input empty), then click save-contact-button
    await contactManagerPage.addContactModal.fill({ name: 'Test User', email: 'not-an-email' });
    await contactManagerPage.addContactModal.save();

    await contactManagerPage.addContactModal.expectEmailError('A valid email is required');
    await contactManagerPage.toast.expectMessage('Invalid contact data');

    await expect(contactManagerPage.addContactModal.root).toBeVisible();
    await contactManagerPage.table.expectRowCount(rowCountBefore);
  });
});
