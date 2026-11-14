# Application Architecture
## Calisthenics Coach — Version 2.0

---

## 1. Recommended Technology Stack

### Mobile
- React Native + Expo.
- TypeScript with strict mode.
- Expo Router for navigation.
- React Native StyleSheet and centralized design tokens.
- React Native Reanimated for performant UI/micro-interactions.
- Lottie for lightweight 2D vector animation playback; Rive may be evaluated for interactive vector scenes. Choose one primary asset workflow for MVP rather than adding both without need.
- TanStack Query for server state and caching.
- Zustand for limited transient client state.
- React Hook Form + Zod for forms and validation.
- Expo SecureStore for appropriate secure local storage.
- Expo Notifications for opt-in reminders.

### Backend
- Supabase Auth.
- PostgreSQL with Row Level Security.
- Supabase Storage for approved exercise media.
- Supabase Edge Functions for trusted server operations and future AI gateway.

### Quality and delivery
- ESLint + Prettier.
- Jest or Vitest where compatible with the Expo setup.
- React Native Testing Library.
- Maestro for end-to-end tests.
- GitHub Actions for CI.
- Expo EAS Build/Submit.
- Sentry or an equivalent approved crash/error monitoring service, configured to avoid sensitive data.

Check package compatibility against the selected Expo SDK before installation. Do not install packages simply because they are popular.

## 2. High-Level Architecture

```text
┌─────────────────────────────────────────────────────┐
│                  React Native App                   │
│                                                     │
│ Expo Router → Feature Screens → Domain / Services   │
│       │              │                              │
│       │        Reanimated + Lottie                  │
│       │        Design System / Tokens               │
│       └──── TanStack Query / Zustand ───────────┐   │
└─────────────────────────────────────────────────┼───┘
                                                  │ HTTPS
                                                  ▼
┌─────────────────────────────────────────────────────┐
│                    Supabase                         │
│ Auth │ PostgreSQL + RLS │ Storage │ Edge Functions  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
              Optional AI provider (later)
              Accessed server-side only
```

The mobile app is untrusted. Authorization and critical validation must be enforced by the backend and database, not just by hiding UI controls.

## 3. Main App Flow

### Launch
1. Show a short, skippable brand animation.
2. Restore authentication session.
3. Route to Welcome/Auth, Onboarding, or main tabs based on verified state.

### Main navigation
- Home
- Plan
- Library
- Progress
- Profile

### Workout flow
1. Dashboard → session overview.
2. Review warm-up, exercise list, and alternatives.
3. Open workout player.
4. View/replay 2D exercise animation and technique cues.
5. Log sets/reps/holds and use rest timer.
6. Pause, resume, skip, or stop.
7. Submit session with duplicate-write protection.
8. Refresh dashboard and history.

## 4. Folder and File Structure

