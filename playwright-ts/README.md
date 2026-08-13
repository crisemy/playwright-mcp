# Playwright + TypeScript Automation Skeleton

A reusable, SUT-agnostic (System Under Test) Playwright + TypeScript test automation skeleton. It is a clean starting point for building UI and API test suites against any application.

**No SUT is configured yet.** The active framework contains no application pages, credentials, endpoints, or business assertions. Everything SUT-specific is intentionally kept out, so the skeleton can be copied and adapted to any project.

---

## What this skeleton provides

| Concern | What you get |
| --- | --- |
| Cross-browser UI testing | Playwright Test with Chromium, Firefox, and WebKit projects |
| API testing | Playwright's built-in `request` fixture via typed API clients |
| Page Object Model | `pages/base.page.ts` with generic navigation/actions to extend |
| Environment management | `config/env.config.ts` — the single owner of `.env` loading |
| Logging | Winston console + file logging (`logs/error.log`, `logs/combined.log`) |
| Reusable fixtures | `fixtures/test.fixture.ts` extension point |
| Scaffolding | Copy-and-adapt templates under `templates/` |
| Self-validation | `tests/framework/skeleton.spec.ts` smoke test with no SUT dependency |
| CI | GitHub Actions workflow (install, type-check, test, upload artifacts) |
| Containers | `docker-compose.yml` for isolated, CI-like runs |

## Directory structure

```text
.
├── api/                  # SUT API clients are added here (one per resource/area)
├── config/
│   ├── .env.example      # template for local env variables (BASE_URL, LOG_LEVEL)
│   └── env.config.ts     # loads .env; exports getRequiredEnv/getOptionalEnv/ENV
├── data/                 # optional, non-secret static SUT test data
├── fixtures/
│   └── test.fixture.ts   # shared Playwright fixture extension point
├── pages/
│   └── base.page.ts      # BasePage: navigate, click, fill, visibility helpers
├── templates/            # non-executable examples to copy and adapt
│   ├── page-object.template.ts
│   ├── ui-spec.template.ts
│   ├── api-client.template.ts
│   ├── api-spec.template.ts
│   └── auth-fixture.template.ts
├── tests/
│   ├── framework/        # local framework validation (no SUT dependency)
│   │   └── skeleton.spec.ts
│   ├── ui/               # future UI specs
│   └── api/              # future API specs
├── utils/
│   └── logger.ts         # Winston logger
├── .github/workflows/    # CI pipeline
├── playwright.config.ts  # Playwright configuration
├── docker-compose.yml    # containerized test run
└── package.json
```

`templates/` lives outside `tests/` on purpose: template files are type-checked but never discovered or executed by Playwright.

---

## Core components

### Configuration (`config/env.config.ts`)

The single owner of local environment-file loading. Values already present in your shell or CI take precedence because dotenv does not override existing variables.

- `getRequiredEnv(key)` — throws if the variable is missing or empty.
- `getOptionalEnv(key, fallback?)` — returns the value or a fallback.
- `ENV` — exports `BASE_URL` and `LOG_LEVEL` for the rest of the framework.

`config/.env` is gitignored; commit changes only to `config/.env.example`.

### Playwright config (`playwright.config.ts`)

- `testDir: ./tests`, fully parallel, retries on CI, HTML reporter.
- `use.baseURL` is set from `ENV.BASE_URL`.
- Diagnostics retained on failure: trace, screenshot, video.
- Projects: Chromium, Firefox, WebKit (mobile/branded projects commented out for easy enabling).

### Page Object Model (`pages/base.page.ts`)

`BasePage` provides generic helpers that concrete SUT page objects extend:

- `navigate(path)` — goes to a route relative to the configured `baseURL`.
- `getLocator(selector)` — generic locator factory.
- `clickElement(locator)` — waits for visibility, then clicks.
- `fillInput(locator, text)` — waits for visibility, then fills.
- `expectToBeVisible(locator)` — visibility assertion.

Keep SUT page objects focused on locators, reusable actions, and page state. Prefer `getByRole`, `getByLabel`, and `getByTestId` over fragile CSS selectors. Keep scenario assertions in specs unless they describe reusable page state.

### API clients (`api/`)

