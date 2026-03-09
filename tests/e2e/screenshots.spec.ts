import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures';

const STORE_ASSETS_DIR = path.resolve(import.meta.dirname, '../../store-assets');

/** Chrome Web Store スクリーンショット推奨サイズ */
const STORE_VIEWPORT = { width: 1280, height: 800 };

test.describe('Chrome Web Store 掲載用スクリーンショット撮影', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(STORE_ASSETS_DIR)) {
      fs.mkdirSync(STORE_ASSETS_DIR, { recursive: true });
    }
  });

  test('Popup UI（デバイス一覧）のスクリーンショットを撮影する', async ({
    context,
    extensionId,
  }) => {
    const page = await context.newPage();
    await page.setViewportSize(STORE_VIEWPORT);
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    // レンダリングを安定させる
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(STORE_ASSETS_DIR, 'screenshot-popup.png');
    await page.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });

  test('Settings 画面のスクリーンショットを撮影する', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.setViewportSize(STORE_VIEWPORT);
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    // レンダリングを安定させる
    await page.waitForTimeout(2000);

    // 設定画面に遷移する（歯車アイコンボタンをクリック）
    const settingsButton = page.locator('button[aria-label="Settings"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
    }

    const screenshotPath = path.join(STORE_ASSETS_DIR, 'screenshot-settings.png');
    await page.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});
