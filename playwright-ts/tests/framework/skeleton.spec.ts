import { test, expect } from '../../fixtures/test.fixture';

test('provides isolated Playwright browser and API fixtures without a SUT', async ({ page, request }) => {
    expect(page).toBeDefined();
    expect(request).toBeDefined();
});
