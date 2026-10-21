const { test, expect } = require('@playwright/test');

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('lives inside the Contact section with name, email and message fields', async ({ page }) => {
    const contact = page.locator('#contact');
    const form = contact.locator('#contact-form');

    await expect(form).toBeVisible();
    await expect(form.getByLabel('Naam')).toHaveAttribute('type', 'text');
    await expect(form.getByLabel('Email')).toHaveAttribute('type', 'email');
    await expect(form.getByLabel('Message')).toHaveJSProperty('tagName', 'TEXTAREA');
    await expect(form.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('all fields and the button are reachable with the keyboard', async ({ page }) => {
    const focused = [];
    await page.locator('#contact-form').getByLabel('Naam').focus();

    for (let i = 0; i < 4; i += 1) {
      focused.push(await page.evaluate(() => document.activeElement?.id || document.activeElement?.type || ''));
      await page.keyboard.press('Tab');
    }

    expect(focused).toEqual(['name', 'email', 'message', 'submit']);
  });

  test('does not send or show a status when fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.locator('#form-status')).toHaveText('');
    await expect(page.locator('#form-status')).toHaveAttribute('aria-live', 'polite');
  });

  test('stays within the viewport on this device', async ({ page }) => {
    const box = await page.locator('#contact-form').boundingBox();
    const viewport = page.viewportSize();

    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  });
});
