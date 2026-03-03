import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'SwitchBot Controller (Unofficial)',
    version_name: '0.3.0-beta',
    description: 'Control your SwitchBot devices from the browser toolbar',
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
