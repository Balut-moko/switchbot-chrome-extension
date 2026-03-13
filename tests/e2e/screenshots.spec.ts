import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures';

const STORE_ASSETS_DIR = path.resolve(import.meta.dirname, '../../store-assets');
const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, 'screenshots');

/** Chrome Web Store スクリーンショット推奨サイズ */
const STORE_VIEWPORT = { width: 1280, height: 800 };

/** Popup 表示用ビューポート */
const POPUP_VIEWPORT = { width: 400, height: 600 };

/** テーマ設定 */
const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

/**
 * モックデバイス一覧（src/lib/mock-data.ts の MOCK_DEVICES と対応）
 */
const MOCK_DEVICE_IDS = [
  'mock-bot-press',
  'mock-bot-switch',
  'mock-plug-mini',
  'mock-color-bulb',
  'mock-strip-light',
  'mock-meter',
  'mock-meter-pro-co2',
  'mock-motion-sensor',
  'mock-contact-sensor',
  'mock-hub-2',
  'mock-curtain',
  'mock-blind-tilt',
  'mock-smart-lock',
  'mock-humidifier',
  'mock-robot-vacuum',
  'mock-ir-ac',
  'mock-ir-tv',
  'mock-ir-light',
  'mock-ir-fan',
];

/** ページのテーマを切り替える */
async function setTheme(page: import('@playwright/test').Page, theme: Theme) {
  await page.evaluate((t) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, theme);
  // テーマ切り替え後のレンダリングを安定させる
  await page.waitForTimeout(500);
}

// --- Store assets（既存） ---

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

// --- デバイスごと × ライト/ダーク スクリーンショット ---

test.describe('デバイスごとのスクリーンショット撮影（ライト/ダーク）', () => {
  test.beforeAll(() => {
    for (const theme of THEMES) {
      const dir = path.join(SCREENSHOTS_DIR, theme);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  });

  for (const theme of THEMES) {
    test.describe(`${theme} モード`, () => {
      test(`デバイス一覧（Popup）のスクリーンショットを撮影する [${theme}]`, async ({
        context,
        extensionId,
      }) => {
        const page = await context.newPage();
        await page.setViewportSize(POPUP_VIEWPORT);
        await page.goto(`chrome-extension://${extensionId}/popup.html`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        await setTheme(page, theme);

        const screenshotPath = path.join(SCREENSHOTS_DIR, theme, 'popup-device-list.png');
        await page.screenshot({ path: screenshotPath });

        expect(fs.existsSync(screenshotPath)).toBe(true);
      });

      test(`Settings 画面のスクリーンショットを撮影する [${theme}]`, async ({
        context,
        extensionId,
      }) => {
        const page = await context.newPage();
        await page.setViewportSize(POPUP_VIEWPORT);
        await page.goto(`chrome-extension://${extensionId}/popup.html`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        await setTheme(page, theme);

        const settingsButton = page.locator('button[aria-label="Settings"]');
        if (await settingsButton.isVisible()) {
          await settingsButton.click();
          await page.waitForTimeout(1000);
        }

        const screenshotPath = path.join(SCREENSHOTS_DIR, theme, 'settings.png');
        await page.screenshot({ path: screenshotPath });

        expect(fs.existsSync(screenshotPath)).toBe(true);
      });

      for (const deviceId of MOCK_DEVICE_IDS) {
        test(`デバイスカード: ${deviceId} のスクリーンショットを撮影する [${theme}]`, async ({
          context,
          extensionId,
        }) => {
          const page = await context.newPage();
          await page.setViewportSize(POPUP_VIEWPORT);
          await page.goto(`chrome-extension://${extensionId}/popup.html`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);

          await setTheme(page, theme);

          const card = page.locator(`[data-testid="device-card-${deviceId}"]`);
          await card.waitFor({ state: 'attached', timeout: 5000 });

          // スクロールで画面外にあるカードも対象とする
          await card.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);

          const screenshotPath = path.join(SCREENSHOTS_DIR, theme, `device-${deviceId}.png`);
          await card.screenshot({ path: screenshotPath });

          expect(fs.existsSync(screenshotPath)).toBe(true);
        });
      }
    });
  }
});
