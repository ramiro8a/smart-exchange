import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lc.exchange.app',
  appName: 'LcExchange',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
