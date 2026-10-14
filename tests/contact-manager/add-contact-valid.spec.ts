// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Add a new contact with valid data', async ({ contactManagerPage }) => {
    // 1. Navigate to the app, then click the add-contact-button
    await contactManagerPage.goto();
    await contactManagerPage.openAddContactModal();

    // 2. Fill name-input with 'Test User', email-input with 'test.user@example.com', and phone-input with '555-0199', then click save-contact-button
    await contactManagerPage.addContactModal.fill({
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '555-0199',
    });
    await contactManagerPage.addContactModal.save();

    await contactManagerPage.addContactModal.expectHidden();
    await contactManagerPage.toast.expectMessage('Contact added');

    const newRow = contactManagerPage.table.rowContaining('test.user@example.com');
    await expect(newRow).toBeVisible();
    await expect(newRow).toContainText('Test User');
    await expect(newRow).toContainText('test.user@example.com');
    await expect(newRow).toContainText('555-0199');
  });
});
