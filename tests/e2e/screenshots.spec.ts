import fs from 'node:fs';
import path from 'node:path';
import { test } from './fixtures';

const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../screenshots');

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.describe('Store asset screenshots', () => {
  test('capture popup screenshot at 1280x800', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'screenshot-popup-1280x800.png'),
    });
  });

  test('capture popup screenshot at 640x400', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 640, height: 400 });
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'screenshot-popup-640x400.png'),
    });
  });

  test('capture popup root element screenshot', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 400, height: 600 });
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('networkidle');
    await page.locator('#root').screenshot({
      path: path.join(SCREENSHOTS_DIR, 'screenshot-popup-element.png'),
    });
  });
});
