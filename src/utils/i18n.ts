type Locale = 'ja' | 'en';

function getLocale(): Locale {
  const lang = navigator.language;
  return lang.startsWith('ja') ? 'ja' : 'en';
}

const ERROR_MESSAGES: Record<string, Record<Locale, string>> = {
  // API エラー
  INVALID_CREDENTIALS: {
    ja: 'API 認証情報が無効です。トークンとシークレットを確認してください。',
    en: 'Invalid API credentials. Please check your token and secret.',
  },
  FORBIDDEN: {
    ja: 'アクセスが拒否されました。',
    en: 'Access denied.',
  },
  RATE_LIMITED: {
    ja: 'API リクエスト制限に達しました。しばらく待ってから再試行してください。',
    en: 'API rate limit reached. Please wait and try again.',
  },
  DEVICE_ERROR: {
    ja: 'デバイスエラーが発生しました。',
    en: 'A device error occurred.',
  },

  // 認証エラー
  NO_CREDENTIALS: {
    ja: 'API 認証情報が設定されていません。',
    en: 'API credentials not configured.',
  },
  LOCKED: {
    ja: 'ロック中です。マスターパスワードで解除してください。',
    en: 'Locked. Please unlock with your master password.',
  },
  PASSWORD_REQUIRED: {
    ja: 'マスターパスワードが必要です。',
    en: 'Master password is required.',
  },
  WRONG_PASSWORD: {
    ja: 'パスワードが正しくありません。',
    en: 'Incorrect password.',
  },

  // UI バリデーション・フォールバック
  VALIDATION_TOKEN_SECRET_REQUIRED: {
    ja: 'トークンとシークレットは必須です。',
    en: 'Token and Secret are required.',
  },
  VALIDATION_MASTER_PASSWORD_REQUIRED: {
    ja: '高セキュリティモードにはマスターパスワードが必要です。',
    en: 'Master password is required for High Security mode.',
  },
  VALIDATION_PASSWORDS_MISMATCH: {
    ja: 'パスワードが一致しません。',
    en: 'Passwords do not match.',
  },
  FAILED_TO_SAVE: {
    ja: '保存に失敗しました。',
    en: 'Failed to save.',
  },
  FAILED_TO_UNLOCK: {
    ja: 'ロック解除に失敗しました。',
    en: 'Failed to unlock.',
  },
  FAILED_TO_LOAD_DEVICES: {
    ja: 'デバイスの読み込みに失敗しました。',
    en: 'Failed to load devices.',
  },
  CONNECTION_FAILED: {
    ja: '接続に失敗しました。',
    en: 'Connection failed.',
  },

  // 汎用
  UNKNOWN_ERROR: {
    ja: '不明なエラーが発生しました。',
    en: 'An unknown error occurred.',
  },
};

export function t(errorCode: string): string {
  const locale = getLocale();

  // API_ERROR_xxx パターンの動的ハンドリング
  if (errorCode.startsWith('API_ERROR_')) {
    const status = errorCode.replace('API_ERROR_', '');
    return locale === 'ja'
      ? `API エラーが発生しました (${status})`
      : `API error occurred (${status})`;
  }

  return ERROR_MESSAGES[errorCode]?.[locale] ?? ERROR_MESSAGES[errorCode]?.en ?? errorCode;
}
