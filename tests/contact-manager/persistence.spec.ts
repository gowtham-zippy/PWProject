// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Reload the page and verify persistence', async ({ contactManagerPage, seededContacts }) => {
    // 1. Navigate to the app, add a new contact named 'Persisted Person', then edit 'Ada Lovelace' to change her phone to '555-7777' and save
    const ada = seededContacts.find((contact) => contact.name === 'Ada Lovelace')!;

    await contactManagerPage.goto();
    await contactManagerPage.openAddContactModal();
    await contactManagerPage.addContactModal.fill({
      name: 'Persisted Person',
      email: 'persisted@example.com',
      phone: '555-1234',
    });
    await contactManagerPage.addContactModal.save();

    await contactManagerPage.addContactModal.expectHidden();
    await contactManagerPage.toast.expectMessage('Contact added');

    await contactManagerPage.openEditContactModal(ada.id);
    await contactManagerPage.editContactModal.fill({ phone: '555-7777' });
    await contactManagerPage.editContactModal.save();

    await contactManagerPage.editContactModal.expectHidden();
    await contactManagerPage.toast.expectMessage('Contact updated');

    const persistedRow = contactManagerPage.table.rowContaining('persisted@example.com');
    await expect(persistedRow).toContainText('Persisted Person');
    await expect(persistedRow).toContainText('555-1234');
    await expect(contactManagerPage.table.phoneCell(ada.id)).toHaveText('555-7777');

    // 2. Reload the page (full page navigation/refresh)
    await contactManagerPage.reload();

    const persistedRowAfterReload = contactManagerPage.table.rowContaining('persisted@example.com');
    await expect(persistedRowAfterReload).toContainText('Persisted Person');
    await expect(persistedRowAfterReload).toContainText('555-1234');
    await expect(contactManagerPage.table.phoneCell(ada.id)).toHaveText('555-7777');
  });
});
