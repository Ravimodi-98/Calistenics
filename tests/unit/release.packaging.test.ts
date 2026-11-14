declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Phase 8.3 — Release Candidate & Production Packaging Audit', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const appConfigPath = path.join(rootDir, 'app.config.ts');
  const easJsonPath = path.join(rootDir, 'eas.json');
  const packageJsonPath = path.join(rootDir, 'package.json');

  let appConfigRaw: string;
  let easJson: any;
  let packageJson: any;

  beforeAll(() => {
    appConfigRaw = fs.readFileSync(appConfigPath, 'utf8');
    easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  });

  describe('Android Application Configuration (app.config.ts)', () => {
    test('defines correct application identifier and version', () => {
      expect(appConfigRaw).toContain("package: 'com.calisthenicscoach.app'");
      expect(appConfigRaw).toContain("version: '2.0.0'");
      expect(appConfigRaw).toContain("versionCode: 1");
    });

    test('specifies full adaptive icon assets with monochrome support', () => {
      expect(appConfigRaw).toContain("foregroundImage: './assets/images/android-icon-foreground.png'");
      expect(appConfigRaw).toContain("backgroundImage: './assets/images/android-icon-background.png'");
      expect(appConfigRaw).toContain("monochromeImage: './assets/images/android-icon-monochrome.png'");
      expect(appConfigRaw).toContain("backgroundColor: '#E0DBF3'");
    });

    test('declares necessary runtime permissions and strictly excludes SCHEDULE_EXACT_ALARM', () => {
      expect(appConfigRaw).toContain("'RECEIVE_BOOT_COMPLETED'");
      expect(appConfigRaw).toContain("'VIBRATE'");
      expect(appConfigRaw).toContain("'POST_NOTIFICATIONS'");
      expect(appConfigRaw).not.toContain('SCHEDULE_EXACT_ALARM');
    });

    test('configures expo-notifications plugin with status bar monochrome icon and brand tint', () => {
      expect(appConfigRaw).toContain("'expo-notifications'");
      expect(appConfigRaw).toContain("icon: './assets/images/android-icon-monochrome.png'");
      expect(appConfigRaw).toContain("color: '#8B5CF6'");
    });
  });

  describe('EAS Build Profiles (eas.json)', () => {
    test('preview profile is configured to generate standalone APK for physical device QA', () => {
      expect(easJson.build.preview).toBeDefined();
      expect(easJson.build.preview.distribution).toBe('internal');
      expect(easJson.build.preview.android.buildType).toBe('apk');
    });

    test('production profile is configured to generate signed AAB for Google Play Store', () => {
      expect(easJson.build.production).toBeDefined();
      expect(easJson.build.production.autoIncrement).toBe(true);
      expect(easJson.build.production.android.buildType).toBe('app-bundle');
    });

    test('development profile is configured for internal testing client', () => {
      expect(easJson.build.development).toBeDefined();
      expect(easJson.build.development.developmentClient).toBe(true);
    });

    test('submit profile defines draft status on internal track', () => {
      expect(easJson.submit.production.android.releaseStatus).toBe('draft');
      expect(easJson.submit.production.android.track).toBe('internal');
    });
  });

  describe('Security and Credential Verification', () => {
    test('package.json contains release packaging scripts', () => {
      expect(packageJson.scripts['build:web']).toBeDefined();
      expect(packageJson.scripts['build:android:preview']).toBeDefined();
      expect(packageJson.scripts['build:android:production']).toBeDefined();
    });

    test('no private credentials or service role keys exist in configuration files', () => {
      expect(appConfigRaw).not.toContain('service_role');
      expect(appConfigRaw).not.toContain('SUPABASE_SERVICE_ROLE');
      expect(JSON.stringify(easJson)).not.toContain('service_role');
    });

    test('referenced asset files exist on disk', () => {
      const assets = [
        'assets/images/icon.png',
        'assets/images/android-icon-foreground.png',
        'assets/images/android-icon-background.png',
        'assets/images/android-icon-monochrome.png',
        'assets/images/splash-icon.png',
        'assets/images/favicon.png',
      ];

      for (const asset of assets) {
        expect(fs.existsSync(path.join(rootDir, asset))).toBe(true);
      }
    });
  });
});
