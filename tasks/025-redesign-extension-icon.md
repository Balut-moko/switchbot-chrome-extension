---
id: "025"
title: "拡張機能アイコンをリデザインする"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# 拡張機能アイコンをリデザインする

## Context

現在の拡張機能アイコンは、赤い角丸四角（#E8381E）に半透明の白いトグル風デザインで、
SwitchBot らしさやアプリとしての洗練さに欠ける。Chrome ツールバーや拡張機能一覧で
目立たず、ユーザーにとって識別しにくい状態になっている。

アイコンは `public/icon.svg` をソースとして `scripts/generate-icons.ts` で
16/32/48/128px の PNG を自動生成する仕組みが整っている。

## Requirements

- SwitchBot のブランドカラー・イメージを意識したデザインにする
- 16px でも視認性の高いシンプルなデザインにする
- `public/icon.svg` を更新し、`bun run generate:icons` で PNG を再生成する
- Chrome Web Store のアイコン要件（128x128、透過背景推奨）を満たす

## Affected Files

- `public/icon.svg` — アイコンデザインの更新
- `public/icon-16.png` — SVG から再生成
- `public/icon-32.png` — SVG から再生成
- `public/icon-48.png` — SVG から再生成
- `public/icon-128.png` — SVG から再生成

## Acceptance Criteria

- [x] 新しい `icon.svg` が作成されている
- [x] `bun run generate:icons` で全サイズの PNG が正常に生成される
- [x] 16px サイズでも識別可能なデザインである
- [x] `bun run build` が成功する

## Notes

- デザイン案は複数提示してユーザーに選んでもらう形が望ましい
- SwitchBot 公式ロゴをそのまま使用すると商標問題の可能性があるため、
  オリジナルデザインで SwitchBot を連想させるものにする
