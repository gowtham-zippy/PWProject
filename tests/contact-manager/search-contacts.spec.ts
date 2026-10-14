// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Search for a contact by partial name', async ({ contactManagerPage, seededContacts }) => {
    // 1. Navigate to the app, then type 'ada' into search-input
    const [ada, grace, alan] = seededContacts;

    await contactManagerPage.goto();
    await contactManagerPage.searchBar.search('ada');

    await expect(contactManagerPage.table.row(ada.id)).toBeVisible();
    await expect(contactManagerPage.table.row(grace.id)).not.toBeVisible();
    await expect(contactManagerPage.table.row(alan.id)).not.toBeVisible();
    await contactManagerPage.table.expectRowCount(1);

    // 2. Clear the search-input completely
    await contactManagerPage.searchBar.clear();

    await expect(contactManagerPage.table.row(ada.id)).toBeVisible();
    await expect(contactManagerPage.table.row(grace.id)).toBeVisible();
    await expect(contactManagerPage.table.row(alan.id)).toBeVisible();
    await contactManagerPage.table.expectRowCount(3);
  });
});