Add one focused client per meaningful SUT resource or API area. Clients inject Playwright's `APIRequestContext`, build typed transport requests, and return `APIResponse`. Keep business-contract assertions in API specs, not in clients — do not create wrappers that merely duplicate `APIRequestContext`.

### Fixtures (`fixtures/test.fixture.ts`)

A minimal `test` export that extends Playwright's base test. Add SUT-specific, test-scoped fixtures here only when they remove meaningful repeated setup (see `templates/auth-fixture.template.ts` for an example).

### Logging (`utils/logger.ts`)

Winston logger at the level from `ENV.LOG_LEVEL` (default `info`). Writes to the console and to `logs/error.log` (errors, with stack traces) and `logs/combined.log`. Never log credentials, tokens, or personal data.

### Self-validation (`tests/framework/skeleton.spec.ts`)

A smoke test that asserts Playwright's isolated `page` and `request` fixtures are available — proving the framework works before any SUT is added. It runs against the baseURL (optional) and passes without a SUT.

---

## Setup

Prerequisites: Node.js LTS.

```bash
npm ci                       # install exact locked dependencies
npx playwright install       # download browser binaries
cp config/.env.example config/.env
```

`config/.env` example:

```env
BASE_URL=https://your-app.example
LOG_LEVEL=info
```

`BASE_URL` is optional for the framework-only smoke test, but configure it before adding UI or API tests. Add SUT-specific variables (e.g. credentials) only when that SUT requires them, and store their CI values as secrets.

## Running the skeleton

```bash
npm test                 # framework-only smoke test until SUT tests are added
npm run test:ui          # UI tests (tests/ui)
npm run test:api         # API tests (tests/api)
npm run test:headed      # headed execution
npm run type-check       # strict TypeScript validation
npm run test:report      # open the HTML report
```

On failure, Playwright retains a trace, screenshot, and video under `test-results/`; inspect with the HTML report or `npx playwright show-trace <trace.zip>`.

---

## Templates

Copy a template into the active folder, rename it, and replace every placeholder with the SUT's contract.

| Template | Purpose |
| --- | --- |
| `page-object.template.ts` | Page-object shape and accessible locator guidance |
| `ui-spec.template.ts` | UI scenario structure (open → act → assert) |
| `api-client.template.ts` | Focused, typed API transport client |
| `api-spec.template.ts` | API contract assertion structure |
| `auth-fixture.template.ts` | Authenticated fixture extension point (or storage state) |

---

## Adding a new SUT

1. Set `BASE_URL` for the application in `config/.env`.
2. Copy and rename a relevant template from `templates/`.
3. Add a page object under `pages/` for a UI feature, or an API client under `api/` for an API area.
4. Add SUT-specific UI and API specs under `tests/ui/` and `tests/api/`.
5. Add test-scoped fixtures only when they remove meaningful repeated setup.
6. Configure SUT secrets in CI and pass them to the test command.

For authentication, copy `templates/auth-fixture.template.ts` and replace its comment with the SUT's login or storage-state setup. Authentication assumptions do not belong in the core skeleton.

---

## CI and Docker

### CI (`.github/workflows/playwright.yml`)

Runs on every push/PR to `main`. Steps: checkout → set up Node LTS → `npm ci` → install browsers → `npm run type-check` → `npm test` → upload the HTML report and `test-results/` as artifacts. The workflow intentionally has no SUT credentials or URL defaults — add only what your SUT requires.

### Docker (`docker-compose.yml`)

Run in an isolated container that mirrors CI:

```bash
docker compose run --rm playwright-tests
```

Uses the matching `mcr.microsoft.com/playwright:v1.59.1-jammy` image, an isolated `node_modules` volume, and `npm ci`. The mounted project lets `config/env.config.ts` load `config/.env`; override a value for one execution with `docker compose run -e BASE_URL=https://your-app.example playwright-tests`.

---

## Adapting to a different application

The core workflow stays the same for any application: define its environment values, model its pages or resources, add only its needed fixtures and test data, then write observable UI/API contracts. Nothing in the active framework assumes a login flow, account role, endpoint, selector, or business message.

---

## License

MIT License

Copyright (c) 2026 Cris N.