```text
calisthenics-coach/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   ├── experience.tsx
│   │   ├── goals.tsx
│   │   ├── schedule.tsx
│   │   └── equipment.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── plan.tsx
│       ├── library.tsx
│       ├── progress.tsx
│       └── profile.tsx
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── cards/
│   │   ├── feedback/
│   │   └── layout/
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── exercises/
│   │   ├── plans/
│   │   ├── workouts/
│   │   ├── skills/
│   │   ├── progress/
│   │   ├── notifications/
│   │   └── profile/
│   ├── domain/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── rules/
│   ├── services/
│   │   ├── supabase/
│   │   ├── analytics/
│   │   └── monitoring/
│   ├── animations/
│   │   ├── components/
│   │   ├── assets/
│   │   └── animationConfig.ts
│   ├── hooks/
│   ├── store/
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── utils/
│   └── constants/
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── illustrations/
│   └── exercise-animations/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── .env.example
├── app.config.ts
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

Keep route files thin. Business rules belong in domain/feature modules, not in screen components.

## 5. Initial Data Model

Use UUID primary keys, timestamps, foreign keys, and indexes. Refine exact columns through migrations.

### Core Philosophy Architecture Rule: No Equipment First
The data model enforces bodyweight training with minimal equipment:
- Exercise categories: `no_equipment` (primary/default), `push`, `pull`, `legs`, `core`, `skills`.
- Equipment required: `none` (default), `pull_up_bar` (optional).
- Floor pulling exercises contain dedicated `disclaimer` content clarifying that floor pulling does not match resisted vertical hanging pull-ups.

### profiles
- id (references auth user)
- display_name
- experience_level (`beginner`, `intermediate`, `advanced`)
- goals (text[])
- available_days (text[])
- preferred_session_minutes (integer)
- equipment (text[]: restricted to `none`, `pullup_bar` for MVP)
- onboarding_completed (boolean)
- created_at, updated_at

### exercises
- id (UUID primary key)
- slug (text unique)
- name (text not null)
- description (text)
- category (text check: `no_equipment`, `push`, `pull`, `legs`, `core`, `skills`)
- equipment_required (text check: `none`, `pull_up_bar` default `none`)
- difficulty (text check: `beginner`, `intermediate`, `advanced`)
- primary_muscles (text[])
- secondary_muscles (text[])
- instructions (jsonb: structured setup, execution, cues, mistakes)
- prerequisites (text[])
- progression_exercises (text[])
- regressions (text[])
- safety_notes (text)
- disclaimer (text: transparent pulling note if floor-based)
- animation_asset_path (text)
- animation_format (text default 'lottie_json')
- content_status (text check: `draft`, `reviewed`, `published`)
- created_at, updated_at

### training_plans
- id, title, description, level, goal
- duration_weeks, published_status

### plan_sessions
- id, plan_id, week_number, day_number, title, session_order

### session_exercises
- id, plan_session_id, exercise_id, order_index
- sets, target_reps, target_hold_seconds, rest_seconds
- alternative_exercise_id

### user_plan_assignments
- id, user_id, plan_id, start_date, status

### workout_sessions (Phase 4 & 5 deployed)
- id (UUID primary key)
- user_id (UUID references auth.users)
- workout_name (text not null)
- category (text check: `no_equipment`, `push`, `pull`, `legs`, `core`, `skills`, `full_body`)
- status (text check: `in_progress`, `completed`, `abandoned`)
- started_at (timestamptz not null)
- completed_at (timestamptz nullable)
- duration_seconds (integer not null default 0)
- total_sets_completed (integer not null default 0)
- total_reps_completed (integer not null default 0)
- created_at (timestamptz)
- RLS: User ownership isolation (`auth.uid() = user_id`)

### workout_session_exercises (Phase 4 & 5 deployed)
- id (UUID primary key)
- session_id (UUID references workout_sessions)
- exercise_id (UUID references exercises)
- target_sets (integer not null default 3)
- target_reps (integer not null default 10)
- sets_completed (integer not null default 0)
- reps_completed (integer not null default 0)
- hold_seconds_completed (integer not null default 0)
- order_index (integer not null default 0)
- created_at (timestamptz)
- RLS: Scoped via session ownership (`ws.user_id = auth.uid()`)

### skill_catalog (Phase 6 deployed)
- id (UUID primary key)
- slug (text unique, e.g. `handstand`, `human-flag`)
- name (text not null)
- description (text not null)
- difficulty (text check: `beginner`, `intermediate`, `advanced`, `elite`)
- equipment_required (text check: `none`, `pull_up_bar`, `vertical_support`)
- primary_muscles (text[])
- secondary_muscles (text[])
- prerequisites (text[])
- safety_notes (text nullable)
- animation_asset (text not null)
- content_status (text check: `draft`, `reviewed`, `published` default `published`)
- created_at (timestamptz)
- RLS: Public read-only for published skills (`content_status = 'published'`).

### skill_progressions (Phase 6 deployed)
- id (UUID primary key)
- skill_id (UUID references skill_catalog)
- skill_slug (text not null)
- stage_order (integer check 1 to 6)
- stage_slug (text not null)
- stage_name (text not null)
- description (text not null)
- target_type (text check: `hold_seconds`, `repetitions`)
- target_value (integer not null)
- prerequisites (text[])
- technique_cues (text[])
- safety_notes (text nullable)
- animation_asset (text not null)
- assessment_criteria (text not null)
- created_at (timestamptz)
- Unique constraint: `(skill_slug, stage_order)`
- RLS: Public read-only for authenticated users.

### skill_practice_sessions (Phase 6 deployed)
- id (UUID primary key)
- user_id (UUID references auth.users)
- skill_id (UUID references skill_catalog nullable)
- skill_slug (text not null)
- progression_id (UUID references skill_progressions nullable)
- stage_slug (text not null)
- duration_seconds (integer not null default 0)
- completed_sets (integer not null default 1)
- recorded_hold_seconds (integer not null default 0)
- recorded_reps (integer not null default 0)
- effort_rating (integer check 1 to 5 nullable)
- notes (text nullable)
- created_at (timestamptz default now())
- RLS: User ownership isolation (`auth.uid() = user_id`) for SELECT and INSERT.

### user_skill_progress (Phase 4 & Phase 6 extended)
- id (UUID primary key)
- user_id (UUID references auth.users)
- skill_slug (text not null)
- skill_name (text not null)
- skill_id (UUID references skill_catalog nullable)
- current_stage_id (UUID references skill_progressions nullable)
- current_stage_order (integer default 1)
- progression_level (text not null)
- assessment_status (text check: `not_started`, `learning`, `practicing`, `ready_for_assessment`, `completed`, `not_assessed`, `proficient`, `mastered`)
- best_hold_seconds (integer default 0)
- best_reps (integer default 0)
- last_practiced_at (timestamptz nullable)
- notes (text nullable)
- updated_at (timestamptz)
- RLS: User ownership isolation (`auth.uid() = user_id`) for SELECT, INSERT, UPDATE.

### notification_preferences (Phase 7 deployed)
- id (UUID primary key)
- user_id (UUID references auth.users UNIQUE)
- workout_reminders (boolean default true)
- skill_reminders (boolean default true)
- rest_day_reminders (boolean default true)
- weekly_summaries (boolean default true)
- workout_completion_enabled (boolean default true)
- reminder_hour (integer check 0-23 default 8)
- reminder_minute (integer check 0-59 default 0)
- quiet_hours_enabled (boolean default false)
- quiet_hours_start (text default '22:00')
- quiet_hours_end (text default '07:00')
- push_token (text nullable)
- device_timezone (text not null default 'UTC')
- created_at, updated_at (timestamptz)
- RLS: User ownership isolation (`auth.uid() = user_id`) for SELECT, INSERT, UPDATE.

RLS must restrict all user-owned records. Published exercise and plan content is read-only to ordinary users.

## 6. State Management

- TanStack Query owns remote/server state.
- Zustand is for transient UI state only, such as timer state, in-progress player session, accessibility preferences, or notification settings.
- Avoid duplicating server records in Zustand.
- Validate API responses and user input at trust boundaries.
- Use idempotency or stable identifiers to prevent duplicate workout writes.
- Define offline behavior explicitly; do not imply a write succeeded until it is safely saved.

## 7. Animation Architecture (Phase 5.1 Enhancement)

### Animation categories
1. **Exercise demonstrations:** 2D Lottie vector assets (`src/animations/assets/*.json`) and procedural articulated engine (`AnimatedVectorAthlete.tsx`); referenced via `exerciseAnimationRegistry.ts`.
2. **Static biomechanical diagrams:** 18 dedicated SVG vector alignment diagrams (`StaticExerciseDiagram.tsx`) for reduced-motion accessibility.
3. **UI motion:** Reanimated 4 for transitions, card movement, progress indicators, and touch feedback.
4. **Decorative illustrations:** Lottie/vector assets for onboarding, dashboard, and celebration states.

### Implementation rules
- Prefer vector-based 2D assets adhering to the Brand Purple (`#8B70D6`) / Lavender (`#E0DBF3`) / Deep Purple (`#6E55B8`) / Orange (`#F3BA60`) design system.
- Exercise animations must have clear start/end positions, seamless loop configurations, and controllable speed toggles (1.0x vs 0.5x slow-mo), play/pause, and replay actions.
- Static hold exercises must incorporate subtle diaphragmatic breathing waveforms (±2.5px sinusoidal variation) rather than frozen states.
- Skill demonstrations must explicitly differentiate foundational beginner progressions (e.g. Chest-to-Wall Handstand, Planche Lean, Tuck Front Lever) from complete skill mastery.
- Static fallback diagrams are automatically loaded when reduced-motion is enabled or assets fail to load.
- 100% of published exercises (31/31) and target skills (8/8) must resolve to verified animation assets.

## 8. Notifications & Accessibility Architecture (Phase 7 Implemented)

### Notification Services & Persistence
- **Service Layer (`notificationService.ts`):** Wraps `expo-notifications`, handles permission requesting, timezone resolution, and weekly scheduling with duplicate prevention via pre-clear sweeps.
- **State Store (`notificationStore.ts`):** Zustand store providing reactive toggles and time adjustments with two-way syncing across AsyncStorage and Supabase `public.notification_preferences`.
- **Scheduled Categories:** Training-day routine prompts, recovery/mobility day reminders, mid-week skill hold practice prompts, Sunday weekly progress reviews, and immediate routine completion banners.

### Accessibility & Feedback Architecture
- **Accessibility Store (`accessibilityPreferencesStore.ts`):** Dual-layer motion control supporting system OS setting and explicit in-app overrides (`system` | `always_reduce` | `always_motion`), plus haptics preference.
- **Feedback Components:** Reusable `LoadingSkeleton`, `CardSkeleton`, `OfflineBanner`, `ConfirmationDialog`, and `SuccessBanner` with WCAG AA compliant contrast and 44px+ minimum touch targets.
- **Crash & Interruption Recovery:** Workout player and skill practice sessions serialize to AsyncStorage, enabling seamless resume upon reload.

## 9. Environment and Deployment

Use separate development, staging, and production configurations where practical. Maintain `.env.example` with names only, such as:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Only client-safe values may use the Expo public prefix. Never put service-role keys, AI provider secrets, or privileged credentials in the mobile app.

Use migrations for schema changes. Back up production data and test restore procedures.

## 9. Architecture Principles

- Feature-based modularity.
- Strong typing and runtime validation.
- Backend-enforced authorization.
- Reusable UI and design tokens.
- Animation assets separated from business logic.
- Privacy-safe monitoring.
- Avoid premature microservices; a well-structured Supabase backend is sufficient for MVP.

## 10. Security & Hardening Architecture (Phase 8.2 Implemented)

### Equipment Normalization Layer
- **Centralized Helper (`src/domain/utils/equipment.ts`):** Establishes canonical `'pull_up_bar'` while seamlessly accepting legacy `'pullup_bar'`.
- **Availability Engine:** `isEquipmentAvailable(userEquipment, requiredEquipment)` guarantees that zero-equipment users are never shown pull-up bar exercises or skills in recommendations or workouts, preserving the **No Equipment First** philosophy.

### Route Guard Architecture
- **Root Route Hardening (`src/features/auth/hooks/useProtectedRoute.ts`):** Evaluates `rootSegment` to intercept unauthenticated attempts to access `/workout/*`, `/skills/*`, and `/(tabs)/*` via direct deep link or cold app starts, cleanly redirecting unauthenticated users to `/(auth)/welcome` and users with incomplete onboarding to `/(onboarding)/welcome`.

### Database Security
- **Migration 7 (`20261114000007_phase8_security_hardening.sql`):** Adds explicit `DELETE` policy on `public.notification_preferences` with `auth.uid() = user_id`, completing the full CRUD RLS policy suite across all user tables.

### Android Production Configuration
- **Packaging:** `app.config.ts` declares explicit `android.versionCode: 1`, package `com.calisthenicscoach.app`, and compliant permissions (`RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `POST_NOTIFICATIONS`).
- **Policy Compliance:** Deliberately excludes restricted `SCHEDULE_EXACT_ALARM` to ensure compliance with Google Play Store guidelines.

### Dependency Security
- Upgraded `zod` to 4.6.7, eliminating high-severity GHSA-mrhx-c7xc-m3w5 advisory while maintaining 100% compatibility with `@hookform/resolvers`, React Native, and Expo SDK 58.

## 11. Release Candidate & Packaging Architecture (Phase 8.3 Implemented)

### EAS Build Strategy
- **Preview Profile (`preview`):** Configured with `android.buildType: "apk"` and `distribution: "internal"` to compile standalone, non-dev-client APKs for physical device QA.
- **Production Profile (`production`):** Configured with `android.buildType: "app-bundle"` and `autoIncrement: true` for optimized Google Play Store distribution.
- **Submit Profile:** Configured for internal test track submission in `draft` mode.

### Native Android Asset Architecture
- **Adaptive Icon Stack:** Separated into `foregroundImage`, `backgroundImage`, `monochromeImage` (for Android 13+ themed icons), and `#E0DBF3` background color.
- **Status Bar Notification Icon:** Dedicated monochrome alpha asset (`android-icon-monochrome.png`) preventing Android's white-box rendering issue.
- **Packaging Scripts:** Standardized in `package.json` (`npm run build:android:preview`, `npm run build:android:production`, `npm run build:web`).
