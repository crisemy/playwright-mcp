import { Page, test as baseTest } from '@playwright/test';

type AuthenticationFixtures = {
    authenticatedPage: Page;
};

/**
 * TEMPLATE ONLY — copy and adapt this file when a SUT needs authenticated state.
 * Prefer a storage state created by a SUT-specific setup project when appropriate.
 */
export const test = baseTest.extend<AuthenticationFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Add SUT-specific authentication setup before calling use(page).
        await use(page);
    },
});
