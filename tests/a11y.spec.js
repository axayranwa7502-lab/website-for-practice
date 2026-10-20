const { test, expect } = require('@playwright/test');

/** WCAG relative luminance for an `rgb(r, g, b)` string. */
function luminance(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).slice(0, 3).map((value) => {
    const channel = Number(value) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

test.describe('Accessibility basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('document metadata is complete', async ({ page }) => {
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      'content',
      /width=device-width/
    );
  });

  test('uses one h1 followed by section h2 headings', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(2);

    const headings = await page
      .locator('h1, h2')
      .evaluateAll((nodes) => nodes.map((node) => node.tagName));
    expect(headings).toEqual(['H1', 'H2', 'H2']);
  });

  test('exposes header, nav, main and footer landmarks', async ({ page }) => {
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('every link has an accessible name and an href', async ({ page }) => {
    const links = await page.locator('a').evaluateAll((nodes) =>
      nodes.map((node) => ({
        name: (node.getAttribute('aria-label') || node.textContent || '').trim(),
        href: node.getAttribute('href'),
      }))
    );

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.name, `link with href "${link.href}" needs a name`).not.toBe('');
      expect(link.href, `link "${link.name}" is missing href`).toBeTruthy();
    }
  });

  test('images, if any, have alternative text', async ({ page }) => {
    const images = await page.locator('img').evaluateAll((nodes) =>
      nodes.map((node) => ({
        alt: node.getAttribute('alt'),
        hidden: node.getAttribute('aria-hidden') === 'true',
      }))
    );

    for (const image of images) {
      expect(image.alt !== null || image.hidden).toBe(true);
    }
  });

  test('external link is safe and announced as a new tab', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'GitHub par dekho' });
    await expect(cta).toHaveAttribute('rel', /\bnoopener\b/);
    await expect(cta).toHaveAttribute('target', '_blank');
  });

  test('muted text meets WCAG AA contrast (4.5:1)', async ({ page }) => {
    const colors = await page.evaluate(() => ({
      foreground: getComputedStyle(document.querySelector('.subtitle')).color,
      background: getComputedStyle(document.body).backgroundColor,
    }));

    expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});
