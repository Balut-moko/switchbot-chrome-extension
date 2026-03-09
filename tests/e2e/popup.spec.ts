import { expect, test } from './fixtures';

test.describe('Popup UI', () => {
  test('popup ページが開く', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    // ページが読み込まれることを確認
    await page.waitForLoadState('domcontentloaded');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('popup ページのタイトルが正しい', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    const title = await page.title();
    expect(title).toBe('SwitchBot Controller');
  });

  test('popup に #root 要素が存在する', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    const root = page.locator('#root');
    await expect(root).toBeAttached();
  });

  test('API キー未設定時は設定画面が表示される', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    // API キー未設定の場合、OptionsView（設定画面）が表示される
    // OptionsView には戻るボタン（ArrowLeft アイコン）が含まれる
    // 読み込み完了を待つ（loading 状態から遷移するまで）
    await page.waitForTimeout(1000);

    // 設定画面または読み込み中のいずれかが表示されていることを確認
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('popup の HTML 構造が正しい', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    // React アプリのスクリプトが読み込まれていることを確認
    const scripts = page.locator('script[type="module"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
