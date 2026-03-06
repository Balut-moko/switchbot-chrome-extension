---
id: "034"
title: "Popup のデバイスカードにデバイスタイプを表示する"
status: "todo"
priority: "low"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# Popup のデバイスカードにデバイスタイプを表示する

## Context

Options ページの DeviceSettings ではデバイス名の横に `(deviceType)` が表示されるが、Popup のデバイスカードにはデバイス名のみ表示されている。同名のデバイスが複数ある場合や、デバイスタイプを確認したい場合に区別がつきにくい。

現在の DeviceCard のレイアウト:
- コントロール系: アイコン + デバイス名 + 操作ボタン
- センサー系: アイコン + デバイス名 + バッジ
- AC/TV 系: デバイス名 + コントロール UI

デバイス名の下にデバイスタイプをサブテキストとして小さく表示する。

## Requirements

- DeviceCard の全バリアント（control, sensor, ac/tv/lock）でデバイス名の下にデバイスタイプを小さく表示する
- 表示形式: デバイス名の直下にグレーの小さいテキスト（`text-xs text-gray-400`）
- Popup の限られたスペースを考慮し、1行に収まるよう `truncate` を適用する
- ダークモードに対応する

## Affected Files

- `src/components/DeviceCard.tsx` — 各バリアントのデバイス名表示箇所に `deviceType` サブテキストを追加

## Acceptance Criteria

- [ ] コントロール系デバイスカードにデバイスタイプが表示される
- [ ] センサー系デバイスカードにデバイスタイプが表示される
- [ ] AC/TV/Lock 系デバイスカードにデバイスタイプが表示される
- [ ] ダークモードで正しく表示される
- [ ] 長いデバイスタイプ名が truncate される
- [ ] `bun run build` が TypeScript エラーなしで成功する
