// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Page loads and shows existing contacts (or empty state when none exist)', async ({
    contactManagerPage,
    contactsApi,
    seededContacts,
  }) => {
    // 1. Navigate to the app, which already has 3 seeded contacts (Ada Lovelace, Grace Hopper, Alan Turing)
    await contactManagerPage.goto();
    await contactManagerPage.expectLoaded();

    await contactManagerPage.table.expectVisible();
    await expect(contactManagerPage.table.headerColumns).toHaveText(['Name', 'Email', 'Phone', 'Actions']);

    const [ada, grace, alan] = seededContacts;

    for (const contact of [ada, grace, alan]) {
      const row = contactManagerPage.table.row(contact.id);
      await expect(contactManagerPage.table.nameCell(contact.id)).toHaveText(contact.name);
      await expect(contactManagerPage.table.emailCell(contact.id)).toHaveText(contact.email);
      await expect(contactManagerPage.table.phoneCell(contact.id)).toHaveText(contact.phone);
      await expect(contactManagerPage.table.editButton(contact.id)).toBeVisible();
      await expect(contactManagerPage.table.deleteButton(contact.id)).toBeVisible();
      await expect(row).toBeVisible();
    }

    // 2. Reset the store (clearing all contacts) and reload the page
    await contactsApi.reset();
    await contactManagerPage.reload();

    await contactManagerPage.expectEmptyState('No contacts found.');
  });
});
