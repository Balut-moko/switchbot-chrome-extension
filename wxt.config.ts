import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'SwitchBot Controller (Unofficial)',
    description: 'Control your SwitchBot devices from the browser toolbar',
    permissions: ['storage'],
    host_permissions: ['https://api.switch-bot.com/*'],
  },
});
