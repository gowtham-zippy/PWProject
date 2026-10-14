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

  test('Reload the page and verify persistence', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API (request.post in test.beforeEach), navigate to the app, add a new contact named 'Persisted Person' with email 'persisted@example.com' and phone '555-1234' via add-contact-button/add-contact-form/save-contact-button, then edit 'Ada Lovelace' via edit-button to change her phone to '555-7777' and save
    const ada = contacts.find((contact) => contact.name === 'Ada Lovelace')!;

    await page.goto('http://localhost:5173');
    await page.getByTestId('new-contact-button').click();

    const addModal = page.getByTestId('add-contact-modal');
    const addForm = addModal.getByTestId('add-contact-form');
    await addForm.getByTestId('name-input').fill('Persisted Person');
    await addForm.getByTestId('email-input').fill('persisted@example.com');
    await addForm.getByTestId('phone-input').fill('555-1234');
    await addForm.getByTestId('save-contact-button').click();

    await expect(addModal).not.toBeVisible();

    const toast = page.getByTestId('toast');
    await expect(toast).toHaveText('Contact added');

    await page.getByTestId(`edit-button-${ada.id}`).click();

    const editModal = page.getByTestId('edit-contact-modal');
    const editForm = editModal.getByTestId('edit-contact-form');
    await editForm.getByTestId('phone-input').fill('555-7777');
    await editForm.getByTestId('save-contact-button').click();

    await expect(editModal).not.toBeVisible();
    await expect(toast).toHaveText('Contact updated');

    const table = page.getByTestId('contact-table');
    const persistedRow = table.locator('tbody tr', { hasText: 'persisted@example.com' });
    await expect(persistedRow).toContainText('Persisted Person');
    await expect(persistedRow).toContainText('555-1234');

    const adaRow = page.getByTestId(`contact-row-${ada.id}`);
    await expect(adaRow.getByTestId(`contact-phone-${ada.id}`)).toHaveText('555-7777');

    // 2. Reload the page (full page navigation/refresh)
    await page.reload();

    const persistedRowAfterReload = table.locator('tbody tr', { hasText: 'persisted@example.com' });
    await expect(persistedRowAfterReload).toContainText('Persisted Person');
    await expect(persistedRowAfterReload).toContainText('555-1234');

    await expect(adaRow.getByTestId(`contact-phone-${ada.id}`)).toHaveText('555-7777');
  });
});
