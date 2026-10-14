// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Contact Manager', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/contacts/__reset');
    await request.post('/api/contacts/__seed');
  });

  test('Sort contacts by name ascending/descending', async ({ page }) => {
    // 1. Reset and seed the contacts store via the API, navigate to the app, and confirm sort-name-button initially shows label 'Sort by name: none'
    await page.goto('http://localhost:5173');

    const sortButton = page.getByTestId('sort-name-button');
    const nameCells = page.getByTestId('contact-table').locator('tbody tr td:first-child');

    await expect(sortButton).toHaveText('Sort by name: none');
    await expect(nameCells).toHaveText(['Ada Lovelace', 'Grace Hopper', 'Alan Turing']);

    // 2. Click sort-name-button once
    await sortButton.click();

    await expect(sortButton).toHaveText('Sort by name: A→Z');
    await expect(nameCells).toHaveText(['Ada Lovelace', 'Alan Turing', 'Grace Hopper']);

    // 3. Click sort-name-button a second time
    await sortButton.click();

    await expect(sortButton).toHaveText('Sort by name: Z→A');
    await expect(nameCells).toHaveText(['Grace Hopper', 'Alan Turing', 'Ada Lovelace']);
  });
});
