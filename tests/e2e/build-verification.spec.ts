import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const BUILD_DIR = path.resolve(import.meta.dirname, '../../.output/chrome-mv3');
const OUTPUT_DIR = path.resolve(import.meta.dirname, '../../.output');

test.describe('ビルド出力検証', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(BUILD_DIR)) {
      throw new Error(
        `ビルド出力が見つかりません: ${BUILD_DIR}\n先に bun run build を実行してください。`,
      );
    }
  });

  test('manifest.json が存在し、必須フィールドを含む', () => {
    const manifestPath = path.join(BUILD_DIR, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Required fields
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBeTruthy();
    expect(manifest.version).toBeTruthy();
    expect(manifest.description).toBeTruthy();
  });

  test('manifest.json のパーミッションが正しい', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));

    expect(manifest.permissions).toContain('storage');
    expect(manifest.permissions).toContain('alarms');
    expect(manifest.host_permissions).toContain('https://api.switch-bot.com/*');

    // 不要なパーミッションがないことを確認
    const disallowed = ['tabs', 'activeTab', 'webRequest', 'cookies', 'history', 'bookmarks'];
    for (const perm of disallowed) {
      expect(manifest.permissions).not.toContain(perm);
    }
  });

  test('アイコンファイルが存在する', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));

    const icons = manifest.icons || {};
    for (const size of Object.keys(icons)) {
      const iconPath = path.join(BUILD_DIR, icons[size]);
      expect(fs.existsSync(iconPath), `アイコンが見つかりません: ${icons[size]}`).toBe(true);
    }
  });

  test('Service Worker ファイルが存在する', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));

    expect(manifest.background).toBeDefined();
    expect(manifest.background.service_worker).toBeTruthy();

    const swPath = path.join(BUILD_DIR, manifest.background.service_worker);
    expect(fs.existsSync(swPath), 'Service Worker ファイルが見つかりません').toBe(true);
  });

  test('Popup HTML ファイルが存在する', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));

    expect(manifest.action).toBeDefined();
    expect(manifest.action.default_popup).toBeTruthy();

    const popupPath = path.join(BUILD_DIR, manifest.action.default_popup);
    expect(fs.existsSync(popupPath), 'Popup HTML が見つかりません').toBe(true);
  });

  test('manifest_version が 3 である', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));
    expect(manifest.manifest_version).toBe(3);
  });
});

test.describe('Zip 生成検証', () => {
  test('bun run zip で配布用 zip ファイルが生成される', async () => {
    const { execSync } = await import('node:child_process');
    const projectRoot = path.resolve(import.meta.dirname, '../..');

    // zip 生成を実行
    execSync('bun run zip', { cwd: projectRoot, stdio: 'pipe' });

    // .output/ 内に zip ファイルが存在することを確認
    const files = fs.readdirSync(OUTPUT_DIR);
    const zipFiles = files.filter((f) => f.endsWith('.zip'));
    expect(zipFiles.length, 'zip ファイルが .output/ に存在すること').toBeGreaterThanOrEqual(1);

    // zip ファイルのサイズが妥当であることを確認（空ファイルでないこと）
    for (const zipFile of zipFiles) {
      const stat = fs.statSync(path.join(OUTPUT_DIR, zipFile));
      expect(stat.size, `${zipFile} が空でないこと`).toBeGreaterThan(0);
    }
  });

  test('zip ファイル名にバージョン情報が含まれる', () => {
    const files = fs.readdirSync(OUTPUT_DIR);
    const zipFiles = files.filter((f) => f.endsWith('.zip'));
    expect(zipFiles.length).toBeGreaterThanOrEqual(1);

    // zip ファイル名にプロジェクト名が含まれることを確認
    const hasProjectName = zipFiles.some((f) => f.includes('switchbot'));
    expect(hasProjectName, 'zip ファイル名にプロジェクト名が含まれること').toBe(true);

    // zip ファイル名に chrome が含まれることを確認
    const hasBrowserName = zipFiles.some((f) => f.includes('chrome'));
    expect(hasBrowserName, 'zip ファイル名にブラウザ名が含まれること').toBe(true);
  });
});
