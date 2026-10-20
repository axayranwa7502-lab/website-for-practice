const { test, expect } = require('@playwright/test');

const LIVE_URL =
  process.env.LIVE_URL || 'https://axayranwa7502-lab.github.io/website-for-practice/';

// Live checks are opt-in so the default run stays fast and offline-friendly.
test.skip(!process.env.RUN_LIVE, 'Set RUN_LIVE=1 to run the GitHub Pages checks');

test.describe('Live GitHub Pages site', () => {
  test('serves HTTP 200 with the merged hero copy', async ({ page }) => {
    const response = await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('My Website | Practice');
    await expect(page.locator('.subtitle')).toContainText('ab GitHub Pages par live hai');
    await expect(page.getByRole('link', { name: 'GitHub par dekho' })).toBeVisible();
  });

  test('serves the stylesheet and About/Contact sections', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'load' });

    const bodyBackground = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBackground).toBe('rgb(15, 23, 42)');

    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#contact a')).toHaveAttribute(
      'href',
      'mailto:axayranwa7502@gmail.com'
    );
  });
});
