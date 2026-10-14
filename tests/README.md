# Contact Manager — Test Suite Report

This report summarizes the Playwright Test Agents workflow (Planner → Generator → Healer)
run against the Contact Manager app.

## 1. App features implemented

- List contacts (name, email, phone) in a table, with an empty state when none exist.
- Add a contact via a modal form, with client-side + server-side validation
  (required name, valid email format).
- Edit a contact via a modal form (pre-filled with existing values).
- Delete a contact, gated behind a confirm/cancel dialog.
- Real-time, case-insensitive search/filter by name.
- Sort by name, cycling none → A→Z → Z→A on each click.
- Toast notifications for add/update/delete success and validation failure.
- Server-side persistence (in-memory store) for the life of the server process.
- Stable `data-testid` attributes on every interactive element, for reliable
  Generator/Healer locators.
- Test-only `POST /api/contacts/__reset` and `POST /api/contacts/__seed` endpoints
  (active whenever `NODE_ENV !== 'production'`) used by every spec to establish a
  known starting state.

## 2. Test plan coverage

The full test plan, written by the Planner agent, is at
[specs/contact-manager.md](../specs/contact-manager.md). It covers 9 scenarios across
viewing, adding (valid/invalid), editing, deleting, searching, sorting, and persistence.

## 3. Generated test files

| File | Covers |
|------|--------|
| [tests/contact-manager/view-contacts.spec.ts](contact-manager/view-contacts.spec.ts) | Initial page load with seeded contacts, table headers/rows, and the empty state after a reset |
| [tests/contact-manager/add-contact-valid.spec.ts](contact-manager/add-contact-valid.spec.ts) | Adding a contact with valid name/email/phone, modal close, success toast, new row appears |
| [tests/contact-manager/add-contact-invalid-email.spec.ts](contact-manager/add-contact-invalid-email.spec.ts) | Add-contact validation: invalid email shows inline error, error toast, modal stays open, no row added |
| [tests/contact-manager/add-contact-empty-name.spec.ts](contact-manager/add-contact-empty-name.spec.ts) | Add-contact validation: empty name shows inline error, error toast, modal stays open, no row added |
| [tests/contact-manager/edit-contact-phone.spec.ts](contact-manager/edit-contact-phone.spec.ts) | Editing an existing contact's phone, pre-filled modal, success toast, updated row |
| [tests/contact-manager/delete-contact.spec.ts](contact-manager/delete-contact.spec.ts) | Delete confirm dialog cancel (row remains) and confirm (row removed + success toast) |
| [tests/contact-manager/search-contacts.spec.ts](contact-manager/search-contacts.spec.ts) | Real-time name search filtering rows, and clearing search restores all rows |
| [tests/contact-manager/sort-contacts.spec.ts](contact-manager/sort-contacts.spec.ts) | Sort button cycling none → A→Z → Z→A with correct row ordering at each step |
| [tests/contact-manager/persistence.spec.ts](contact-manager/persistence.spec.ts) | Add + edit a contact, reload the page, and verify changes persisted server-side |

## 4. Healer run results

Latest full run (`npx playwright test --reporter=line`, chromium + firefox + webkit):
**27 passed / 0 failed**.

**Root cause found and fixed:** the app server keeps contacts in a single shared
in-memory array (no per-test isolation), so running tests in parallel let workers race
each other's `POST /api/contacts/__reset` / `__seed` calls — one test's seeded IDs could
be wiped out mid-test by another. This explained every prior failure (`delete-contact`
timing out on chromium, and the webkit row-count/timeout failures), not real app or
browser bugs. Fix: `playwright.config.ts` now sets `fullyParallel: false` and
`workers: 1` so the suite runs serially against the shared backend state.

**Also auto-repaired:** `add-contact-empty-name.spec.ts` and
`add-contact-invalid-email.spec.ts` captured the "row count before" baseline
immediately after `page.goto`, before the async contacts fetch resolved, intermittently
reading `0` instead of `3`. Both now wait for the first seeded row to render before
recording the baseline count.

## 5. Command reference

```bash
npm run dev               # start the app (server :3001 + client :5173)
npx playwright test       # run the generated suite (chromium, firefox, webkit)
npx playwright show-report  # view the HTML report from the last run
```

## 6. Continuous Integration

A GitHub Actions workflow at
[.github/workflows/playwright.yml](../.github/workflows/playwright.yml) installs
dependencies, installs browsers (`npx playwright install --with-deps`), and runs
`npx playwright test` on every push and pull request. The `webServer` entry in
[playwright.config.ts](../playwright.config.ts) boots the app automatically in CI, so no
separate server step is needed. The Healer should be re-run manually/on-demand whenever
CI flags drift (e.g. new flaky failures) rather than being part of the automated workflow.
