const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(body, { partial = false } = {}) {
  const errors = {};
  const { name, email, phone } = body || {};

  if (!partial || name !== undefined) {
    if (!name || !String(name).trim()) {
      errors.name = 'Name is required';
    }
  }

  if (!partial || email !== undefined) {
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      errors.email = 'A valid email is required';
    }
  }

  if (!partial || phone !== undefined) {
    if (phone !== undefined && phone !== '' && !/^[0-9+\-() .]{3,20}$/.test(String(phone).trim())) {
      errors.phone = 'Phone number looks invalid';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = { validateContact };
