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
});
