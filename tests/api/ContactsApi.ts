import type { APIRequestContext } from '@playwright/test';
import type { Contact } from '../types';

/** Thin wrapper around the test-only contacts seeding/reset endpoints. */
export class ContactsApi {
  constructor(private readonly request: APIRequestContext) {}

  async reset(): Promise<void> {
    await this.request.post('/api/contacts/__reset');
  }

  async seed(): Promise<Contact[]> {
    const response = await this.request.post('/api/contacts/__seed');
    return response.json();
  }

  async resetAndSeed(): Promise<Contact[]> {
    await this.reset();
    return this.seed();
  }
}
