import { useEffect, useState, useCallback } from 'react';
import { api, ApiError } from './api';
import type { Contact, ContactInput, FieldErrors } from './types';
import { ContactList } from './components/ContactList';
import { ContactForm } from './components/ContactForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';

type SortOrder = 'asc' | 'desc' | null;

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [formErrors, setFormErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(() => {
    api
      .list({ search: search || undefined, sort: sortOrder ?? undefined })
      .then(setContacts)
      .catch(() => showToast('Failed to load contacts', 'error'))
      .finally(() => setLoading(false));
  }, [search, sortOrder]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(input: ContactInput) {
    setFormErrors({});
    api
      .create(input)
      .then(() => {
        setShowAddForm(false);
        showToast('Contact added', 'success');
        loadContacts();
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          setFormErrors(err.errors);
          showToast(err.errors.general ?? 'Invalid contact data', 'error');
        }
      });
  }

  function handleEditSave(input: ContactInput) {
    if (!editingContact) return;
    setFormErrors({});
    api
      .update(editingContact.id, input)
      .then(() => {
        setEditingContact(null);
        showToast('Contact updated', 'success');
        loadContacts();
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          setFormErrors(err.errors);
          showToast(err.errors.general ?? 'Invalid contact data', 'error');
        }
      });
  }

  function handleDeleteConfirm() {
    if (!deletingContact) return;
    const target = deletingContact;
    api
      .remove(target.id)
      .then(() => {
        setDeletingContact(null);
        showToast('Contact deleted', 'success');
        loadContacts();
      })
      .catch(() => showToast('Failed to delete contact', 'error'));
  }

  function toggleSort() {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }

  return (
    <div className="app">
      <h1>Contact Manager</h1>

      <div className="toolbar">
        <input
          data-testid="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button data-testid="sort-name-button" onClick={toggleSort}>
          Sort by name: {sortOrder === 'asc' ? 'A→Z' : sortOrder === 'desc' ? 'Z→A' : 'none'}
        </button>
        <button
          data-testid="new-contact-button"
          onClick={() => {
            setFormErrors({});
            setShowAddForm(true);
          }}
        >
          Add Contact
        </button>
      </div>

      {loading ? (
        <p data-testid="loading">Loading...</p>
      ) : (
        <ContactList
          contacts={contacts}
          onEdit={(contact) => {
            setFormErrors({});
            setEditingContact(contact);
          }}
          onDelete={(contact) => setDeletingContact(contact)}
        />
      )}

      {showAddForm && (
        <div className="modal-overlay" data-testid="add-contact-modal">
          <div className="modal">
            <ContactForm
              errors={formErrors}
              onSubmit={handleAdd}
              onCancel={() => {
                setShowAddForm(false);
                setFormErrors({});
              }}
            />
          </div>
        </div>
      )}

      {editingContact && (
        <div className="modal-overlay" data-testid="edit-contact-modal">
          <div className="modal">
            <ContactForm
              initial={editingContact}
              errors={formErrors}
              onSubmit={handleEditSave}
              onCancel={() => {
                setEditingContact(null);
                setFormErrors({});
              }}
            />
          </div>
        </div>
      )}

      {deletingContact && (
        <ConfirmDialog
          title="Delete contact"
          message={`Do you really want to remove ${deletingContact.name} from your contacts?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingContact(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
