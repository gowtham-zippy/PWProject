import type { Contact, ContactInput, FieldErrors } from './types';

export class ApiError extends Error {
  errors: FieldErrors;
  constructor(errors: FieldErrors) {
    super('Request failed');
    this.errors = errors;
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errors: FieldErrors = { general: 'Something went wrong' };
    try {
      const body = await res.json();
      if (body?.errors) errors = body.errors;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(errors);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  list(params: { search?: string; sort?: 'asc' | 'desc' } = {}): Promise<Contact[]> {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.sort) qs.set('sort', params.sort);
    const query = qs.toString();
    return fetch(`/api/contacts${query ? `?${query}` : ''}`).then((r) => handle<Contact[]>(r));
  },
  create(input: ContactInput): Promise<Contact> {
    return fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => handle<Contact>(r));
  },
  update(id: string, input: Partial<ContactInput>): Promise<Contact> {
    return fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => handle<Contact>(r));
  },
  remove(id: string): Promise<void> {
    return fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then((r) => handle<void>(r));
  },
};
