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

  test('Search for a contact by partial name', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API, navigate to the app, then type 'ada' into search-input
    await page.goto('http://localhost:5173');

    const [ada, grace, alan] = contacts;
    const searchInput = page.getByTestId('search-input');
    const table = page.getByTestId('contact-table');

    await searchInput.fill('ada');

    await expect(table.getByTestId(`contact-row-${ada.id}`)).toBeVisible();
    await expect(table.getByTestId(`contact-row-${grace.id}`)).not.toBeVisible();
    await expect(table.getByTestId(`contact-row-${alan.id}`)).not.toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(1);

    // 2. Clear the search-input completely
    await searchInput.fill('');

    await expect(table.getByTestId(`contact-row-${ada.id}`)).toBeVisible();
    await expect(table.getByTestId(`contact-row-${grace.id}`)).toBeVisible();
    await expect(table.getByTestId(`contact-row-${alan.id}`)).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(3);
  });
});
