---
id: "015"
title: "MeterPro / MeterPro(CO2) のセンサー表示を対応する"
status: "done"
priority: "medium"
phase: 2
depends_on: []
created: "2026-03-04"
updated: "2026-03-04"
---

# MeterPro / MeterPro(CO2) のセンサー表示を対応する

## Context

SwitchBot MeterPro および MeterPro(CO2) が `SENSOR_TYPES` と `DEVICE_CAPABILITIES` に未登録のため、
カテゴリが `'other'` に分類され、SensorDisplay コンポーネントが使われない。
また CO2 値の表示ロジックと型定義も存在しない。

## Requirements

- `MeterPro` と `MeterPro(CO2)` をセンサーデバイスとして認識させる
- MeterPro(CO2) の CO2 値を SensorDisplay に表示する
- 対応する型定義を追加する

## Affected Files

- `src/utils/device.ts` — `SENSOR_TYPES` に `'MeterPro'`, `'MeterPro(CO2)'` を追加、`DEVICE_ICONS` にエントリ追加
- `src/utils/deviceCapabilities.ts` — `MeterPro` / `MeterPro(CO2)` の capabilities 追加（CO2 用に `hasCO2` フラグ新設）
- `src/types/switchbot.ts` — `MeterProCO2Status` 型を追加（`CO2: number` フィールド）、`DeviceStatus` union に追加
- `src/components/controls/SensorDisplay.tsx` — CO2 値の表示ロジックを追加

## Acceptance Criteria

- [x] MeterPro がセンサーカテゴリに分類され、温度・湿度・バッテリーが表示される
- [x] MeterPro(CO2) がセンサーカテゴリに分類され、温度・湿度・CO2・バッテリーが表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- API レスポンスの `deviceType` 文字列が `"MeterPro(CO2)"` かどうかは実機で要確認（括弧を含む可能性がある）
- CO2 の単位は ppm で表示する
