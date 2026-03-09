import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const BUILD_DIR = path.resolve(import.meta.dirname, '../../.output/chrome-mv3');

test.describe('Build output verification', () => {
  test('manifest.json has required permissions', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.permissions).toContain('storage');
    expect(manifest.permissions).toContain('alarms');
    expect(manifest.host_permissions).toContain('https://api.switch-bot.com/*');
  });

  test('manifest.json has correct action configuration', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'manifest.json'), 'utf-8'));
    expect(manifest.action).toBeDefined();
    expect(manifest.action.default_popup).toBe('popup.html');
  });

  test('expected files exist in build output', () => {
    const requiredFiles = [
      'manifest.json',
      'popup.html',
      'background.js',
      'icon-16.png',
      'icon-32.png',
      'icon-48.png',
      'icon-128.png',
    ];
    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(BUILD_DIR, file)), `${file} should exist`).toBe(true);
    }
  });
});
