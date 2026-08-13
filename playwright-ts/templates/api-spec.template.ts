import { test, expect } from '@playwright/test';
import { ExampleResourceClient } from './api-client.template';

/**
 * TEMPLATE ONLY — copy and rename this file into tests/api/ for a real SUT.
 */
test('replace with an API contract', async ({ request }) => {
    const client = new ExampleResourceClient(request);
    const response = await client.getById('replace-with-id');

    expect(response.status()).toBe(200);
});
