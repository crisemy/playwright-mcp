import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    readonly formAuthenticationLink: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginAlert: Locator;
    readonly loginResult: Locator;
    readonly loginHint: Locator;

    constructor(page: Page) {
        super(page);
        this.formAuthenticationLink = page.locator('[data-section="login"]');
        this.usernameInput = page.getByPlaceholder('Enter username');
        this.passwordInput = page.getByPlaceholder('Enter password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.loginAlert = page.locator('#login-alert');
        this.loginResult = page.locator('#login-result');
        this.loginHint = page.locator('#section-login .card-desc');
    }

    async open(): Promise<void> {
        await this.navigate('/playwright-ui-testing-lab.html');
        await this.clickElement(this.formAuthenticationLink);
    }

    async fillUsername(username: string): Promise<void> {
        await this.fillInput(this.usernameInput, username);
    }

    async fillPassword(password: string): Promise<void> {
        await this.fillInput(this.passwordInput, password);
    }

    async submit(): Promise<void> {
        await this.clickElement(this.loginButton);
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }
}
