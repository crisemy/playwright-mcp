# Skeleton architecture

This is a SUT-agnostic Playwright and TypeScript automation skeleton.

`playwright.config.ts` owns runner behavior: cross-browser projects, retries, parallelism, reporting, and failure diagnostics. It reads the optional base URL from `config/env.config.ts` and supplies it as Playwright's `baseURL`.

`config/env.config.ts` is the single dotenv owner. It provides framework-level values (`BASE_URL`, `LOG_LEVEL`) and generic required/optional environment helpers for future SUT modules.

`pages/base.page.ts`, `fixtures/test.fixture.ts`, and `utils/logger.ts` provide reusable UI, fixture, and logging infrastructure. They contain no application-specific pages, authentication flows, credentials, selectors, or business assertions.

Future SUT implementation belongs in `pages/`, `api/`, `data/`, `fixtures/`, and `tests/`. Use `templates/` as a learning reference before copying adapted code into those active directories. Templates are not Playwright tests.

The only active test is a local framework smoke test that validates Playwright's browser and API fixtures without navigation or network access. It exists so the skeleton can be executed before a SUT is configured.
