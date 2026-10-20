const { test, expect } = require('@playwright/test');

test.describe('Navigation & interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('About link jumps to the About section without a page reload', async ({ page }) => {
    await page.evaluate(() => {
      window.__stayedOnPage = true;
    });

    await page.locator('.nav nav a', { hasText: 'About' }).click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#about')).toBeInViewport();
    expect(await page.evaluate(() => window.__stayedOnPage)).toBe(true);
  });

  test('Contact link jumps to the Contact section', async ({ page }) => {
    await page.locator('.nav nav a', { hasText: 'Contact' }).click();

    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.locator('#contact').getByRole('link')).toHaveText(
      'axayranwa7502@gmail.com'
    );
  });

  test('logo scrolls back to the top of the page', async ({ page }) => {
    await page.locator('.nav nav a', { hasText: 'Contact' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.locator('.logo').click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test('keyboard order is logo → About → Contact → CTA', async ({ page }) => {
    const focused = [];
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
      focused.push(
        await page.evaluate(() => (document.activeElement?.textContent || '').trim())
      );
    }

    expect(focused).toEqual([
      'MySite',
      'About',
      'Contact',
      'GitHub par dekho',
    ]);
  });
});
