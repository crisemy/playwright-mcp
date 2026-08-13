import { test, expect } from '../fixtures/test.fixture';
import { ExampleFeaturePage } from './page-object.template';

/**
 * TEMPLATE ONLY — copy and rename this file into tests/ui/ for a real SUT.
 */
test('replace with a user-visible UI behavior', async ({ page }) => {
    const featurePage = new ExampleFeaturePage(page);

    await featurePage.open();
    await featurePage.performPrimaryAction();

    // Replace with an assertion against the real SUT's observable behavior.
    await expect(page).toHaveURL(/replace-with-route/);
});
