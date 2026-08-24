import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';

/**
 * End-to-End Checkout Tests
 * =========================
 * Full user journey: login > add items > cart > checkout > confirmation.
 * Also validates form validation and cart management.
 */

test.describe('Checkout Feature', () => {

  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();

    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('TC-016: Complete checkout - full E2E flow', async ({ page }) => {
    // Add items
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartCount()).toBe(2);

    // Navigate to cart
    await inventoryPage.goToCart();
    await cartPage.expectPageLoaded();

    const items = await cartPage.getItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('John', 'Doe', '10001');
    await checkoutPage.submitInfo();

    // Verify overview page
    await expect(page).toHaveURL(/checkout-step-two/);
    const total = await checkoutPage.getTotalPrice();
    expect(total).toContain('$');

    // Complete order
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete();
  });

  test('TC-017: Checkout fails without first name', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo('', 'Doe', '10001');
    await checkoutPage.submitInfo();

    await checkoutPage.expectErrorMessage('First Name is required');
  });

  test('TC-018: Checkout fails without last name', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo('John', '', '10001');
    await checkoutPage.submitInfo();

    await checkoutPage.expectErrorMessage('Last Name is required');
  });

  test('TC-019: Checkout fails without postal code', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.submitInfo();

    await checkoutPage.expectErrorMessage('Postal Code is required');
  });

  test('TC-020: Remove item from cart page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.expectPageLoaded();

    expect(await cartPage.getItemCount()).toBe(2);
    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('TC-021: Continue shopping returns to inventory', async ({ page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.expectPageLoaded();
  });
});
