// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

async function seedContacts(request: APIRequestContext): Promise<Contact[]> {
  await request.post('/api/contacts/__reset');
  const response = await request.post('/api/contacts/__seed');
  return response.json();
}

test.describe('Contact Manager', () => {
  let contacts: Contact[];

  test.beforeEach(async ({ request }) => {
    contacts = await seedContacts(request);
  });

  test('Delete a contact with confirm/cancel', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API (request.post in test.beforeEach), navigate to the app, then click delete-button-{id} for the row containing 'Grace Hopper'
    const grace = contacts.find((contact) => contact.name === 'Grace Hopper')!;

    await page.goto('http://localhost:5173');
    await page.getByTestId(`delete-button-${grace.id}`).click();

    const dialog = page.getByTestId('confirm-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Do you really want to remove Grace Hopper from your contacts?');
    await expect(dialog.getByTestId('cancel-delete-button')).toBeVisible();
    await expect(dialog.getByTestId('confirm-delete-button')).toBeVisible();

    // 2. Click cancel-delete-button
    await dialog.getByTestId('cancel-delete-button').click();

    await expect(dialog).not.toBeVisible();
    const row = page.getByTestId(`contact-row-${grace.id}`);
    await expect(row).toBeVisible();

    // 3. Click delete-button-{id} for 'Grace Hopper' again, then click confirm-delete-button in the confirm-dialog
    await page.getByTestId(`delete-button-${grace.id}`).click();
    await dialog.getByTestId('confirm-delete-button').click();

    await expect(dialog).not.toBeVisible();
    const toast = page.getByTestId('toast');
    await expect(toast).toHaveText('Contact deleted');
    await expect(row).not.toBeVisible();
  });
});
