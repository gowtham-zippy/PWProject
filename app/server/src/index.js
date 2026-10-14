const express = require('express');
const cors = require('cors');
const store = require('./store');
const { validateContact } = require('./validate');

const app = express();
const PORT = process.env.PORT || 3001;
const TEST_MODE_ENABLED = process.env.NODE_ENV !== 'production' || process.env.TEST_MODE === '1';

app.use(cors());
app.use(express.json());

app.get('/api/contacts', (req, res) => {
  const { search, sort } = req.query;
  let result = store.getAll();

  if (search) {
    const term = String(search).toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(term));
  }

  if (sort === 'asc' || sort === 'desc') {
    result = [...result].sort((a, b) =>
      sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }

  res.json(result);
});

app.post('/api/contacts', (req, res) => {
  const { valid, errors } = validateContact(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }
  const contact = store.add(req.body);
  res.status(201).json(contact);
});

app.put('/api/contacts/:id', (req, res) => {
  const { valid, errors } = validateContact(req.body, { partial: true });
  if (!valid) {
    return res.status(400).json({ errors });
  }
  const contact = store.update(req.params.id, req.body);
  if (!contact) {
    return res.status(404).json({ errors: { general: 'Contact not found' } });
  }
  res.json(contact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const removed = store.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ errors: { general: 'Contact not found' } });
  }
  res.status(204).end();
});

// Test-only endpoints, guarded outside production.
if (TEST_MODE_ENABLED) {
  app.post('/api/contacts/__reset', (req, res) => {
    res.json(store.reset());
  });

  app.post('/api/contacts/__seed', (req, res) => {
    res.json(store.seed());
  });
}

app.listen(PORT, () => {
  console.log(`Contact Manager API listening on http://localhost:${PORT}`);
});
