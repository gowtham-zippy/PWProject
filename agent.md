# Prompt: Build a Contact Manager App + Use Playwright Test Agents (Planner → Generator → Healer)

Use this as a single prompt (or split into phases) with an AI coding agent (e.g. GitHub Copilot, Claude, Cursor) that has access to a terminal and Playwright v1.56+ installed in the workspace.

## Prerequisites

- Node.js 18+ and npm installed.
- Playwright `@playwright/test` **v1.56.0 or later** (Test Agents shipped in this release).
- An AI coding assistant that exposes the three agents as callable entry points. Two common
  setups:
  - **VS Code + GitHub Copilot Chat**: after running `npx playwright init-agents --loop=vscode`
    (or the equivalent setup command for your assistant), the agents are available as chat
    participants/modes — typically invoked as `@planner`, `@generator`, `@healer` or as
    custom chat modes named "Planner", "Generator", "Healer" depending on the installed
    version. Check `npx playwright init-agents --help` for the exact `--loop` target
    (`vscode`, `claude`, `opencode`, etc.) and confirm the resulting agent names before Phase 3.
  - **CLI-driven**: some setups expose `npx playwright agent planner`, `... generator`,
    `... healer` subcommands. Confirm which applies to your environment and substitute
    accordingly in Phases 3–5.
- A terminal dedicated to running the app (`npm run dev`) that stays open for the entire
  Planner/Generator/Healer session, since both Planner and Generator drive a **live** browser.

---

## Phase 0 — Context to give the agent

```
You are building a small full-stack "Contact Manager" web app, then using the official
Playwright v1.56 Test Agents (Planner, Generator, Healer) to autonomously create and
maintain its end-to-end test suite.

Playwright Test Agents:
- Planner: explores the running app in a live browser and produces a structured Markdown
  test plan (e.g. specs/contact-manager.md) describing scenarios, steps, and expected
  outcomes in plain English.
- Generator: reads that Markdown plan, drives a live browser to validate real selectors
  and assertions, then emits runnable *.spec.ts Playwright test files.
- Healer: runs the generated test suite, watches for failures, replays the failing steps,
  diagnoses UI/locator drift, and patches the tests (or flags the app bug) automatically.

Work in phases and stop for review between each phase.
```

---

## Phase 1 — Build the Contact Manager app

```
Create a simple Contact Manager web application with the following stack:
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express (or a lightweight JSON file / in-memory store — no real DB needed)
- Styling: minimal CSS, no UI framework required

Features required (keep it simple but with enough surface area for meaningful E2E tests):
1. List all contacts (name, email, phone) in a table/list, with a visible empty state.
2. Add a new contact via a form (name, email, phone) with client-side validation
   (required name, valid email format).
3. Edit an existing contact inline or via a modal/edit page.
4. Delete a contact with a confirmation dialog.
5. Search/filter contacts by name in real time.
6. Sort contacts by name (asc/desc).
7. Persist data across reloads (in-memory server store or local JSON file is fine).
8. Each interactive element must have a stable `data-testid` attribute
   (e.g. data-testid="add-contact-button", "contact-row-{id}", "search-input").
9. Show toast/inline messages for success and error states (e.g. "Contact added",
   "Invalid email").
10. Expose a test-only reset endpoint, e.g. `POST /api/contacts/__reset` (or a seed
    endpoint `POST /api/contacts/__seed`), that clears/reseeds the in-memory store.
    Guard it so it only runs outside production (e.g. behind `NODE_ENV !== 'production'`
    or a `TEST_MODE=1` env var) — this is what the generated tests will call from
    `test.beforeEach` to guarantee isolated, repeatable state.

Project structure:
- /app/client  (Vite React app)
- /app/server  (Express API: GET/POST/PUT/DELETE /contacts)
- Root scripts: `npm run dev` starts both client (port 5173) and server (port 3001)
  concurrently, with client proxying /api to the server.

Deliverables:
- Working app runnable with `npm install && npm run dev`
- README section explaining how to start it for testing (must be running at
  http://localhost:5173 before Playwright agents are invoked)
```

---

## Phase 2 — Install Playwright and enable Test Agents

```
In the workspace root:
1. Install Playwright and initialize config:
   npm init playwright@latest -- --quiet
2. Ensure version is >= 1.56 (check with `npx playwright --version`; upgrade if needed:
   npm install -D @playwright/test@latest).
3. Enable/configure the Playwright Test Agents (Planner, Generator, Healer) per the
   v1.56 docs — typically via `npx playwright init-agents` or the equivalent CLI/MCP
   setup that registers the agents with the AI coding assistant (e.g. as MCP tools or
   VS Code commands). Confirm the three agent entry points are available:
     - planner
     - generator
     - healer
4. Create a `specs/` directory to hold the generated Markdown test plans and a
   `tests/` directory for the generated *.spec.ts files, matching playwright.config.ts.
5. Configure `playwright.config.ts` with:
   - `use.baseURL = "http://localhost:5173"` so tests/agents can use relative paths.
   - A `webServer` entry that runs `npm run dev` (cwd: /app), waits on port 5173, and
     reuses an existing server locally (`reuseExistingServer: !process.env.CI`) — this
     lets Playwright auto-start the app in CI while you keep it running manually during
     interactive Planner/Generator/Healer sessions.
6. Make sure the contact manager app is running (npm run dev in /app) before invoking
   any agent, since Planner/Generator need a live browser session against it.
```

