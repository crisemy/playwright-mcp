# Project Context

This file is the persistent source of project context for the AI QA agent.
Every new session MUST read this file before performing any work.

---

## What this project is

A proof-of-concept (POC) for agentic QA. An AI agent uses Playwright MCP to
explore a local web application (the SUT), design test scenarios, and generate
Playwright + TypeScript tests reusing an existing framework.

The workflow is strictly **phase-isolated**: exploration, test design, test
generation, and compliance evaluation are separate phases. Only the phase the
user requests is executed. See `AGENTS.md` for the phase isolation rules.

---

## Repository layout

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Global rules for the AI QA agent (mandatory). |
| `CONTEXT.md` | This file; persistent project context (mandatory read). |
| `prompts.md` | The orchestration prompts used for each workflow stage. |
| `.opencode/skills/` | Mandatory Skills (see below). |
| `opencode.json` | opencode config; declares the Playwright MCP server. |
| `ui-test-lab/ui-testing-lab/` | The System Under Test (SUT) HTML app. |
| `playwright-ts/` | The existing Playwright + TypeScript framework. |

---

## Mandatory Skills

Skills are procedures, not optional references. The applicable skill MUST be
used when a task matches its activity.

| Skill | When to use |
| --- | --- |
| `.opencode/skills/authentication-exploration/SKILL.md` | Explore/inspect/login flows. |
| `.opencode/skills/test-design/SKILL.md` | Design tests / create scenarios. |
| `.opencode/skills/playwright-test-generation/SKILL.md` | Implement/generate Playwright tests. |
| `.opencode/skills/skill-compliance-evaluation/SKILL.md` | Evaluate/audit/verify generated tests. |

---

## System Under Test (SUT)

- App file: `ui-test-lab/ui-testing-lab/playwright-ui-testing-lab.html`
- Served with `scripts.js` and `styles.css`.
- Single-page app; sections are switched by the `navigate()` router, not by
  URL changes. The browser's visible path (e.g. `/login`) is cosmetic; the page
  URL does not change when navigating.
- Auth is **client-side only**. There are no real protected routes, cookies,
  session persistence, or a real logout. Do not invent them.

### Form Authentication (the auth entry point)

- Credentials (source of truth: `scripts.js`, `handleLogin()`):
  - Username: `tomsmith`
  - Password: `SuperSecretPassword!`
- Success: alert `"✓ You logged into a secure area!"` and result
  `"Login successful! Welcome, tomsmith."`
- Missing username or password: `"Please fill in all fields."`
- Invalid credentials: `"✗ Your username is invalid!"` and
  `"Login failed: invalid credentials"`
- Auth is not persisted; there is no logout control and no protected area.

---

## Running the SUT

The automated suite resolves `http://localhost:8123`. Serve the app from the
directory that contains the HTML:

```powershell
cd ui-test-lab/ui-testing-lab
python -m http.server 8123
```

Keep the server running while executing tests. Only ONE server should listen on
port 8123 (a second server on IPv6 vs IPv4 causes browser-dependent 404s — see
README Troubleshooting).

---

## Running Playwright MCP

- As an opencode MCP server: declared in `opencode.json`
  (`mcp.playwright`, command `npx -y @playwright/mcp@latest`); launched
  automatically at session start.
- Standalone stdio server: `npx -y @playwright/mcp@latest`
- Standalone SSE/HTTP server: `npx -y @playwright/mcp@latest --port 8931`
- Headless: add `--headless`. Browser: `--browser webkit`, etc.
- Full options: `npx -y @playwright/mcp@latest --help`
- Requires Playwright browsers: `npx playwright install`

---

## Playwright + TypeScript framework

Working directory: `playwright-ts/`

- Config: `playwright.config.ts` — 3 browser projects (chromium, firefox,
  webkit), `baseURL` from `config/env.config.ts`.
- Env: `config/.env` (`BASE_URL=http://localhost:8123`,
  `ADMIN_USER=tomsmith`, `ADMIN_PASSWORD=SuperSecretPassword!`).
- Page Objects: `pages/base.page.ts` (`BasePage`: `navigate`, `getLocator`,
  `clickElement`, `fillInput`, `expectToBeVisible`).
- Fixtures: `fixtures/test.fixture.ts` (exports `test` and `expect`).
- Logging: `utils/logger.ts` (winston).
- Test directories: `tests/ui/`, `tests/api/`, `tests/framework/`.
- Only active test today: `tests/framework/skeleton.spec.ts` (a local smoke
  test that needs no network).
- Templates (reference, not tests): `templates/`.

### Scripts (run from `playwright-ts/`)

| Command | Purpose |
| --- | --- |
| `npm run test` | Run all tests |
| `npm run test:ui` | Run tests in `tests/ui` |
| `npm run test:api` | Run tests in `tests/api` |
| `npm run test:headed` | Run headed |
| `npm run test:report` | Show the HTML report |
| `npm run type-check` | `tsc --noEmit` |

---

## Framework architecture rules

- The existing framework is the source of truth. Reuse its Page Objects,
  fixtures, utilities, naming conventions, and folder structure.
- Do NOT create a competing framework or an alternative test architecture.
- SUT-specific code belongs in `pages/`, `api/`, `data/`, `fixtures/`, and
  `tests/`. Do not modify framework infrastructure without clear justification.

---

## QA evidence classification

Classify every important finding as:

- **Observed** — directly verified through Playwright MCP, execution, or
  repository inspection.
- **Inferred** — supported by multiple observations but not directly verified.
- **Unknown** — could not be established from available evidence.

Never present inferred or unknown behavior as observed fact. Never invent
behavior, credentials, locators, or expected results.

---

## Traceability chain

```text
Exploration Evidence
        ↓
Test Scenario
        ↓
Test Steps
        ↓
Expected Results
        ↓
Test Implementation
        ↓
Assertions
        ↓
Observed Runtime Behavior
        ↓
Compliance Verdict
```

---

## Compliance vs execution

- **Execution status**: PASS / FAIL / PARTIAL / NOT EXECUTED.
- **Compliance status**: COMPLIANT / PARTIALLY COMPLIANT / NON-COMPLIANT /
  UNDETERMINED.
- A passing test does NOT prove compliance. Compliance evaluation is
  independent and MUST NOT modify the tests it evaluates.
