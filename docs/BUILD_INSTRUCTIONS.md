# CALISTHENICS COACH — BUILD INSTRUCTIONS
## Expo EAS Build & Local Packaging Guide

**Version:** 2.0.0  
**Android Package:** `com.calisthenicscoach.app`  
**Version Code:** 1  

This document details the exact procedures for compiling, testing, and generating production-ready Android artifacts (Preview APK and Production AAB) using Expo EAS Build and local tooling.

---

## 1. Prerequisites & Environment Setup

### Tools Required
- **Node.js:** v18.x, v20.x, or v22.x+ (Recommended: LTS)
- **Expo CLI:** Built-in via `npx expo` (SDK 58)
- **EAS CLI:** `npm install -g eas-cli` (or run on-demand via `npx eas-cli`)
- **Expo Account:** Authenticated via `eas login`

### Required Environment Variables
Ensure the following variables are present in `.env` or injected via EAS Secrets:
```bash
EXPO_PUBLIC_SUPABASE_URL="https://kokhppbpuzzkntvgsctf.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_PyFSa4xUDwR4R2yK28bIDw_uX1HVttZ"
```

> **Security Note:** Never add `SUPABASE_SERVICE_ROLE_KEY` or database passwords to client build environments. Only public client keys are permissible.

---

## 2. Pre-Build Verification

Always execute automated code verification prior to initiating a remote or local build:

```bash
# 1. Typecheck
npm run typecheck

# 2. Linting
npm run lint

# 3. Unit & Integration Tests (206 tests across 30 suites)
npm test

# 4. Web Production Bundle Dry-Run
npm run build:web
```

All 4 steps must exit with status `0` before proceeding to build packaging.

---

## 3. Generating the Android Preview APK (Internal QA)

The **Preview APK** is a standalone, installable package intended for physical device quality assurance, internal tester distribution, and side-loading. It does not require the Expo Go client.

### Command
```bash
npx eas build --platform android --profile preview
```

### Profile Specification (`eas.json`)
```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  },
  "channel": "preview"
}
```

### Output
- EAS Build produces a direct download link and QR code for `calisthenics-coach-preview.apk`.
- Install directly on Android devices via Google Drive, adb (`adb install app-preview.apk`), or USB transfer.

---

## 4. Generating the Signed Android App Bundle (Production AAB)

The **Production AAB** is the final, optimized artifact compiled for submission to the Google Play Console. It is signed with the managed release keystore and utilizes Google Play Dynamic Delivery.

### Command
```bash
npx eas build --platform android --profile production
```

### Profile Specification (`eas.json`)
```json
"production": {
  "autoIncrement": true,
  "android": {
    "buildType": "app-bundle"
  },
  "channel": "production"
}
```

### Keystore Handling
- **Managed Keystore (Default & Recommended):** EAS generates and securely manages the upload keystore within Expo's hardware security module (HSM).
- **Custom Keystore:** If using an existing Google Play upload key, import credentials via `npx eas credentials`.

---

## 5. Google Play Console Submission (Draft / Internal Track)

Once the production AAB is compiled:

```bash
# Submits to Google Play Console internal testing track in DRAFT state
npx eas submit --platform android --profile production
```

### Submission Configuration (`eas.json`)
```json
"submit": {
  "production": {
    "android": {
      "track": "internal",
      "releaseStatus": "draft"
    }
  }
}
```

> **Important:** Submissions default to `draft` status on the `internal` testing track. The build is never published to production tracks without explicit manual rollout in the Google Play Console.

---

## 6. Local Android Compilation (Optional / Advanced)

If compiling locally without cloud EAS credits:

```bash
# 1. Generate native android project
npx expo prebuild --platform android

# 2. Compile Release APK locally
cd android
./gradlew assembleRelease

# 3. Compile Production AAB locally
./gradlew bundleRelease
```
Artifacts will be located at:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 7. Backend & Staging Deployment Instructions (Authorized Releases Only)

### Edge Function Deployment (`delete-account`)
```bash
# Requires Supabase CLI authenticated
npx supabase functions deploy delete-account --project-ref kokhppbpuzzkntvgsctf
```

### Staging / Production Migration Application
```bash
# Review pending migrations
npx supabase migration list

# Apply pending migrations to linked database
npx supabase db push --linked
```
> **Security Guard:** Never execute `supabase db push` against the live production project without explicit authorization. Always verify the linked project ref before deployment.

