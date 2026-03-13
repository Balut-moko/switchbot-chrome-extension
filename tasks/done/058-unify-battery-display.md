---
id: "058"
title: "バッテリー残量の表示位置をカード間で統一する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# バッテリー残量の表示位置をカード間で統一する

## Context

現在、バッテリー残量の表示ロジックが3箇所に分散しており、表示位置もカードタイプによって異なる:

1. **通常カード**（Bot, Switch, Light 等）: `DeviceCard.tsx` の `BatteryBadge` コンポーネントがカードフッター（コントロール横）に表示
2. **センサーカード**（Meter, Contact Sensor 等）: `SensorDisplay.tsx` の `buildBadges()` 内でセンサー値（温度・湿度等）と同列にバッジとして表示
3. **フォールバックカード**（Humidifier, Vacuum 等）: `FallbackControl.tsx` の `FallbackStatusDisplay` 内でステータスバッジと同列に表示

このため、バッテリー表示の見た目・位置がカードタイプごとに異なり、UIの一貫性が低い。

## Requirements

- バッテリー残量の表示位置を全デバイスカードで統一する
- 方針の候補:
  1. **DeviceCard レベルに集約**: 全カードタイプで `BatteryBadge` を `DeviceCard.tsx` のヘッダー or フッターに配置し、個別コントロール内からバッテリー表示を除去
  2. **各コントロール内に統一**: 全コントロールでバッジ列内にバッテリーを含める形に統一
- バッテリー非対応デバイスでは表示しない（既存の `getCapabilities().hasBattery` を活用）
- センサーカードのセンサー値（温度・湿度・CO2等）の表示は維持する

## Affected Files

- `src/components/DeviceCard.tsx` — `BatteryBadge` の配置変更。センサーカード・フォールバックカード分岐にもバッテリー表示を追加（方針1の場合）
- `src/components/controls/SensorDisplay.tsx` — `buildBadges()` からバッテリー関連を除去（方針1の場合）
- `src/components/controls/FallbackControl.tsx` — `FallbackStatusDisplay` からバッテリー関連を除去（方針1の場合）

## Acceptance Criteria

- [x] バッテリー対応デバイス（Bot, Meter, Contact Sensor, Curtain, Smart Lock 等）で統一された位置にバッテリーが表示される
- [x] バッテリー非対応デバイス（Plug Mini, IR デバイス等）ではバッテリーが表示されない
- [x] センサーカードの温度・湿度・CO2 等のセンサー値表示が維持される
- [x] ライト/ダークモードの両方で正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- `getCapabilities()` の `hasBattery` フラグでバッテリー対応デバイスを判定可能（`src/utils/deviceCapabilities.ts`）
- 方針1（DeviceCard レベルに集約）の方がロジックの重複が減り保守性が高い
- バッテリー表示の推奨位置: カードヘッダー右上（デバイス名の横）が最も自然
