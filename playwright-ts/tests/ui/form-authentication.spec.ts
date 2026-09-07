import { test, expect } from '../../fixtures/test.fixture';
import { LoginPage } from '../../pages/login.page';

const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

test.describe('Form Authentication', () => {
    test('AUTH-01 successful login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

        await expect(loginPage.loginAlert).toContainText('✓ You logged into a secure area!');
        await expect(loginPage.loginResult).toHaveText('Login successful! Welcome, tomsmith.');
    });

    test('AUTH-02a missing both username and password shows validation message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.submit();

        await expect(loginPage.loginAlert).toContainText('Please fill in all fields.');
        await expect(loginPage.loginResult).toHaveText('Login failed: missing credentials');
    });

    test('AUTH-02b missing username shows validation message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.fillPassword(VALID_PASSWORD);
        await loginPage.submit();

        await expect(loginPage.loginAlert).toContainText('Please fill in all fields.');
        await expect(loginPage.loginResult).toHaveText('Login failed: missing credentials');
    });

    test('AUTH-02c missing password shows validation message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.fillUsername(VALID_USERNAME);
        await loginPage.submit();

        await expect(loginPage.loginAlert).toContainText('Please fill in all fields.');
        await expect(loginPage.loginResult).toHaveText('Login failed: missing credentials');
    });

    test('AUTH-03a invalid username shows invalid credentials message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login('wronguser', VALID_PASSWORD);

        await expect(loginPage.loginAlert).toContainText('✗ Your username is invalid!');
        await expect(loginPage.loginResult).toHaveText('Login failed: invalid credentials');
    });

    test('AUTH-03b invalid password shows invalid credentials message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login(VALID_USERNAME, 'wrongpassword');

        await expect(loginPage.loginAlert).toContainText('✗ Your username is invalid!');
        await expect(loginPage.loginResult).toHaveText('Login failed: invalid credentials');
    });

    test('AUTH-04 login form renders in the initial state', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.loginResult).toHaveText('Awaiting login...');
        await expect(loginPage.loginHint).toContainText(VALID_USERNAME);
        await expect(loginPage.loginHint).toContainText(VALID_PASSWORD);
    });
});
