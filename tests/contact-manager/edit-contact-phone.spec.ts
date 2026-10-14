// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test("Edit an existing contact's phone number", async ({ contactManagerPage, seededContacts }) => {
    // 1. Navigate to the app, then click the edit-button-{id} for the row containing 'Ada Lovelace' (original phone '555-0100')
    const ada = seededContacts.find((contact) => contact.name === 'Ada Lovelace')!;

    await contactManagerPage.goto();
    await contactManagerPage.openEditContactModal(ada.id);
    await contactManagerPage.editContactModal.expectFieldValues({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '555-0100',
    });

    // 2. Clear phone-input and type '555-9999', then click save-contact-button
    await contactManagerPage.editContactModal.fill({ phone: '555-9999' });
    await contactManagerPage.editContactModal.save();

    await contactManagerPage.editContactModal.expectHidden();
    await contactManagerPage.toast.expectMessage('Contact updated');

    await expect(contactManagerPage.table.nameCell(ada.id)).toHaveText('Ada Lovelace');
    await expect(contactManagerPage.table.emailCell(ada.id)).toHaveText('ada@example.com');
    await expect(contactManagerPage.table.phoneCell(ada.id)).toHaveText('555-9999');
  });
});
