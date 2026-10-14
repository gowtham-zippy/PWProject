import type { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <p className="empty-state" data-testid="empty-state">
        No contacts found.
      </p>
    );
  }

  return (
    <table className="contact-table" data-testid="contact-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} data-testid={`contact-row-${contact.id}`}>
            <td data-testid={`contact-name-${contact.id}`}>{contact.name}</td>
            <td data-testid={`contact-email-${contact.id}`}>{contact.email}</td>
            <td data-testid={`contact-phone-${contact.id}`}>{contact.phone}</td>
            <td>
              <button data-testid={`edit-button-${contact.id}`} onClick={() => onEdit(contact)}>
                Edit
              </button>
              <button
                data-testid={`delete-button-${contact.id}`}
                className="danger"
                onClick={() => onDelete(contact)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
