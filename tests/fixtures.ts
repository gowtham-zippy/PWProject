import { test as base, expect } from '@playwright/test';
import { ContactManagerPage } from './pages/ContactManagerPage';
import { ContactsApi } from './api/ContactsApi';
import type { Contact } from './types';

interface Fixtures {
  contactManagerPage: ContactManagerPage;
  contactsApi: ContactsApi;
  /** Resets the store and seeds the standard 3 contacts before every test. */
  seededContacts: Contact[];
}

export const test = base.extend<Fixtures>({
  contactManagerPage: async ({ page }, use) => {
    await use(new ContactManagerPage(page));
  },

  contactsApi: async ({ request }, use) => {
    await use(new ContactsApi(request));
  },

  seededContacts: [
    async ({ contactsApi }, use) => {
      const contacts = await contactsApi.resetAndSeed();
      await use(contacts);
    },
    { auto: true },
  ],
});

export { expect };
