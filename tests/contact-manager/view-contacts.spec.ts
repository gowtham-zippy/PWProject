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

async function resetContacts(request: APIRequestContext) {
  await request.post('/api/contacts/__reset');
}

async function seedContacts(request: APIRequestContext): Promise<Contact[]> {
  const response = await request.post('/api/contacts/__seed');
  return response.json();
}

test.describe('Contact Manager', () => {
  let contacts: Contact[];

  test.beforeEach(async ({ request }) => {
    await resetContacts(request);
    contacts = await seedContacts(request);
  });

  test('Page loads and shows existing contacts (or empty state when none exist)', async ({ page, request }) => {
    // 1. Call POST /api/contacts/__reset then POST /api/contacts/__seed (via request fixture, in test.beforeEach) to ensure a known set of 3 contacts (Ada Lovelace, Grace Hopper, Alan Turing) exists, then navigate to http://localhost:5173
    await page.goto('http://localhost:5173');

    await expect(page.getByRole('heading', { name: 'Contact Manager' })).toBeVisible();

    const table = page.getByTestId('contact-table');
    await expect(table).toBeVisible();
    const headerRow = table.locator('thead tr');
    await expect(headerRow.getByRole('columnheader')).toHaveText(['Name', 'Email', 'Phone', 'Actions']);

    const [ada, grace, alan] = contacts;

    const adaRow = page.getByTestId(`contact-row-${ada.id}`);
    await expect(adaRow.getByTestId(`contact-name-${ada.id}`)).toHaveText(ada.name);
    await expect(adaRow.getByTestId(`contact-email-${ada.id}`)).toHaveText(ada.email);
    await expect(adaRow.getByTestId(`contact-phone-${ada.id}`)).toHaveText(ada.phone);
    await expect(adaRow.getByTestId(`edit-button-${ada.id}`)).toBeVisible();
    await expect(adaRow.getByTestId(`delete-button-${ada.id}`)).toBeVisible();

    const graceRow = page.getByTestId(`contact-row-${grace.id}`);
    await expect(graceRow.getByTestId(`contact-name-${grace.id}`)).toHaveText(grace.name);
    await expect(graceRow.getByTestId(`contact-email-${grace.id}`)).toHaveText(grace.email);
    await expect(graceRow.getByTestId(`contact-phone-${grace.id}`)).toHaveText(grace.phone);
    await expect(graceRow.getByTestId(`edit-button-${grace.id}`)).toBeVisible();
    await expect(graceRow.getByTestId(`delete-button-${grace.id}`)).toBeVisible();

    const alanRow = page.getByTestId(`contact-row-${alan.id}`);
    await expect(alanRow.getByTestId(`contact-name-${alan.id}`)).toHaveText(alan.name);
    await expect(alanRow.getByTestId(`contact-email-${alan.id}`)).toHaveText(alan.email);
    await expect(alanRow.getByTestId(`contact-phone-${alan.id}`)).toHaveText(alan.phone);
    await expect(alanRow.getByTestId(`edit-button-${alan.id}`)).toBeVisible();
    await expect(alanRow.getByTestId(`delete-button-${alan.id}`)).toBeVisible();

    // 2. Call POST /api/contacts/__reset to clear all contacts, then reload the page
    await resetContacts(request);
    await page.reload();

    await expect(page.getByTestId('contact-table')).toHaveCount(0);
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toHaveText('No contacts found.');
  });
});
