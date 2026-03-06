---
id: "026"
title: "ポップアップ・設定画面の絵文字アイコンを改善する"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# ポップアップ・設定画面の絵文字アイコンを改善する

## Context

現在、ポップアップや設定画面のデバイスアイコン・ステータスアイコンはすべて Unicode 絵文字で
表示されている（🤖 🔌 💡 🌡️ 🔒 など30種以上）。絵文字は OS・ブラウザごとに見た目が異なり、
ダークモードとの相性やサイズの統一性にも課題がある。

SVG ベースのアイコンライブラリ（Lucide、Heroicons 等）に置き換えることで、
見た目の一貫性とデザイン品質を向上させる。

### 現在の絵文字使用箇所

- **デバイスアイコン** (`src/utils/device.ts` - `DEVICE_ICONS`): Bot🤖, Plug🔌, Bulb💡, Curtain🪞, Lock🔒, Meter🌡️, etc.
- **センサーバッジ** (`src/components/controls/SensorDisplay.tsx`): 温度🌡, 湿度💧, CO₂🌫️, バッテリー🔋, モーション⚠️✅, ドア🔓🔒
- **AC コントロール** (`src/utils/constants.ts`): モード❄️☀️💧🌀🔄, 風速🍃💨🌪️
- **テーマ切替** (`src/components/DeviceList.tsx`): ☀️🌙💻
- **設定画面** (`src/components/options/DeviceSettings.tsx`): デバイスアイコン表示

## Requirements

- アイコンライブラリを選定・導入する（Lucide React 推奨：shadcn/ui との親和性が高い）
- デバイスタイプアイコン（`DEVICE_ICONS`）を SVG アイコンに置き換える
- センサーバッジのアイコンを SVG アイコンに置き換える
- AC コントロールのモード・風速アイコンを SVG アイコンに置き換える
- テーマ切替アイコンを SVG アイコンに置き換える
- ダークモードで適切に表示されること
- アイコンサイズを統一する

## Affected Files

- `package.json` — アイコンライブラリの依存追加
- `src/utils/device.ts` — `DEVICE_ICONS` / `getDeviceIcon()` を SVG コンポーネントに変更
- `src/components/controls/SensorDisplay.tsx` — バッジアイコンを SVG に変更
- `src/utils/constants.ts` — AC モード・風速のアイコンを SVG に変更
- `src/components/controls/ACControl.tsx` — AC アイコン表示の更新
- `src/components/DeviceList.tsx` — テーマ切替アイコンの更新
- `src/components/DeviceCard.tsx` — デバイスアイコン表示の更新
- `src/components/options/DeviceSettings.tsx` — 設定画面のアイコン表示の更新

## Acceptance Criteria

- [ ] アイコンライブラリが導入されている
- [ ] デバイスアイコンが SVG アイコンに置き換わっている
- [ ] センサーバッジのアイコンが SVG に置き換わっている
- [ ] AC コントロールのアイコンが SVG に置き換わっている
- [ ] テーマ切替アイコンが SVG に置き換わっている
- [ ] ライトモード・ダークモード両方で適切に表示される
- [ ] アイコンサイズが各コンテキストで統一されている
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- Lucide React は tree-shaking 対応で、使用するアイコンのみバンドルされる
- `getDeviceIcon()` の戻り値が `string`（絵文字）から `React.ComponentType` に変わるため、
  呼び出し側の修正が広範囲になる可能性がある
- 段階的に置き換えてもよい（まずデバイスアイコン → センサー → AC の順など）