---

## Phase 3 — Run the Planner agent

```
Start the Contact Manager app locally (http://localhost:5173).

Invoke the Playwright Planner agent against the running app and ask it to produce a
Markdown test plan at specs/contact-manager.md covering these scenarios:

1. Page loads and shows existing contacts (or empty state when none exist).
2. Add a new contact with valid data → appears in the list, success message shown.
3. Add a contact with invalid email → validation error shown, contact not added.
4. Add a contact with empty name → validation error shown.
5. Edit an existing contact's phone number → list reflects the update.
6. Delete a contact → confirmation dialog appears; confirming removes it, canceling
   keeps it.
7. Search for a contact by partial name → list filters correctly; clearing search
   restores full list.
8. Sort contacts by name ascending/descending → order updates correctly.
9. Reload the page → previously added/edited contacts persist.

Review specs/contact-manager.md once generated and refine any step/selector
descriptions that are ambiguous before moving to the Generator phase.
```

---

## Phase 4 — Run the Generator agent

```
With the app still running, invoke the Playwright Generator agent and point it at
specs/contact-manager.md.

Ask it to:
- Walk through each scenario in a live browser, validating real selectors (prefer
  data-testid locators) and assertions against actual DOM state.
- Emit one or more runnable *.spec.ts files under tests/ (e.g.
  tests/contact-manager.spec.ts, or split per scenario group: crud.spec.ts,
  search-sort.spec.ts, persistence.spec.ts).
- Use Playwright best practices: web-first assertions (expect(locator)...), no
  hard-coded waits/sleeps, isolated test data per test (e.g. create contacts the test
  itself needs rather than relying on global state), and proper use of
  test.beforeEach/afterEach for setup/teardown — specifically, call the
  `POST /api/contacts/__reset` endpoint from Phase 1 in `test.beforeEach` (via
  `request.post`) so every test starts from a clean, known contact list.

After generation, run the suite:
   npx playwright test
Report pass/fail summary and keep the HTML report for the Healer phase.
```

---

## Phase 5 — Run the Healer agent

```
Intentionally introduce 1-2 small UI changes to the Contact Manager app to simulate
drift, e.g.:
- Rename data-testid="add-contact-button" to data-testid="new-contact-button"
- Change the delete confirmation dialog text

Re-run the suite (npx playwright test) and confirm some tests fail.

Invoke the Playwright Healer agent to:
- Execute the full test suite and monitor failures.
- Replay failing steps in a live browser session to identify what changed
  (locator no longer found, text mismatch, timing issue, etc.).
- Automatically patch the affected *.spec.ts files with corrected selectors/
  assertions, preserving test intent.
- Re-run the suite after healing and report the final pass/fail status.

If a failure is due to an actual app regression (not a selector/UI drift issue), the
Healer should flag it clearly instead of silently patching the test to mask the bug.

Finally, summarize:
- Which tests were healed and what changed
- Any failures that needed manual/app-side fixes instead of test patches
```

---

## Phase 6 — Wrap-up

```
Produce a short report (tests/README.md or PR description) summarizing:
1. App features implemented
2. Test plan coverage (link to specs/contact-manager.md)
3. Generated test files and what each covers
4. Healer run results — what was auto-repaired vs flagged
5. Command reference:
   - npm run dev          # start app
   - npx playwright test  # run suite
   - npx playwright show-report
6. (Optional) A GitHub Actions workflow (.github/workflows/playwright.yml) that installs
   dependencies, installs browsers (`npx playwright install --with-deps`), relies on the
   `webServer` config from Phase 2 to boot the app, and runs `npx playwright test` on
   every PR — so the Planner/Generator-produced suite is continuously guarded, with
   Healer re-run manually/on-demand when CI flags drift.
```

---

## Usage tips

- Run phases sequentially; each agent depends on the previous artifact
  (app running → plan.md → spec.ts files → healed spec.ts files).
- Keep the dev server running in a separate terminal for the whole Planner/Generator/
  Healer session, since both agents interact with a **live** browser against the app.
- Prefer `data-testid` locators everywhere in the app to make Generator/Healer output
  more stable and less prone to drift.
- Commit the Markdown plan and generated tests to version control so Healer's diffs
  are reviewable.
