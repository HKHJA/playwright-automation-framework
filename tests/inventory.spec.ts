import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../pages';

/**
 * Inventory (Product Listing) Tests
 * ==================================
 * Validates product display, sorting functionality,
 * and add-to-cart behavior from the inventory page.
 */

test.describe('Inventory Feature', () => {

  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();
  });

  test('TC-008: Products page displays all 6 items', async () => {
    const count = await inventoryPage.inventoryItems.count();
    expect(count).toBe(6);
  });

  test('TC-009: Sort products A-Z (default)', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();

    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC-010: Sort products Z-A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();

    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC-011: Sort products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-012: Sort products by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();

    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC-013: Add single item to cart updates badge', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');

    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('TC-014: Add multiple items to cart', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt');

    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

  test('TC-015: Remove item from cart on inventory page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });
});
