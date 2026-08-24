# Playwright Automation Framework

A production-ready end-to-end test automation framework built with **Playwright** and **TypeScript**, featuring Page Object Model architecture, cross-browser testing, API testing, and CI/CD integration.

## Features

- **Cross-Browser Testing** — Chromium, Firefox, WebKit, and Mobile viewports
- - **Page Object Model (POM)** — Clean, maintainable test architecture
  - - **API Testing** — REST API validation with request/response assertions
    - - **Visual Regression** — Screenshot comparison for UI consistency
      - - **CI/CD Ready** — GitHub Actions workflow included
        - - **HTML Reports** — Detailed test reports with screenshots and traces
          - - **Parallel Execution** — Run tests concurrently across browsers
            - - **Data-Driven Testing** — Parameterized tests with external test data
              - - **Web Scraping** — Browser automation for data extraction
                - - **Auto-Wait & Retry** — Built-in smart waiting strategies
                 
                  - ## Tech Stack
                 
                  - | Technology | Purpose |
                  - |---|---|
                  - | Playwright | Browser automation engine |
                  - | TypeScript | Type-safe test development |
                  - | Node.js | Runtime environment |
                  - | GitHub Actions | CI/CD pipeline |
                  - | HTML Reporter | Test result visualization |
                 
                  - ## Project Structure
                 
                  - ```
                    src/
                      pages/           # Page Object classes
                        LoginPage.ts
                        DashboardPage.ts
                        SearchPage.ts
                      tests/           # Test specifications
                        auth.spec.ts
                        dashboard.spec.ts
                        api.spec.ts
                        visual.spec.ts
                      fixtures/        # Test data and setup
                      utils/           # Helper functions
                      config/          # Environment configs
                    playwright.config.ts
                    ```

                    ## Quick Start

                    ```bash
                    # Clone the repository
                    git clone https://github.com/HKHJA/playwright-automation-framework.git
                    cd playwright-automation-framework

                    # Install dependencies
                    npm install

                    # Install browsers
                    npx playwright install

                    # Run all tests
                    npx playwright test

                    # Run tests with UI mode
                    npx playwright test --ui

                    # Run specific test file
                    npx playwright test tests/auth.spec.ts

                    # Generate HTML report
                    npx playwright show-report
                    ```

                    ## Example Test

                    ```typescript
                    import { test, expect } from '@playwright/test';
                    import { LoginPage } from '../pages/LoginPage';

                    test.describe('Authentication', () => {
                      let loginPage: LoginPage;

                      test.beforeEach(async ({ page }) => {
                        loginPage = new LoginPage(page);
                        await loginPage.navigate();
                      });

                      test('should login with valid credentials', async ({ page }) => {
                        await loginPage.login('user@example.com', 'password123');
                        await expect(page).toHaveURL('/dashboard');
                        await expect(page.locator('[data-testid="welcome"]'))
                          .toBeVisible();
                      });

                      test('should show error for invalid credentials', async () => {
                        await loginPage.login('invalid@email.com', 'wrong');
                        await expect(loginPage.errorMessage)
                          .toHaveText('Invalid credentials');
                      });
                    });
                    ```

                    ## Page Object Example

                    ```typescript
                    import { Page, Locator } from '@playwright/test';

                    export class LoginPage {
                      readonly page: Page;
                      readonly emailInput: Locator;
                      readonly passwordInput: Locator;
                      readonly submitButton: Locator;
                      readonly errorMessage: Locator;

                      constructor(page: Page) {
                        this.page = page;
                        this.emailInput = page.locator('#email');
                        this.passwordInput = page.locator('#password');
                        this.submitButton = page.locator('button[type="submit"]');
                        this.errorMessage = page.locator('.error-message');
                      }

                      async navigate() {
                        await this.page.goto('/login');
                      }

                      async login(email: string, password: string) {
                        await this.emailInput.fill(email);
                        await this.passwordInput.fill(password);
                        await this.submitButton.click();
                      }
                    }
                    ```

                    ## API Testing Example

                    ```typescript
                    import { test, expect } from '@playwright/test';

                    test.describe('API Tests', () => {
                      test('GET /users returns 200', async ({ request }) => {
                        const response = await request.get('/api/users');
                        expect(response.status()).toBe(200);
                        const data = await response.json();
                        expect(data.users).toBeDefined();
                        expect(data.users.length).toBeGreaterThan(0);
                      });

                      test('POST /users creates user', async ({ request }) => {
                        const response = await request.post('/api/users', {
                          data: { name: 'Test User', email: 'test@example.com' }
                        });
                        expect(response.status()).toBe(201);
                      });
                    });
                    ```

                    ## CI/CD — GitHub Actions

                    ```yaml
                    name: Playwright Tests
                    on: [push, pull_request]
                    jobs:
                      test:
                        runs-on: ubuntu-latest
                        steps:
                          - uses: actions/checkout@v4
                          - uses: actions/setup-node@v4
                            with:
                              node-version: 20
                          - run: npm ci
                          - run: npx playwright install --with-deps
                          - run: npx playwright test
                          - uses: actions/upload-artifact@v4
                            if: always()
                            with:
                              name: playwright-report
                              path: playwright-report/
                    ```

                    ## Configuration

                    ```typescript
                    // playwright.config.ts
                    import { defineConfig, devices } from '@playwright/test';

                    export default defineConfig({
                      testDir: './src/tests',
                      fullyParallel: true,
                      retries: process.env.CI ? 2 : 0,
                      workers: process.env.CI ? 1 : undefined,
                      reporter: 'html',
                      use: {
                        baseURL: 'https://your-app.com',
                        trace: 'on-first-retry',
                        screenshot: 'only-on-failure',
                      },
                      projects: [
                        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
                        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
                        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
                        { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
                        { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
                      ],
                    });
                    ```

                    ## Services Offered

                    - **Full Test Framework Setup** — From scratch with POM architecture
                    - - **Migration** — Selenium/Cypress to Playwright migration
                      - - **CI/CD Integration** — GitHub Actions, Jenkins, GitLab CI
                        - - **Web Scraping** — Data extraction with browser automation
                          - - **API Test Suites** — REST API validation and monitoring
                            - - **Test Maintenance** — Ongoing test updates and optimization
                             
                              - ## Contact
                             
                              - Available for freelance projects. Reach out for test automation, web scraping, or browser automation work.
                             
                              - ## License
                             
                              - MIT
