/**
 * 共通スタイル定義
 *
 * カラーセマンティクス:
 *   - green  = active / ON 状態（スイッチ類: Bot, Plug, TV）
 *   - yellow = active / ON 状態（照明系: Light）
 *   - gray   = inactive / OFF 状態
 *   - blue   = primary 情報（温度・湿度などのセンサー値）
 *   - amber  = alert / 警告（モーション検知・コンタクトオープン）
 *   - red    = locked / 危険操作
 */

// ---------------------------------------------------------------------------
// Badge variants — SensorDisplay, FallbackControl, DeviceCard 等で共通利用
// ---------------------------------------------------------------------------

export type BadgeVariant = 'primary' | 'secondary' | 'alert';

/**
 * バッジの共通ベースクラス（レイアウト・サイズ）
 */
const BADGE_BASE = 'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs';

/**
 * バリアント別のクラス定義
 *
 * - primary:   blue 系 — 主要センサー値（温度・湿度）
 * - secondary: gray 系 — 補助情報（バッテリー・CO2・デバイスタイプ）
 * - alert:     amber 系 — 警告状態（モーション検知・コンタクトオープン）
 */
export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: `${BADGE_BASE} font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`,
  secondary: `${BADGE_BASE} bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400`,
  alert: `${BADGE_BASE} font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
};
