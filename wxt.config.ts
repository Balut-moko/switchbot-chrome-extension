import { defineConfig } from 'wxt';

const isMockMode = process.env.MOCK_MODE === 'true';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    define: {
      __MOCK_MODE__: JSON.stringify(isMockMode),
    },
  }),
  manifest: {
    name: '__MSG_appName__',
    version_name: '1.1.0',
    description: '__MSG_appDescription__',
    default_locale: 'en',
    permissions: ['storage', 'alarms'],
    host_permissions: ['https://api.switch-bot.com/*'],
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    action: {
      default_icon: {
        16: 'icon-16.png',
        32: 'icon-32.png',
      },
    },
  },
});
