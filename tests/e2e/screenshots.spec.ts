import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { expect, test } from './fixtures';

const STORE_ASSETS_DIR = path.resolve(import.meta.dirname, '../../store-assets');
const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, 'screenshots');
const RAW_DIR = path.join(SCREENSHOTS_DIR, 'raw');

/** Chrome Web Store スクリーンショット推奨サイズ */
const STORE_SIZE = { width: 1280, height: 800 };

/**
 * 実際の Chrome ポップアップ body の寸法（src/entrypoints/popup/style.css と一致）。
 * width: 560px / min-height: 400px / max-height: 600px
 */
const POPUP_SIZE = { width: 560, height: 600 };

/** スクリーンショットを撮るテーマ・ロケールの組み合わせ */
const THEMES = ['light', 'dark'] as const;
const LOCALES = ['ja', 'en'] as const;
type Theme = (typeof THEMES)[number];
type Locale = (typeof LOCALES)[number];

/** OptionsView の見出し（言語ごと） */
const SETTINGS_TITLE: Record<Locale, string> = {
  ja: 'SwitchBot Controller 設定',
  en: 'SwitchBot Controller Settings',
};

/** 設定ボタンの title 属性（言語ごと） */
const SETTINGS_BUTTON_TITLE: Record<Locale, string> = {
  ja: '設定',
  en: 'Settings',
};

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

/**
 * 拡張ページ内で chrome.storage.local にテーマ・言語設定を書き込む。
 * popup の useTheme / useLocale が初回マウント時に読むため、書き込み後にリロードする。
 */
async function applyPopupPreferences(
  page: import('@playwright/test').Page,
  theme: Theme,
  locale: Locale,
) {
  await page.evaluate(
    async ({ t, l }) => {
      // biome-ignore lint/suspicious/noExplicitAny: chrome 型は拡張ページのみ
      const c = (globalThis as any).chrome;
      await c.storage.local.set({
        themePreference: t,
        languagePreference: l,
      });
    },
    { t: theme, l: locale },
  );
}

/**
 * ポップアップを開いて、指定のテーマ・言語設定を適用し描画完了まで待つ。
 */
async function openPopup(
  context: import('@playwright/test').BrowserContext,
  extensionId: string,
  theme: Theme,
  locale: Locale,
) {
  const page = await context.newPage();
  await page.setViewportSize(POPUP_SIZE);
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.waitForLoadState('domcontentloaded');

  // 初回ロードで chrome API が使えるようになるのを待ってから storage に書き込む
  await page.waitForFunction(() => {
    // biome-ignore lint/suspicious/noExplicitAny: chrome 型は拡張ページのみ
    return !!(globalThis as any).chrome?.storage?.local;
  });
  await applyPopupPreferences(page, theme, locale);

  // storage 反映のためリロード
  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  // ストア画像で意図せず横スクロールバーが出ないように抑止する。
  // 実際の Chrome ポップアップは popup サイズに body 幅が一致するため横スクロールは発生しない。
  await page.addStyleTag({
    content: `body { overflow-x: hidden !important; }`,
  });

  // Linux のテスト環境には日本語フォント（Hiragino / Yu Gothic 等）が入っていないため、
  // tailwind.config.js のフォントスタック末尾にある Noto Sans / Noto Sans JP を
  // Google Fonts 経由で読み込み、フォールバックとして利用する。
  // これにより撮影画像が macOS/Windows ユーザーの見た目に近づく。
  await page.addStyleTag({
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap',
  });

  // デバイス一覧の最初のカードが描画されるまで待つ
  await page.waitForSelector(`[data-testid="device-card-${MOCK_DEVICE_IDS[0]}"]`, {
    timeout: 10_000,
  });
  // Web フォントのロード完了を待つ
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  return page;
}

/**
 * 560x600 のポップアップ生スクリーンショットを 1280x800 のストア画像に合成する。
 * テーマに応じた背景色＋ドロップシャドウで「ポップアップが浮いている」見た目にする。
 */
