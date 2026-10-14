import { useState } from 'react';
import type { Contact, ContactInput, FieldErrors } from '../types';

interface ContactFormProps {
  initial?: Contact;
  errors: FieldErrors;
  onSubmit: (input: ContactInput) => void;
  onCancel: () => void;
}

export function ContactForm({ initial, errors, onSubmit, onCancel }: ContactFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const isEdit = Boolean(initial);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  }

  return (
    <form
      className="contact-form"
      data-testid={isEdit ? 'edit-contact-form' : 'add-contact-form'}
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label htmlFor="name-input">Name</label>
        <input
          id="name-input"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <span className="field-error" data-testid="name-error">
            {errors.name}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="email-input">Email</label>
        <input
          id="email-input"
          data-testid="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <span className="field-error" data-testid="email-error">
            {errors.email}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="phone-input">Phone</label>
        <input
          id="phone-input"
          data-testid="phone-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && (
          <span className="field-error" data-testid="phone-error">
            {errors.phone}
          </span>
        )}
      </div>
      <div className="form-actions">
        <button type="button" data-testid="cancel-form-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" data-testid="save-contact-button">
          {isEdit ? 'Save' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}
