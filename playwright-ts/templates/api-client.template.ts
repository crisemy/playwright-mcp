import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * TEMPLATE ONLY — copy and rename this file into api/ for a real SUT.
 * Clients build transport requests; specs own business assertions.
 */
export class ExampleResourceClient {
    constructor(private readonly request: APIRequestContext) {}

    async getById(id: string): Promise<APIResponse> {
        return this.request.get(`/replace-with-resource/${id}`);
    }
}
