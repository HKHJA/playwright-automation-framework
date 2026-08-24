import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../pages';

/**
 * Login Feature Tests
 * ===================
 * Validates authentication flows including successful login,
 * invalid credentials, locked accounts, and empty field validation.
 */

test.describe('Login Feature', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.expectPageLoaded();
  });

  test('TC-001: Successful login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-002: Login fails with invalid password', async () => {
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectErrorMessage(
      'Username and password do not match any user in this service'
    );
  });

  test('TC-003: Login fails with invalid username', async () => {
    await loginPage.login('invalid_user', 'secret_sauce');

    await loginPage.expectErrorMessage(
      'Username and password do not match any user in this service'
    );
  });

  test('TC-004: Login fails with empty username', async () => {
    await loginPage.login('', 'secret_sauce');

    await loginPage.expectErrorMessage('Username is required');
  });

  test('TC-005: Login fails with empty password', async () => {
    await loginPage.login('standard_user', '');

    await loginPage.expectErrorMessage('Password is required');
  });

  test('TC-006: Locked-out user cannot login', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectErrorMessage(
      'Sorry, this user has been locked out'
    );
  });

  test('TC-007: Successful logout after login', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();
    await inventoryPage.logout();

    await loginPage.expectPageLoaded();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
