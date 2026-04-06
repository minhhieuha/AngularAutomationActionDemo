import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show validation error on invalid login', async ({ page }) => {
    // Fill in wrong credentials
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    
    // Click sign in
    await page.click('#signin-btn');
    
    // Check error message
    const errorMsg = page.locator('#error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Invalid username or password');
  });

  test('should sign in successfully with valid credentials', async ({ page }) => {
    // Fill in correct credentials
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    
    // Click sign in
    await page.click('#signin-btn');
    
    // Check success state
    const successMsg = page.locator('#success-msg');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('You have signed in successfully');
    
    // Check greeting
    await expect(page.getByText('Hello, admin!')).toBeVisible();
  });

  test('should sign out successfully', async ({ page }) => {
    // Perform login first
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('#signin-btn');
    
    // Click sign out
    await page.click('#signout-btn');
    
    // Check if back at login form
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });
});
