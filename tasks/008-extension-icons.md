---
id: "008"
title: "拡張機能アイコンを作成する"
status: "done"
priority: "medium"
phase: 5
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# 拡張機能アイコンを作成する

## Context

Chrome 拡張機能にはツールバーアイコンと拡張機能管理ページ用のアイコンが必要。
現在 `wxt.config.ts` にはアイコンの設定がない。

## Requirements

- アイコンを 16px, 32px, 48px, 128px の各サイズで作成
- `public/` ディレクトリに配置（WXT がビルド時にコピー）
- `wxt.config.ts` の `manifest.action.default_icon` と `manifest.icons` を設定
- SwitchBot をイメージさせるデザイン（ロボットアイコン等）

## Affected Files

- `public/icon-16.png` — 新規
- `public/icon-32.png` — 新規
- `public/icon-48.png` — 新規
- `public/icon-128.png` — 新規
- `wxt.config.ts` — `manifest.action.default_icon` と `manifest.icons` 追加

## Acceptance Criteria

- [x] 4サイズのアイコンが `public/` に配置されている
- [x] ビルド後の `manifest.json` にアイコンパスが含まれている
- [x] Chrome のツールバーにアイコンが表示される
- [x] `bun run build` が成功する

## Notes

SVG から各サイズの PNG を生成するか、シンプルな図形ベースのアイコンを手作りする。
SwitchBot の公式ロゴは商標の問題があるため使用不可。
