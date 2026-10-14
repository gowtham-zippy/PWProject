# Contact Manager Test Plan

## Application Overview

The Contact Manager is a single-page React app (served at http://localhost:5173, API at http://localhost:3001 proxied via /api) for managing a list of contacts (name, email, phone). Core features: viewing contacts in a table (`contact-table`) with per-row testids (`contact-row-{id}`, `contact-name-{id}`, `contact-email-{id}`, `contact-phone-{id}`), an empty state (`empty-state`) when no contacts exist, adding contacts via a modal (`add-contact-button` → `add-contact-modal` / `add-contact-form` with `name-input`, `email-input`, `phone-input`, `save-contact-button`, and validation spans `name-error`/`email-error`/`phone-error`), editing via `edit-button-{id}` → `edit-contact-modal`/`edit-contact-form` (same field testids), deleting via `delete-button-{id}` → `confirm-dialog` (`confirm-delete-button`/`cancel-delete-button`), searching via `search-input` (real-time, case-insensitive substring match on name), and sorting via `sort-name-button` which cycles label/order through none → "A→Z" (ascending) → "Z→A" (descending) on each click. Toasts (`data-testid="toast"`) confirm add/update/delete actions (observed text: "Contact added", "Contact updated", "Contact deleted", "Invalid contact data"). Data persists server-side, so a page reload preserves changes. A test-only reset/seed API is available for setting up known state: POST /api/contacts/__reset (clears all contacts) and POST /api/contacts/__seed (reseeds 3 sample contacts: Ada Lovelace, Grace Hopper, Alan Turing), both active whenever NODE_ENV !== 'production'. Tests should use the seed file at tests/seed.spec.ts as the basis for setup (e.g. navigating to the app and calling the reset/seed endpoints before each scenario) to ensure a known starting state.

## Test Scenarios

### 1. Contact Manager

**Seed:** `tests/seed.spec.ts`

#### 1.1. 1. Page loads and shows existing contacts (or empty state when none exist)

**File:** `tests/contact-manager/view-contacts.spec.ts`

**Steps:**
  1. Call POST /api/contacts/__reset then POST /api/contacts/__seed to ensure a known set of 3 contacts (Ada Lovelace, Grace Hopper, Alan Turing) exists, then navigate to http://localhost:5173
    - expect: The page loads with heading 'Contact Manager'
    - expect: The contact-table is visible with a header row (Name, Email, Phone, Actions)
    - expect: Rows contact-row-{id} are shown for Ada Lovelace, Grace Hopper, and Alan Turing with correct name/email/phone cell values
    - expect: Each row shows Edit and Delete action buttons (edit-button-{id}, delete-button-{id})
  2. Call POST /api/contacts/__reset to clear all contacts, then reload the page
    - expect: The contact-table body contains no rows
    - expect: An empty-state element is visible with text 'No contacts found.'

#### 1.2. 2. Add a new contact with valid data

**File:** `tests/contact-manager/add-contact-valid.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, then click the add-contact-button
    - expect: The add-contact-modal opens containing the add-contact-form with name-input, email-input, phone-input, and a save-contact-button
  2. Fill name-input with 'Test User', email-input with 'test.user@example.com', and phone-input with '555-0199', then click save-contact-button
    - expect: The modal closes
    - expect: A toast (data-testid='toast') is shown with text 'Contact added'
    - expect: A new row appears in contact-table with name 'Test User', email 'test.user@example.com', and phone '555-0199'

#### 1.3. 3. Add a contact with invalid email

**File:** `tests/contact-manager/add-contact-invalid-email.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, and record the current number of rows in contact-table. Click add-contact-button to open the modal
    - expect: The add-contact-modal is visible
  2. Fill name-input with 'Test User' and email-input with 'not-an-email' (leave phone-input empty), then click save-contact-button
    - expect: An email-error span is shown with text 'A valid email is required'
    - expect: A toast is shown with text 'Invalid contact data'
    - expect: The add-contact-modal remains open
    - expect: The number of rows in contact-table is unchanged from before the submission (no contact was added)

#### 1.4. 4. Add a contact with empty name

**File:** `tests/contact-manager/add-contact-empty-name.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, and record the current number of rows in contact-table. Click add-contact-button to open the modal
    - expect: The add-contact-modal is visible
  2. Leave name-input empty, fill email-input with a valid email such as 'valid@example.com', and click save-contact-button
    - expect: A name-error span is shown with text 'Name is required'
    - expect: A toast is shown with text 'Invalid contact data'
    - expect: The add-contact-modal remains open
    - expect: The number of rows in contact-table is unchanged (no contact was added)

#### 1.5. 5. Edit an existing contact's phone number

**File:** `tests/contact-manager/edit-contact-phone.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, then click the edit-button-{id} for the row containing 'Ada Lovelace' (original phone '555-0100')
    - expect: The edit-contact-modal opens with edit-contact-form pre-filled with name 'Ada Lovelace', email 'ada@example.com', and phone '555-0100'
  2. Clear phone-input and type '555-9999', then click save-contact-button
    - expect: The modal closes
    - expect: A toast is shown with text 'Contact updated'
    - expect: The row for Ada Lovelace in contact-table now shows phone '555-9999' while name and email remain unchanged

#### 1.6. 6. Delete a contact with confirm/cancel

**File:** `tests/contact-manager/delete-contact.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, then click delete-button-{id} for the row containing 'Grace Hopper'
    - expect: A confirm-dialog appears with text 'Are you sure you want to delete Grace Hopper?' and cancel-delete-button / confirm-delete-button are visible
  2. Click cancel-delete-button
    - expect: The confirm-dialog closes
    - expect: The row for Grace Hopper is still present in contact-table
  3. Click delete-button-{id} for 'Grace Hopper' again, then click confirm-delete-button in the confirm-dialog
    - expect: The confirm-dialog closes
    - expect: A toast is shown with text 'Contact deleted'
    - expect: The row for Grace Hopper no longer appears in contact-table

#### 1.7. 7. Search for a contact by partial name

**File:** `tests/contact-manager/search-contacts.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, then type 'ada' into search-input
    - expect: The contact-table shows only the row for 'Ada Lovelace'
    - expect: Rows for 'Grace Hopper' and 'Alan Turing' are not shown
  2. Clear the search-input completely
    - expect: All 3 seeded contacts (Ada Lovelace, Grace Hopper, Alan Turing) are shown again in contact-table

#### 1.8. 8. Sort contacts by name ascending/descending

**File:** `tests/contact-manager/sort-contacts.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, and confirm sort-name-button initially shows label 'Sort by name: none'
    - expect: Contacts appear in default (insertion) order: Ada Lovelace, Grace Hopper, Alan Turing
  2. Click sort-name-button once
    - expect: The button label changes to 'Sort by name: A→Z'
    - expect: Rows in contact-table are ordered alphabetically ascending: Ada Lovelace, Alan Turing, Grace Hopper
  3. Click sort-name-button a second time
    - expect: The button label changes to 'Sort by name: Z→A'
    - expect: Rows in contact-table are ordered alphabetically descending: Grace Hopper, Alan Turing, Ada Lovelace

#### 1.9. 9. Reload the page and verify persistence

**File:** `tests/contact-manager/persistence.spec.ts`

**Steps:**
  1. Reset and seed the contacts store via the API, navigate to the app, add a new contact named 'Persisted Person' with email 'persisted@example.com' and phone '555-1234' via add-contact-button/add-contact-form/save-contact-button, then edit 'Ada Lovelace' via edit-button to change her phone to '555-7777' and save
    - expect: A toast confirms 'Contact added' after adding
    - expect: A toast confirms 'Contact updated' after editing
    - expect: contact-table shows 'Persisted Person' with phone '555-1234' and 'Ada Lovelace' with phone '555-7777'
  2. Reload the page (full page navigation/refresh)
    - expect: contact-table still shows the row for 'Persisted Person' with email 'persisted@example.com' and phone '555-1234'
    - expect: The row for 'Ada Lovelace' still shows the updated phone '555-7777'
