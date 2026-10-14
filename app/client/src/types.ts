export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type ContactInput = Omit<Contact, 'id'>;

export interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  general?: string;
}
