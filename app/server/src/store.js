const { randomUUID } = require('crypto');

function seedContacts() {
  return [
    { id: randomUUID(), name: 'Ada Lovelace', email: 'ada@example.com', phone: '555-0100' },
    { id: randomUUID(), name: 'Grace Hopper', email: 'grace@example.com', phone: '555-0101' },
    { id: randomUUID(), name: 'Alan Turing', email: 'alan@example.com', phone: '555-0102' },
  ];
}

let contacts = seedContacts();

module.exports = {
  getAll() {
    return contacts;
  },
  getById(id) {
    return contacts.find((c) => c.id === id);
  },
  add({ name, email, phone }) {
    const contact = { id: randomUUID(), name, email, phone };
    contacts.push(contact);
    return contact;
  },
  update(id, { name, email, phone }) {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return null;
    if (name !== undefined) contact.name = name;
    if (email !== undefined) contact.email = email;
    if (phone !== undefined) contact.phone = phone;
    return contact;
  },
  remove(id) {
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;
    contacts.splice(index, 1);
    return true;
  },
  reset() {
    contacts = [];
    return contacts;
  },
  seed() {
    contacts = seedContacts();
    return contacts;
  },
};