async function composeStoreImage(rawPath: string, outPath: string, theme: Theme) {
  const bg = theme === 'dark' ? { r: 32, g: 33, b: 36 } : { r: 240, g: 242, b: 245 };

  // ドロップシャドウ付きの popup レイヤーを作る
  const popupBuf = await sharp(rawPath).png().toBuffer();

  // 影は同サイズの黒い矩形を半透明でずらして重ねる
  const shadow = await sharp({
    create: {
      width: POPUP_SIZE.width,
      height: POPUP_SIZE.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: theme === 'dark' ? 0.6 : 0.18 },
    },
  })
    .png()
    .blur(20)
    .toBuffer();

  const left = Math.floor((STORE_SIZE.width - POPUP_SIZE.width) / 2);
  const top = Math.floor((STORE_SIZE.height - POPUP_SIZE.height) / 2);

  await sharp({
    create: {
      width: STORE_SIZE.width,
      height: STORE_SIZE.height,
      channels: 3,
      background: bg,
    },
  })
    .composite([
      { input: shadow, left: left + 6, top: top + 14, blend: 'over' },
      { input: popupBuf, left, top, blend: 'over' },
    ])
    // Chrome Web Store 要件: 24-bit PNG（アルファチャンネルなし）
    .flatten({ background: bg })
    .png({ palette: false, compressionLevel: 9 })
    .toColorspace('srgb')
    .removeAlpha()
    .toFile(outPath);
}

// --- メイン: テーマ × ロケールごとの撮影 + ストア用合成 ---

test.describe('Chrome Web Store 掲載用スクリーンショット撮影', () => {
  test.beforeAll(() => {
    for (const dir of [STORE_ASSETS_DIR, RAW_DIR]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  });

  for (const theme of THEMES) {
    for (const locale of LOCALES) {
      const variant = `${theme}-${locale}`;

      test(`Popup（デバイス一覧）[${variant}]`, async ({ context, extensionId }) => {
        const page = await openPopup(context, extensionId, theme, locale);

        // body 要素を切り出してポップアップ実寸でキャプチャ
        const rawPath = path.join(RAW_DIR, `popup-${variant}.png`);
        await page.locator('body').screenshot({ path: rawPath });

        // 1280x800 ストア画像を合成
        const storePath = path.join(STORE_ASSETS_DIR, `screenshot-popup-${variant}.png`);
        await composeStoreImage(rawPath, storePath, theme);

        expect(fs.existsSync(rawPath)).toBe(true);
        expect(fs.existsSync(storePath)).toBe(true);
      });

      test(`Settings 画面 [${variant}]`, async ({ context, extensionId }) => {
        const page = await openPopup(context, extensionId, theme, locale);

        // 設定ボタンをクリックして OptionsView を表示
        const settingsBtn = page.locator(`button[title="${SETTINGS_BUTTON_TITLE[locale]}"]`);
        await settingsBtn.click();
        // 設定見出しが出るまで待つ
        await page.getByText(SETTINGS_TITLE[locale]).first().waitFor({ timeout: 5_000 });
        await page.waitForTimeout(300);

        const rawPath = path.join(RAW_DIR, `settings-${variant}.png`);
        await page.locator('body').screenshot({ path: rawPath });

        const storePath = path.join(STORE_ASSETS_DIR, `screenshot-settings-${variant}.png`);
        await composeStoreImage(rawPath, storePath, theme);

        expect(fs.existsSync(rawPath)).toBe(true);
        expect(fs.existsSync(storePath)).toBe(true);
      });
    }
  }
});

// --- デバイスごとの細かいスクリーンショット（README / ブログ用途） ---

test.describe('デバイスごとのスクリーンショット撮影', () => {
  test.beforeAll(() => {
    for (const theme of THEMES) {
      for (const locale of LOCALES) {
        const dir = path.join(SCREENSHOTS_DIR, `${theme}-${locale}`);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }
    }
  });

  for (const theme of THEMES) {
    for (const locale of LOCALES) {
      const variant = `${theme}-${locale}`;
      test.describe(`${variant}`, () => {
        for (const deviceId of MOCK_DEVICE_IDS) {
          test(`デバイスカード: ${deviceId} [${variant}]`, async ({ context, extensionId }) => {
            const page = await openPopup(context, extensionId, theme, locale);

            const card = page.locator(`[data-testid="device-card-${deviceId}"]`);
            await card.waitFor({ state: 'attached', timeout: 5_000 });
            await card.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            const out = path.join(SCREENSHOTS_DIR, variant, `device-${deviceId}.png`);
            await card.screenshot({ path: out });

            expect(fs.existsSync(out)).toBe(true);
          });
        }
      });
    }
  }
});
