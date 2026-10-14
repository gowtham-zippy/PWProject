// spec: specs/contact-manager.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Contact Manager', () => {
  test('Sort contacts by name ascending/descending', async ({ contactManagerPage }) => {
    // 1. Navigate to the app, and confirm sort-name-button initially shows label 'Sort by name: none'
    await contactManagerPage.goto();

    await contactManagerPage.sortByNameButton.expectLabel('Sort by name: none');
    await expect(contactManagerPage.table.nameColumnCells).toHaveText([
      'Ada Lovelace',
      'Grace Hopper',
      'Alan Turing',
    ]);

    // 2. Click sort-name-button once
    await contactManagerPage.sortByNameButton.click();

    await contactManagerPage.sortByNameButton.expectLabel('Sort by name: A→Z');
    await expect(contactManagerPage.table.nameColumnCells).toHaveText([
      'Ada Lovelace',
      'Alan Turing',
      'Grace Hopper',
    ]);

    // 3. Click sort-name-button a second time
    await contactManagerPage.sortByNameButton.click();

    await contactManagerPage.sortByNameButton.expectLabel('Sort by name: Z→A');
    await expect(contactManagerPage.table.nameColumnCells).toHaveText([
      'Grace Hopper',
      'Alan Turing',
      'Ada Lovelace',
    ]);
  });
});
