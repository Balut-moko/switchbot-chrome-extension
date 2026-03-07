import type { Locale } from '@/utils/locale';

export const UI_MESSAGES: Record<string, Record<Locale, string>> = {
  // Popup App
  LOADING: { ja: '読み込み中...', en: 'Loading...' },
  SETUP_REQUIRED: { ja: 'セットアップが必要です', en: 'Setup Required' },
  SETUP_DESCRIPTION: {
    ja: 'SwitchBot API の認証情報を設定して始めましょう。',
    en: 'Configure your SwitchBot API credentials to get started.',
  },
  OPEN_SETTINGS: { ja: '設定を開く', en: 'Open Settings' },

  // Options App
  CREDENTIALS_SAVED: { ja: '認証情報を保存しました！', en: 'Credentials saved successfully!' },
  SETTINGS_TITLE: { ja: 'SwitchBot Controller 設定', en: 'SwitchBot Controller Settings' },
  SETTINGS_DESCRIPTION: {
    ja: 'SwitchBot API の認証情報を入力してください。SwitchBot アプリの 設定 > 開発者向けオプション から取得できます。',
    en: 'Enter your SwitchBot API credentials to get started. You can find them in the SwitchBot app under Settings > Developer Options.',
  },

  // Collapsible API Settings
  API_SETTINGS: { ja: 'API 設定', en: 'API Settings' },
  API_CONFIGURED: { ja: '設定済み', en: 'Configured' },
  API_NOT_CONFIGURED: { ja: '未設定', en: 'Not configured' },

  // DeviceList
  REFRESH: { ja: '更新', en: 'Refresh' },
  SETTINGS: { ja: '設定', en: 'Settings' },
  NO_SEARCH_RESULTS: {
    ja: '検索に一致するデバイスがありません。',
    en: 'No devices match your search.',
  },
  NO_DEVICES: { ja: 'デバイスが見つかりません。', en: 'No devices found.' },
  SECTION_CONTROLS: { ja: '操作デバイス', en: 'Controls' },
  SECTION_SENSORS: { ja: 'センサー', en: 'Sensors' },
  SECTION_IR_DEVICES: { ja: 'IR デバイス', en: 'IR Devices' },
  LOADING_DEVICES: { ja: 'デバイスを読み込み中...', en: 'Loading devices...' },

  // SearchBar
  SEARCH: { ja: '検索', en: 'Search' },
  SEARCH_PLACEHOLDER: { ja: 'デバイスを検索...', en: 'Search devices...' },

  // UnlockPrompt
  UI_LOCKED: { ja: 'ロック中', en: 'Locked' },
  UNLOCK_DESCRIPTION: {
    ja: 'マスターパスワードを入力してデバイスにアクセスしてください。',
    en: 'Enter your master password to access devices.',
  },
  MASTER_PASSWORD_PLACEHOLDER: { ja: 'マスターパスワード', en: 'Master password' },
  UNLOCKING: { ja: 'ロック解除中...', en: 'Unlocking...' },
  UNLOCK: { ja: 'ロック解除', en: 'Unlock' },

  // ApiKeyForm
  API_CREDENTIALS: { ja: 'API 認証情報', en: 'API Credentials' },
  API_TOKEN: { ja: 'API トークン', en: 'API Token' },
  API_TOKEN_PLACEHOLDER: {
    ja: 'SwitchBot API トークンを入力',
    en: 'Enter your SwitchBot API Token',
  },
  API_SECRET: { ja: 'API シークレット', en: 'API Secret' },
  API_SECRET_PLACEHOLDER: {
    ja: 'SwitchBot API シークレットを入力',
    en: 'Enter your SwitchBot API Secret',
  },
  SHOW: { ja: '表示', en: 'Show' },
  HIDE: { ja: '非表示', en: 'Hide' },
  MASTER_PASSWORD_LABEL: { ja: 'マスターパスワード', en: 'Master Password' },
  MASTER_PASSWORD_CREATE: { ja: 'マスターパスワードを作成', en: 'Create a master password' },
  CONFIRM_PASSWORD: { ja: 'パスワード確認', en: 'Confirm Password' },
  CONFIRM_PASSWORD_PLACEHOLDER: {
    ja: 'マスターパスワードを再入力',
    en: 'Confirm master password',
  },
  CREDENTIALS_ALREADY_SAVED_HINT: {
    ja: '認証情報は設定済みです。変更する場合のみ新しい値を入力してください。',
    en: 'Credentials are already configured. Enter new values only if you want to change them.',
  },
  SAVING: { ja: '保存中...', en: 'Saving...' },
  SAVE_CREDENTIALS: { ja: '認証情報を保存', en: 'Save Credentials' },

  // SecuritySettings
  SECURITY_MODE: { ja: 'セキュリティモード', en: 'Security Mode' },
  STANDARD_MODE: { ja: '標準（推奨）', en: 'Standard (Recommended)' },
  STANDARD_DESCRIPTION: {
    ja: '認証情報はブラウザに保存されます。デバイスにすぐアクセスできます。',
    en: 'Credentials are stored in the browser. Quick access to your devices.',
  },
  HIGH_SECURITY_MODE: { ja: '高セキュリティ', en: 'High Security' },
  HIGH_SECURITY_DESCRIPTION: {
    ja: 'マスターパスワードで暗号化されます。ブラウザセッションごとに入力が必要です。',
    en: "Encrypted with a master password. You'll need to enter it once per browser session.",
  },

  // ConnectionTest
  TESTING: { ja: 'テスト中...', en: 'Testing...' },
  TEST_CONNECTION: { ja: '接続テスト', en: 'Test Connection' },
  CONNECTION_SUCCESS: {
    ja: '接続成功！ {count} 台のデバイスが見つかりました。',
    en: 'Connected! {count} device(s) found.',
  },

  // DeviceSettings
  DEVICE_DISPLAY_SETTINGS: { ja: 'デバイス表示設定', en: 'Device Display Settings' },
  DEVICE_DISPLAY_HINT: {
    ja: 'ドラッグ＆ドロップでデバイスの並び順を変更できます。',
    en: 'Drag and drop to reorder devices.',
  },
  DEVICE_DISABLED_LABEL: { ja: '操作不可', en: 'Disable control' },
  DEVICE_DISABLED_TOOLTIP: {
    ja: '操作不可（クリックで解除）',
    en: 'Control disabled (click to enable)',
  },
  DEVICE_ENABLED_TOOLTIP: {
    ja: '操作可能（クリックで無効化）',
    en: 'Control enabled (click to disable)',
  },
  NO_DEVICES_FOUND: {
    ja: 'デバイスが見つかりません。先に API 接続をテストしてください。',
    en: 'No devices found. Test your API connection first.',
  },

  // ACControl
  TURN_OFF: { ja: 'オフにする', en: 'Turn off' },
  TURN_ON: { ja: 'オンにする', en: 'Turn on' },
  DECREASE_TEMP: { ja: '温度を下げる', en: 'Decrease temperature' },
  INCREASE_TEMP: { ja: '温度を上げる', en: 'Increase temperature' },
  AC_MODE: { ja: 'モード', en: 'Mode' },
  AC_MODE_LABEL: { ja: 'エアコンモード', en: 'AC mode' },
  FAN: { ja: '風量', en: 'Fan' },
  FAN_SPEED: { ja: '風速', en: 'Fan speed' },

  // SensorDisplay
  MOTION_DETECTED: { ja: '動体検知！', en: 'Motion!' },
  MOTION_CLEAR: { ja: 'なし', en: 'Clear' },
  CONTACT_OPEN: { ja: '開', en: 'Open' },
  CONTACT_CLOSED: { ja: '閉', en: 'Closed' },

  // LockControl
  CONFIRM: { ja: '確認？', en: 'Confirm?' },
  LOCK_LOCKED: { ja: '施錠', en: 'Locked' },
  LOCK_UNLOCKED: { ja: '解錠', en: 'Unlocked' },

  // TVControl
  TV_ON: { ja: 'ON', en: 'ON' },
  TV_OFF: { ja: 'OFF', en: 'OFF' },

  // Reorder Mode
  REORDER_MODE: { ja: '並び替え', en: 'Reorder' },
  REORDER_MODE_DONE: { ja: '完了', en: 'Done' },

  // BotControl
  PRESS: { ja: '押す', en: 'Press' },

  // IR Remote (generic)
  IR_POWER_ON: { ja: 'ON', en: 'ON' },
  IR_POWER_OFF: { ja: 'OFF', en: 'OFF' },

  // LanguageSettings
  LANGUAGE_SETTING: { ja: '言語設定', en: 'Language' },
  LANGUAGE_AUTO: { ja: '自動（ブラウザ設定に従う）', en: 'Auto (Follow browser settings)' },
  LANGUAGE_JA: { ja: '日本語', en: '日本語' },
  LANGUAGE_EN: { ja: 'English', en: 'English' },
};
