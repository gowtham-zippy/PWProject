// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Contact Manager', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/contacts/__reset');
    await request.post('/api/contacts/__seed');
  });

  test('Add a contact with invalid email', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API (request.post in test.beforeEach), navigate to the app, and record the current number of rows in contact-table. Click add-contact-button to open the modal
    await page.goto('http://localhost:5173');

    const table = page.getByTestId('contact-table');
    await expect(table.locator('tbody tr').first()).toBeVisible();
    const rowCountBefore = await table.locator('tbody tr').count();

    await page.getByTestId('new-contact-button').click();

    const modal = page.getByTestId('add-contact-modal');
    await expect(modal).toBeVisible();

    // 2. Fill name-input with 'Test User' and email-input with 'not-an-email' (leave phone-input empty), then click save-contact-button
    await modal.getByTestId('name-input').fill('Test User');
    await modal.getByTestId('email-input').fill('not-an-email');
    await modal.getByTestId('save-contact-button').click();

    await expect(modal.getByTestId('email-error')).toHaveText('A valid email is required');

    const toast = page.getByTestId('toast');
    await expect(toast).toHaveText('Invalid contact data');

    await expect(modal).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(rowCountBefore);
  });
});
