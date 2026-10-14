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

  test("Edit an existing contact's phone number", async ({ page }) => {
    // 1. Reset and seed the contacts store via the API (request.post in test.beforeEach), navigate to the app, then click the edit-button-{id} for the row containing 'Ada Lovelace' (original phone '555-0100')
    const ada = contacts.find((contact) => contact.name === 'Ada Lovelace')!;

    await page.goto('http://localhost:5173');
    await page.getByTestId(`edit-button-${ada.id}`).click();

    const modal = page.getByTestId('edit-contact-modal');
    await expect(modal).toBeVisible();
    const form = modal.getByTestId('edit-contact-form');
    await expect(form).toBeVisible();
    await expect(form.getByTestId('name-input')).toHaveValue('Ada Lovelace');
    await expect(form.getByTestId('email-input')).toHaveValue('ada@example.com');
    await expect(form.getByTestId('phone-input')).toHaveValue('555-0100');

    // 2. Clear phone-input and type '555-9999', then click save-contact-button
    await form.getByTestId('phone-input').fill('555-9999');
    await form.getByTestId('save-contact-button').click();

    await expect(modal).not.toBeVisible();

    const toast = page.getByTestId('toast');
    await expect(toast).toHaveText('Contact updated');

    const row = page.getByTestId(`contact-row-${ada.id}`);
    await expect(row.getByTestId(`contact-name-${ada.id}`)).toHaveText('Ada Lovelace');
    await expect(row.getByTestId(`contact-email-${ada.id}`)).toHaveText('ada@example.com');
    await expect(row.getByTestId(`contact-phone-${ada.id}`)).toHaveText('555-9999');
  });
});
