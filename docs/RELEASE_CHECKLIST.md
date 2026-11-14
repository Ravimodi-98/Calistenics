# CALISTHENICS COACH — RELEASE CHECKLIST
## Pre-Flight & Production Deployment Verification

**Target Release:** Version 2.0.0 (versionCode 1)  
**Package:** `com.calisthenicscoach.app`  
**Phase:** 8.6 — Final Security Validation & Android Preview Release Readiness  

---

## 1. Codebase & Automation Quality Gates

- [x] **Strict TypeScript Check:** `npm run typecheck` passes with 0 errors.
- [x] **Linting & Code Style:** `npm run lint` passes with 0 warnings and 0 errors.
- [x] **Automated Test Suite:** 30 test suites passed, 206 tests passed (100% pass rate).
- [x] **Web Bundle Export:** `npm run build:web` successfully compiled 32 chunks without asset or bundling errors.
- [x] **Dependencies Audit:** 0 High and 0 Critical vulnerabilities in `npm audit` (25 dev-tool advisories reported).

---

## 2. Security & Data Protection

- [x] **No Leaked Credentials:** Zero service-role keys, master database passwords, or private signing keys exist in Git.
- [x] **Client Token Security:** Auth tokens stored via `expo-secure-store` on Android/iOS.
- [x] **Database Row-Level Security (RLS):** All user tables (`profiles`, `user_preferences`, `workout_sessions`, `user_skill_progress`, `notification_preferences`) have full CRUD RLS policies strictly scoped to `auth.uid() = user_id`.
- [x] **RLS Permissive Policy Drop Remediation:** Migration 8 explicitly drops obsolete `USING (true)` policy from Migration 5 and variants to eliminate PostgreSQL permissive `OR` evaluation leaks (`tests/unit/supabase.rls.policies.test.ts`).
- [x] **Two-User Isolation Integration Test:** Verified in `tests/integration/staging.rls.test.ts` (cross-user data queries strictly blocked).
- [x] **Published Progression Visibility:** Migration 8 prepared ensuring draft skills do not expose progressions (`20261114000008_phase8_4_published_progression_visibility.sql`).
- [x] **Secure Account Deletion:** Server-side Edge Function authored using service-role authorization; client UI double-confirmation dialog implemented; cascading foreign-key deletion active across all user tables.
- [x] **Database Foreign Key Cascade Audit:** Verified in `tests/unit/account.deletion.cascade.test.ts` (all 7 user-related foreign keys specify `ON DELETE CASCADE` with zero orphaned rows).
- [x] **Protected Routes:** `/workout/*` and `/skills/*` guarded against unauthenticated deep-link access.
- [x] **Strict Email Verification:** Routes strictly require `email_confirmed_at` or `confirmed_at`; `last_sign_in_at` bypass completely eliminated.
- [x] **Environment Configuration Safety:** Missing Supabase credentials fail fast with clear, non-leaking errors rather than silent placeholder fallbacks.

---

## 3. Product & Philosophy Alignment

- [x] **No Equipment First Motto:** Hero tagline *"Your body is your equipment"* rendered prominently across the library and dashboard.
- [x] **Zero Equipment Default:** Onboarding and dashboard default to equipment-free training.
- [x] **Pull-up Bar Exclusivity:** Exercises requiring a pull-up bar are never recommended to users without one.
- [x] **Honest Pulling Disclaimers:** Floor pulling movements display honest biomechanical disclosures.
- [x] **Equipment Normalization:** Canonical `pull_up_bar` standardized with legacy compatibility.

---

## 4. Android Configuration & Store Compliance

- [x] **Application ID:** `com.calisthenicscoach.app` verified in `app.config.ts`.
- [x] **Version Information:** `version: "2.0.0"`, `versionCode: 1`.
- [x] **Adaptive Icons:** Foreground, background, and monochrome assets configured.
- [x] **Notification Assets:** Dedicated monochrome icon (`android-icon-monochrome.png`) configured with brand accent color `#8B5CF6`.
- [x] **Permissions Audit:**
  - `RECEIVE_BOOT_COMPLETED` (Notification restore on reboot)
  - `VIBRATE` (Haptics & timer alerts)
  - `POST_NOTIFICATIONS` (Android 13+ notification prompt)
  - `SCHEDULE_EXACT_ALARM`: **EXCLUDED** to prevent Google Play policy rejection.

---

## 5. Visual Identity & Assets

- [x] **Launcher Icon:** 1024x1024 vector brand icon in `assets/images/icon.png`.
- [x] **Splash Screen:** Soft Cascading White `#F6F6F6` with centered brand icon.
- [x] **Lottie Demonstrations:** 20 vector Lottie animations verified under 300 KB total payload.
- [x] **Biomechanical Diagrams:** 18 SVG diagrams for reduced-motion accessibility.
- [x] **Theme Consistency:** Light mode with Lavender `#E0DBF3`, Brand Purple `#8B70D6`, Orange `#F3BA60`.

---

## 6. Physical Device Testing Matrix (15 Areas)

*Verification Status Legend:*  
- **Source-Code:** Implementation and schema inspected.  
- **Automated Test:** Passed automated Jest unit and integration test suites.  
- **APK Build:** Android packaging and web bundle export verified.  
- **Physical-Device:** Hardware test on physical Android device.

| # | Feature Flow / Subsystem | Source-Code | Automated Test | APK Build | Physical-Device |
|---|---|:---:|:---:|:---:|:---:|
| 1 | App Launch & Splash Screen | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 2 | Auth (Sign Up, In, Validation) | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 3 | 8-Step Onboarding Flow | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 4 | "No Equipment First" Rules | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 5 | Dashboard & Dynamic Recs | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 6 | Exercise Library Filtering | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 7 | 2D Animation Vector Playback | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 8 | Accessibility & Reduced Motion | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 9 | Interactive Workout Player | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 10 | Rest Timer & Set Metric Logging | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 11 | Workout Crash Recovery | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 12 | Skill Pathways (8 Skills) | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 13 | Smart Notifications | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 14 | Account Profile & Deletion | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 15 | Network Disconnect Resilience | **YES** | **YES** | Config Verified | Pending Hardware Run |

---

## 7. Sign-Off

- **Lead Engineer:** Antigravity AI Lead Release Engineer
- **Date:** 2026-11-14
- **Release Status:** **SECURITY REMEDIATIONS COMPLETE & QUALITY GATES 100% PASSED — READY FOR USER EAS LOGIN & PREVIEW APK GENERATION**
