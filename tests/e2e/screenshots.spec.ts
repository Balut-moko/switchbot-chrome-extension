import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures';

const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../screenshots');

test.describe('スクリーンショット撮影', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  test('popup のスクリーンショットを撮影する', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    // Popup サイズに合わせてビューポートを設定
    await page.setViewportSize({ width: 400, height: 600 });

    // 少し待ってレンダリングを安定させる
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'popup.png'),
      fullPage: true,
    });

    expect(fs.existsSync(path.join(SCREENSHOTS_DIR, 'popup.png'))).toBe(true);
  });
});
