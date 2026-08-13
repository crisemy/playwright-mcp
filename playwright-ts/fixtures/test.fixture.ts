import { test as baseTest } from '@playwright/test';
/**
 * Add SUT-specific, test-scoped fixtures here only when they remove meaningful
 * repeated setup. See templates/auth-fixture.template.ts for an example.
 */
export const test = baseTest.extend<{}>({});

export { expect } from '@playwright/test';
