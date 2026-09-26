import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const modules = ['PIM', 'Leave', 'Directory'] as const;

test.describe('Parcial 2', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('login exitoso ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillUsername('Admin');
    await loginPage.fillPassword('admin123');
    await loginPage.submit();

    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('login con credenciales inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillUsername('Admin');
    await loginPage.fillPassword('invalid-password');
    await loginPage.submit();

    await expect(loginPage.alertContentText).toHaveText('Invalid credentials');
  });

  test.describe('parametrizado', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.fillUsername('Admin');
      await loginPage.fillPassword('admin123');
      await loginPage.submit();
      await expect(page).toHaveURL(/dashboard\/index/);
    });

    for (const moduleName of modules) {
      test(`navega al módulo ${moduleName}`, async ({ page }) => {
        await page.getByRole('link', { name: moduleName, exact: true }).click();

        await expect(page).toHaveURL(new RegExp(`/${moduleName.toLowerCase()}/`));
        await expect(page.locator('.oxd-topbar-header-breadcrumb-module')).toHaveText(moduleName);
        await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText(moduleName);
      });
    }
  });
});