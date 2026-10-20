const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

/**
 * The site is plain HTML/CSS, so tests load it straight from disk.
 * `index.html` is resolved relative to this config (which also handles
 * spaces in the folder name).
 */
const siteDir = pathToFileURL(__dirname + path.sep).href;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: siteDir,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
