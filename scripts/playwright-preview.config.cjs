const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '.',
  testMatch: 'preview.spec.cjs',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  reporter: 'list',
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3448', channel: 'chrome', trace: 'off', screenshot: 'off' },
});
