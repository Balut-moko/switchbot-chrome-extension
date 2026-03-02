---
id: "010"
title: "Chrome Web Store 掲載用アセットを作成する"
status: "todo"
priority: "low"
phase: 5
depends_on: ["008"]
created: "2026-03-03"
updated: "2026-03-03"
---

# Chrome Web Store 掲載用アセットを作成する

## Context

Chrome Web Store に公開するにはスクリーンショットやプロモーション画像が必要。

## Requirements

- スクリーンショット: Popup UI と Options ページの各1-2枚（1280x800 or 640x400）
- プロモーション画像（小）: 440x280（任意だが推奨）
- スクリーンショットは実際のデバイス操作画面を使用

## Affected Files

- `store-assets/` — 新規ディレクトリ（Git 管理 or .gitignore）
- `store-assets/screenshot-popup.png`
- `store-assets/screenshot-options.png`
- `store-assets/promo-small.png`

## Acceptance Criteria

- [ ] Popup のスクリーンショットが作成されている
- [ ] Options ページのスクリーンショットが作成されている
- [ ] 画像サイズが Chrome Web Store の要件を満たしている

## Notes

`docs/chrome-web-store-requirements.md` にアセット要件の詳細あり。
実際のデバイスデータがない場合はモックデータで作成する。
