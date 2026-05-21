import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diacares.app',
  appName: 'DiaCares',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#dc2626',
      overlaysWebView: true  // ← UBAH KE true!
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#dc2626',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;