import { expect, test } from './fixtures';

test('popup loads and renders root element', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('#root')).not.toBeEmpty();
});

test('popup has correct title', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page).toHaveTitle(/SwitchBot/i);
});
