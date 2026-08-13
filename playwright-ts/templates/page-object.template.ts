import { Locator, Page } from '@playwright/test';
import { BasePage } from '../pages/base.page';

/**
 * TEMPLATE ONLY — copy and rename this file into pages/ for a real SUT.
 * Replace the route, locator, and action names with the application's contract.
 */
export class ExampleFeaturePage extends BasePage {
    readonly primaryAction: Locator;

    constructor(page: Page) {
        super(page);
        this.primaryAction = page.getByRole('button', { name: 'Replace with accessible name' });
    }

    async open(): Promise<void> {
        await this.navigate('/replace-with-route');
    }

    async performPrimaryAction(): Promise<void> {
        await this.clickElement(this.primaryAction);
    }
}
