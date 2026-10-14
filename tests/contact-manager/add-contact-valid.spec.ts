// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Contact Manager', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/contacts/__reset');
    await request.post('/api/contacts/__seed');
  });

  test('Add a new contact with valid data', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API (request.post in test.beforeEach), navigate to the app, then click the add-contact-button
    await page.goto('http://localhost:5173');
    await page.getByTestId('new-contact-button').click();

    const modal = page.getByTestId('add-contact-modal');
    await expect(modal).toBeVisible();
    const form = modal.getByTestId('add-contact-form');
    await expect(form).toBeVisible();
    await expect(form.getByTestId('name-input')).toBeVisible();
    await expect(form.getByTestId('email-input')).toBeVisible();
    await expect(form.getByTestId('phone-input')).toBeVisible();
    await expect(form.getByTestId('save-contact-button')).toBeVisible();

    // 2. Fill name-input with 'Test User', email-input with 'test.user@example.com', and phone-input with '555-0199', then click save-contact-button
    await form.getByTestId('name-input').fill('Test User');
    await form.getByTestId('email-input').fill('test.user@example.com');
    await form.getByTestId('phone-input').fill('555-0199');
    await form.getByTestId('save-contact-button').click();

    await expect(modal).not.toBeVisible();

    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText('Contact added');

    const table = page.getByTestId('contact-table');
    const newRow = table.locator('tbody tr', { hasText: 'test.user@example.com' });
    await expect(newRow).toBeVisible();
    await expect(newRow).toContainText('Test User');
    await expect(newRow).toContainText('test.user@example.com');
    await expect(newRow).toContainText('555-0199');
  });
});
