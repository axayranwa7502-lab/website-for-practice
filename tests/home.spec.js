const { test, expect } = require('@playwright/test');

test.describe('Home page — content & structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('has the right title, language and no console errors', async ({ page }) => {
    const problems = [];

    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));

    await page.reload();

    await expect(page).toHaveTitle('My Website | Practice');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(problems).toEqual([]);
  });

  test('shows the header with logo and both nav links', async ({ page }) => {
    const header = page.locator('header.nav');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'MySite' })).toBeVisible();

    const navLinks = page.locator('.nav nav a');
    await expect(navLinks).toHaveCount(2);
    await expect(navLinks.nth(0)).toHaveText('About');
    await expect(navLinks.nth(0)).toHaveAttribute('href', '#about');
    await expect(navLinks.nth(1)).toHaveText('Contact');
    await expect(navLinks.nth(1)).toHaveAttribute('href', '#contact');
  });

  test('hero shows badge, heading, subtitle and GitHub button', async ({ page }) => {
    await expect(page.locator('.badge')).toHaveText('GitHub Pages ready');
    await expect(page.locator('h1')).toHaveText('Hello, world! 👋');
    await expect(page.locator('.subtitle')).toContainText(
      'Yeh meri pehli website hai jo ab GitHub Pages par live hai.'
    );

    const cta = page.getByRole('link', { name: 'GitHub par dekho' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', 'https://github.com');
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
  });

  test('About section explains where the content lives', async ({ page }) => {
    const about = page.locator('#about');
    await expect(about).toBeVisible();
    await expect(about.getByRole('heading', { level: 2 })).toHaveText('About');
    await expect(about.locator('p')).toContainText('Yahan aap apne baare me likh sakte ho.');
    await expect(about.locator('code')).toHaveText('index.html');
  });

  test('Contact section exposes a working mailto link', async ({ page }) => {
    const contact = page.locator('#contact');
    await expect(contact).toBeVisible();
    await expect(contact.getByRole('heading', { level: 2 })).toHaveText('Contact');

    const mail = contact.getByRole('link');
    await expect(mail).toHaveText('axayranwa7502@gmail.com');
    await expect(mail).toHaveAttribute('href', 'mailto:axayranwa7502@gmail.com');
  });

  test('footer shows copyright and tech credit', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('© 2026 MySite');
    await expect(footer).toContainText('Built with HTML & CSS');
  });
});

test.describe('Home page — styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('style.css is linked and applied to the page', async ({ page }) => {
    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', 'style.css');

    const styles = await page.evaluate(() => {
      const sheetCount = document.styleSheets.length;
      const body = getComputedStyle(document.body);
      const nav = getComputedStyle(document.querySelector('.nav'));
      const button = getComputedStyle(document.querySelector('.btn'));
      const card = getComputedStyle(document.querySelector('.section'));
      return {
        sheetCount,
        bodyBg: body.backgroundColor,
        bodyColor: body.color,
        navDisplay: nav.display,
        buttonBg: button.backgroundColor,
        buttonRadius: button.borderRadius,
        cardBg: card.backgroundColor,
      };
    });

    expect(styles.sheetCount).toBeGreaterThanOrEqual(1);
    expect(styles.bodyBg).toBe('rgb(15, 23, 42)');
    expect(styles.bodyColor).toBe('rgb(226, 232, 240)');
    expect(styles.navDisplay).toBe('flex');
    expect(styles.buttonBg).toBe('rgb(56, 189, 248)');
    expect(styles.buttonRadius).toBe('8px');
    expect(styles.cardBg).toBe('rgb(30, 41, 59)');
  });

  test('badge, subtitle and CTA use the theme palette', async ({ page }) => {
    const palette = await page.evaluate(() => ({
      badgeColor: getComputedStyle(document.querySelector('.badge')).color,
      badgeBorder: getComputedStyle(document.querySelector('.badge')).borderTopColor,
      subtitleColor: getComputedStyle(document.querySelector('.subtitle')).color,
      ctaColor: getComputedStyle(document.querySelector('.btn')).color,
    }));

    expect(palette.badgeColor).toBe('rgb(56, 189, 248)');
    expect(palette.badgeBorder).toBe('rgba(56, 189, 248, 0.35)');
    expect(palette.subtitleColor).toBe('rgb(148, 163, 184)');
    expect(palette.ctaColor).toBe('rgb(15, 23, 42)');
  });

  test('button hover lifts the CTA by 2px', async ({ page }) => {
    const cta = page.locator('.btn');
    await cta.hover();
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).transform))
      .toBe('matrix(1, 0, 0, 1, 0, -2)');
  });
});

test.describe('Home page — responsive layout', () => {
  test('does not scroll sideways at the current viewport', async ({ page }) => {
    await page.goto('index.html');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('keeps nav, hero and CTA usable on this viewport', async ({ page }, testInfo) => {
    await page.goto('index.html');

    await expect(page.locator('.nav nav a')).toHaveCount(2);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub par dekho' })).toBeInViewport();

    const h1Size = await page
      .locator('h1')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(h1Size).toBeGreaterThanOrEqual(36);
    expect(h1Size).toBeLessThanOrEqual(56);

    const ctaBox = await page.getByRole('link', { name: 'GitHub par dekho' }).boundingBox();
    expect(ctaBox.height).toBeGreaterThanOrEqual(24);

    testInfo.annotations.push({
      type: 'viewport',
      description: `${testInfo.project.name} — ${page.viewportSize().width}x${page.viewportSize().height}`,
    });
  });
});
