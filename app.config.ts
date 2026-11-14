import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Calisthenics Coach',
  slug: 'calisthenics-coach',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'calisthenicscoach',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.calisthenicscoach.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
      backgroundColor: '#E0DBF3',
    },
    package: 'com.calisthenicscoach.app',
    versionCode: 1,
    permissions: [
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
      'POST_NOTIFICATIONS',
    ],
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/images/android-icon-monochrome.png',
        color: '#8B5CF6',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F6F6F6',
        image: './assets/images/splash-icon.png',
        imageWidth: 100,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
