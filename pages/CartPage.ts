import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Cart Page Object Model
 * ======================
 * Manages shopping cart interactions and checkout initiation.
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectPageLoaded() {
    await expect(this.title).toHaveText('Your Cart');
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
