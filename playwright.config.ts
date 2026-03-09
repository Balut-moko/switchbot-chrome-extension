import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'tests/e2e/results',
  timeout: 30_000,
  projects: [
    {
      name: 'chrome-extension',
      use: { browserName: 'chromium' },
    },
  ],
});
