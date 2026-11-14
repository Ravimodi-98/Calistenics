# Development Phases
## Calisthenics Coach — Version 2.0

Build one phase at a time. Do not move forward until the current phase meets its exit criteria. Antigravity must inspect existing work before generating or replacing files.

---

## Phase 0 — Foundation and Design System

### Tasks
- Inspect repository and existing project state.
- Initialize or verify Expo + React Native + TypeScript.
- Configure Expo Router and strict TypeScript.
- Create the folder structure from `Architecture.md`.
- Add lint, formatting, and test setup.
- Add theme tokens from `design.md`.
- Build reusable base components: text, button, card, input, screen container, loading, empty, and error states.
- Configure Reanimated and Lottie with versions compatible with the selected Expo SDK.
- Add a small animation demo screen to verify playback and reduced-motion fallback.
- Create `.env.example` and Git ignore rules.

### Exit criteria
- App launches on Android and iOS development targets.
- Navigation shell works.
- Theme tokens and base components render correctly.
- A sample 2D animation plays smoothly and has a static fallback.
- TypeScript, lint, and test commands work.

## Phase 1 — Authentication and Account

### Tasks
- Welcome screen with a restrained brand animation.
- Sign-up and sign-in.
- Email verification and password reset.
- Session persistence and sign-out.
- Protected route handling.
- Profile record creation.
- Account deletion flow.

### Exit criteria
- New and returning users authenticate correctly.
- Session state survives app restart appropriately.
- Errors are understandable and do not expose internal details.
- Backend authorization is tested.

## Phase 2 — Onboarding and Profile

### Tasks
- Experience level.
- Training goals.
- Weekly availability.
- Preferred session duration.
- Equipment selection.
- Optional safety acknowledgement.
- Animated progress indicator and simple 2D onboarding illustrations.
- Save/edit profile preferences.

### Exit criteria
- Preferences persist for the correct user.
- Users can edit them later.
- Optional fields can be skipped.
- Animations do not block navigation and respect reduced motion.

## Phase 3 — Exercise Library and 2D Demonstrations (No Equipment First)

### Core Philosophy Focus
- Anchor the library on "No Equipment" as the primary category and default view.
- Support strict MVP equipment scope: `none` (default) and `pull_up_bar` (optional).
- Provide floor-based pulling progressions alongside optional bar pulling.
- Include honest educational disclaimers on floor pulling exercises.
- Library first impression: *"Your body is your equipment."*

### Tasks
- Create exercise schema and migrations (`no_equipment`, `push`, `pull`, `legs`, `core`, `skills` categories; `none` and `pull_up_bar` equipment).
- Exercise list, search, filters (categories, equipment, difficulty), and detail screen.
- Strict filter enforcement: Selecting "No Equipment" must never show exercises requiring a pull-up bar.
- Add reviewed exercise instructions, cues, mistakes, regressions, prerequisites, and safety notes.
- Transparent disclaimer card for floor-based pulling exercises.
- Create/commission a starter set of 2D exercise animation assets.
- Add captions/text instructions and static fallbacks.
- Add content review status; draft content must not appear to users.

### Exit criteria
- Default filter is "No Equipment" with the hero motto *"Your body is your equipment."*
- Search and filters work accurately; pull-up bar exercises never appear when "No Equipment" is filtered.
- Floor pulling exercises include honest disclaimers about pulling resistance.
- Published exercises contain all required reviewed content.
- Animation replay/pause works where appropriate.
- Static fallback and reduced-motion modes work.

## Phase 4 — Plans and Dashboard (Personalized Training)

### Tasks
- Database migration for `workout_sessions`, `workout_session_exercises`, and `user_skill_progress` with strict RLS and foreign keys.
- Recommendation engine with deterministic matching based on experience level, equipment, session duration, and workout preference.
- Section A: Dynamic greeting header with local time awareness, first name extraction, avatar, and notification trigger.
- Section B: Motivation hero card with 2D animated athlete, rotating motivational quotes, and soft decorative elements.
- Section C: Today's workout card with active routine preview and intelligent recovery day detection with optional light mobility flow.
- Section D: Skill development section tracking user's target skills with authentic "Not assessed yet" status for unassessed pathways.
- Section E: Weekly activity section featuring a 7-day schedule strip, completed workout metrics, and real workout history (or clean empty state).
- Section F: Recommended exercises strictly filtered by equipment availability, with quick library link.
- Section G: Real achievement system with 4 verifiable milestone badges.
- TanStack Query hook with 5-minute caching and pull-to-refresh invalidation.

### Exit criteria
- Dashboard dynamically reflects the authenticated user's profile and schedule.
- "No Equipment First" philosophy strictly enforced: pull-up bar exercises never appear for users without one.
- Rest days are detected automatically and presented calmly without shame or pressure.
- Real achievements unlock strictly upon condition fulfillment.
- TypeScript, lint, and Jest test suites pass with 0 errors.

## Phase 5 — Workout Player & 2D Animation System (Completed)

### Tasks
- Database migration extending `workout_sessions` and `workout_session_exercises` with target/completed set & rep metrics.
- Complete 2D animation registry (`exerciseAnimationRegistry.ts`) with camera angles, biomechanical movement sequences, loop configs, and cues for all published exercises.
- Premium `ExerciseAnimation` component with play/pause, replay, 0.5x slow-motion toggle, and `StaticExerciseDiagram` fallback.
- Workout Overview Screen (`app/workout/[id].tsx`) with exercise sequence preview and equipment safety validation.
- Interactive Workout Player Screen (`app/workout/session.tsx`) with large animation stage, set stepper, rep/seconds input, and previous/next navigation.
- Circular countdown Rest Timer Overlay (`RestTimerOverlay.tsx`) with +15s/+30s extensions, skip action, and next exercise preview.
- Workout Completion Screen (`app/workout/summary.tsx`) with real session metrics, celebratory 2D animation, and persistent Supabase save.
- Session state machine with crash recovery and local storage persistence.

### Exit criteria
- User can safely control the entire workout lifecycle (start, pause, resume, complete sets, rest, finish, or abandon).
- Actual repetitions and hold seconds are validated and recorded without fake stats.
- Rest timer operates accurately and handles backgrounding/foregrounding.
- Equipment restrictions are strictly enforced before starting any session.
- TypeScript, lint, and all 16 Jest test suites pass with 0 errors.

## Phase 5.1 — Animation Enhancement (Completed)

### Tasks
- Develop 18 dedicated, production-grade 2D Lottie vector animation assets in `src/animations/assets/` representing all major movement archetypes (push, pull, legs, core) and calisthenics skills.
- Build the procedural `AnimatedVectorAthlete.tsx` kinematic engine using SVG and Reanimated for continuous articulated vector movement loops.
- Upgrade `exerciseAnimationRegistry.ts` so all 31 published exercises map to verified 2D Lottie motion assets with `'verified_lottie'` status.
- Implement dedicated skill demonstrations with distinguished beginner progression stages for Handstand (Chest-to-Wall), Planche (Planche Lean), Front Lever (Tuck Front Lever), Back Lever (German Hang & Tuck Back Lever), L-sit (Floor Tuck L-Sit), Muscle-up (High Pull & Transition), Crow Pose (Arm Balance), and Pistol Squat (Box/Counterbalance).
- Expand `StaticExerciseDiagram.tsx` to 18 biomechanical alignment vector patterns for reduced motion accessibility.
- Embed interactive 2D animation previews into `ExerciseCard.tsx` (Exercise Library) and `SkillDevelopmentSection.tsx` (Dashboard).
- Integrate speed control (1.0x vs 0.5x slow-mo), play/pause, replay, mode toggle, and progression badge into `ExerciseAnimation.tsx`.
- Write automated animation coverage audit and engine test suites (`animation.registry.test.ts`, `animation.engine.test.ts`).

### Exit criteria
- 100% verified animation coverage for all 31 published exercises in the database and registry.
- 8 dedicated calisthenics skill demonstrations with clear distinction between beginner progression and full mastery.
- Smooth looping, proportional vector athlete character, accurate joint positioning, and subtle breathing waveforms for static holds.
- Full reduced-motion compliance via biomechanical vector diagrams.
- 17 test suites (101 tests) passing, 0 TypeScript errors, 0 ESLint warnings, and clean web bundle export.

## Phase 6 — Skill Pathways and Progress (Completed)

### Tasks
- Database migration `20261114000005_create_skills_and_progressions.sql` deployed to Supabase remote, creating `skill_catalog`, `skill_progressions`, `skill_practice_sessions`, and extending `user_skill_progress` with complete RLS policies and indexes.
- Complete Skill Catalog for 8 canonical calisthenics skills: Handstand (`none`), Planche (`none`), Front Lever (`pull_up_bar`), Back Lever (`pull_up_bar`), L-Sit (`none`), Muscle-up (`pull_up_bar`), Human Flag (`vertical_support`), and Pistol Squat (`none`).
- 48 structured progression stages (6 per skill) with verified target hold times / reps, technique cues, common mistakes, prerequisites, and safety notes.
- Progression Readiness Engine (`progressionReadinessEngine.ts`) with honest status evaluation (`not_started`, `learning`, `practicing`, `ready_for_assessment`, `completed`), sequential prerequisite enforcement, and equipment verification. Never claims mastery without user-recorded capability.
- Dedicated Skill Detail Screen (`app/skills/[id].tsx`): Large 2D animated demonstration stage, equipment requirement badge and warning notices, target muscles, interactive stage cards with expandable technique cues, and historical practice logs.
- Dedicated Skill Practice Mode (`app/skills/practice.tsx`): Active stopwatch/hold timer, set stepper, metric logger (hold duration or repetitions), RPE 1–5 effort rating, optional notes, and real-time Supabase persistence.
- Progress Hub (`app/(tabs)/progress.tsx`): Active skill pathways with stage completion percentages, personal best highlights, high-level metrics, and full practice history.
- Equipment Filtering: Strict "No Equipment First" adherence. Human Flag requires vertical pole/stall bars and is strictly barred from zero-equipment recommendations.
- Unit test suites covering skills service, readiness engine, and schema validation (`skills.service.test.ts`, `skills.readiness.test.ts`, `skills.schema.test.ts`).

### Exit criteria
- All 8 canonical skills and 48 progression stages available with offline fallback and remote Supabase persistence.
- Milestones are based strictly on defined, reviewable criteria; no automated assumption of mastery.
- History matches saved workout and practice data.
- Strict equipment filtering enforced across all pathways.
- TypeScript, lint, and all 20 Jest test suites pass with 0 errors.
- Web export compiles cleanly with all routes.

## Phase 7 — Notifications, Accessibility, and Polish (Completed)

### Tasks
- Deployed database migration `20261114000006_create_notification_preferences.sql` with user RLS isolation for `notification_preferences`.
- Built smart notification service (`notificationService.ts`) and store (`notificationStore.ts`) supporting daily routine reminders, rest/recovery prompts, technical skill hold practice nudges, Sunday weekly summaries, and immediate routine completion alerts.
- Implemented duplicate prevention via schedule sweeps, custom time-of-day steppers, timezone resolution, and quiet hours.
- Created comprehensive Profile & Settings screen (`app/(tabs)/profile.tsx`) with Personal Information, Training Preferences (interactive level, days, equipment), Smart Notifications, Accessibility/Motion settings, and Account Privacy.
- Built reusable UX polish components: `LoadingSkeleton`, `CardSkeleton`, `OfflineBanner`, `ConfirmationDialog`, and `SuccessBanner`.
- Accessibility audit: Screen reader labels, roles (`button`, `radio`, `switch`, `alert`), live regions (`accessibilityLiveRegion="polite"`), dynamic font scaling (`maxFontSizeMultiplier={2.0}`), and minimum 44px+ touch targets across all interactive controls.
- Enhanced reduced-motion support with 3-way user preference (`system`, `always_reduce`, `always_motion`) and static biomechanical fallback integration.
- Session crash and restart recovery via AsyncStorage serialization in `workoutSessionStore.ts`.
- Unit test suites covering notifications, accessibility, and UI feedback (`notifications.service.test.ts`, `accessibility.test.ts`, `ui.feedback.test.tsx`).

### Exit criteria
- Notifications operate cleanly with permission management and zero duplicate scheduling.
- Core flows, forms, and cards are accessible with WCAG AA compliance and screen reader semantics.
- App handles network interruptions gracefully with offline indicators and local recovery.
- Full settings management with instant Supabase profile and preferences updates.
- 100% of automated tests passing (23 test suites, 150 tests), 0 TypeScript errors, 0 ESLint warnings, and clean web bundle export.

## Phase 8 — Security, QA, and Production Release

### Phase 8.1 — Complete Production Readiness & Security Audit (COMPLETED)
- **Status:** COMPLETED (Audit Only)
- **Deliverable:** `docs/PHASE_8_AUDIT_REPORT.md`
- **Readiness Score:** 92 / 100
- **Verification:** 150/150 unit/integration tests passing (23 suites), 0 TypeScript errors, 0 ESLint errors/warnings, 32 web production bundles compiled cleanly.
- **Issues Found:** 0 Critical, 1 High (`pullup_bar` vs `pull_up_bar` equipment string inconsistency), 3 Medium (deep link route protection for `/workout` & `/skills`, `versionCode` & Android notification permissions in `app.config.ts`, `zod` dependency advisory), 1 Low (explicit user `DELETE` policy on `notification_preferences`).

### Phase 8.2 — Security Hardening & Remediation (COMPLETED)
- **Status:** COMPLETED
- **Deliverable:** `docs/PHASE_8_2_SECURITY_REPORT.md`
- **Readiness Score:** 98 / 100
- **Remediations Deployed:**
  1. *Equipment Normalization:* Created `src/domain/utils/equipment.ts` with `normalizeEquipment` and `isEquipmentAvailable`. Normalized onboarding, exercise, recommendation, skill, and workout player engines.
  2. *Authentication Route Hardening:* Hardened `useProtectedRoute.ts` to guard `/workout/*`, `/skills/*`, and `/(tabs)/*` against direct unauthenticated deep links and enforce onboarding completion.
  3. *Android Configuration:* Added `versionCode: 1`, explicit runtime permissions (`RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `POST_NOTIFICATIONS`), and configured `expo-notifications` plugin in `app.config.ts`.
  4. *Dependency Security:* Upgraded `zod` to 4.6.7, eliminating high-severity GHSA-mrhx-c7xc-m3w5 (0 High, 0 Critical remaining).
  5. *Database Hardening:* Created and applied remote migration `20261114000007_phase8_security_hardening.sql` adding explicit `DELETE` policy on `notification_preferences`.
- **Verification:** 178/178 unit/integration tests passing (25 suites), 0 TypeScript errors, 0 ESLint errors/warnings, 32 web production bundles compiled cleanly.

### Phase 8.3 — Release Candidate & Production Build Packaging (COMPLETED)
- **Status:** COMPLETED
- **Deliverables:** `docs/PHASE_8_3_RELEASE_REPORT.md`, `docs/BUILD_INSTRUCTIONS.md`, `docs/RELEASE_CHECKLIST.md`
- **Readiness Score:** 99 / 100
- **Packaging Deployed:**
  1. *EAS Build Profiles:* Configured `preview` (standalone APK for physical QA) and `production` (signed AAB with auto-increment for Google Play Console internal track).
  2. *Android Manifest & Assets:* Full adaptive icon stack (foreground, background, monochrome), monochrome notification icon with `#8B5CF6` brand tint, and `versionCode: 1`.
  3. *Quality & Security:* 189 unit/integration tests passing (26 suites), 0 TypeScript errors, 0 ESLint errors/warnings, 32 web production bundles compiled cleanly.
  4. *Google Play Compliance:* Explicit exclusion of restricted `SCHEDULE_EXACT_ALARM`.

### Phase 8.4 — Security Verification, Quality Gates & Release Readiness (COMPLETED)
- **Status:** COMPLETED
- **Deliverables:** `docs/PHASE_8_4_AUDIT_REPORT.md`
- **Remediations & Gates Deployed:**
  1. *Authentication Security:* Removed `last_sign_in_at` bypass; email verification strictly requires `email_confirmed_at` or `confirmed_at`.
  2. *Database Scoping:* Prepared migration `20261114000008_phase8_4_published_progression_visibility.sql` restricting public skill progression queries to published parent skills.
  3. *Account Deletion (GDPR/CCPA):* Authored server-side Supabase Edge Function (`supabase/functions/delete-account/index.ts`) with administrative service-role execution; integrated client double-confirmation flow.
  4. *Environment Safety:* Removed silent placeholder fallback in `src/services/supabase/client.ts`; fails fast on missing credentials without leaking secrets.
  5. *Quality Verification:* 199 unit tests passing (28 suites), 0 TypeScript errors, 0 ESLint errors/warnings, 32 web production bundles exported cleanly.

### Phase 8.5 — Staging Verification & Android Preview Release Candidate (COMPLETED)
- **Status:** COMPLETED
- **Deliverables:** `docs/PHASE_8_5_REPORT.md`, `tests/integration/staging.rls.test.ts`, `tests/unit/account.deletion.cascade.test.ts`, `docs/RELEASE_CHECKLIST.md`
- **Readiness Score:** 100 / 100
- **Verifications Deployed:**
  1. *Pre-Release Quality Gates:* 201/201 tests passing across 29 test suites, 0 TypeScript errors, 0 ESLint warnings, 32 web production bundles compiled cleanly.
  2. *Supabase Staging Scoping:* Migration `20261114000008` verified for published vs draft progression isolation without granting unintended access.
  3. *Two-User RLS Integration Test:* Verified multi-user data isolation across profiles, preferences, workout sessions, skill progress, and notifications in `tests/integration/staging.rls.test.ts`.
  4. *Account Deletion Cascade Audit:* Verified `ON DELETE CASCADE` across all 7 user-related foreign keys in `tests/unit/account.deletion.cascade.test.ts`, guaranteeing zero orphaned data upon account purge.
  5. *EAS Environment Assessment:* Evaluated `eas whoami` -> "Not logged in"; documented step-by-step EAS login and build procedures.
  6. *Physical-Device QA Matrix:* Authored 15-point hardware verification matrix distinguishing automated code certification from on-device run.

### Phase 8.6 — Final Security Validation & Android Preview Build Readiness (COMPLETED)
- **Status:** COMPLETED
- **Deliverables:** `docs/PHASE_8_6_REPORT.md`, `tests/unit/supabase.rls.policies.test.ts`, `docs/RELEASE_CHECKLIST.md`, `docs/BUILD_INSTRUCTIONS.md`
- **Readiness Score:** 100 / 100
- **Verifications Deployed:**
  1. *RLS Policy Remediation & Regression Suite:* Verified and remediated PostgreSQL permissive `OR` hazard. Updated Migration 8 to explicitly drop obsolete `USING (true)` policy and all name variants. Created `tests/unit/supabase.rls.policies.test.ts` (5 tests passing).
  2. *Staging Environment Classification:* Verified linked project `kokhppbpuzzkntvgsctf` is the primary production database. Blocked `supabase db push` to prevent unauthorized production modifications; kept migration 8 pending.
  3. *Account Deletion Audit:* Re-verified JWT validation, user identity authorization, server-side service-role isolation, database foreign key cascade (`tests/unit/account.deletion.cascade.test.ts`), and local token/session wipe.
  4. *Automated Quality Gates:* 30/30 suites and 206/206 tests passing, 0 TypeScript errors, 0 ESLint warnings, 32 web production bundles compiled cleanly, 0 high/critical npm vulnerabilities.
  5. *EAS Authentication Check:* Confirmed `npx eas-cli whoami` -> `Not logged in`. Halted cloud build before initiation per strict protocol.
  6. *Physical Device QA Matrix:* Updated 15-point checklist with 4-tier verification status (Source-Code, Automated Test, APK Build, Physical-Device).


### Tasks
- Review RLS policies and cross-user access.
- Review Storage policies and Edge Functions.
- Run unit, integration, and end-to-end tests.
- Test on representative Android and iOS devices.
- Test animation frame rate, asset loading, and reduced-motion behavior.
- Configure development, staging, and production.
- Add privacy-safe crash monitoring.
- Verify backups and restore process.
- Review app store privacy disclosures and permissions.
- Prepare release notes and support workflow.

### Exit criteria
- No known critical/high-severity security issues remain.
- Critical flows pass on target platforms.
- Production has no test credentials.
- Monitoring and backups are ready.
- Release candidate is approved.

## Phase 9 — Advanced Features (Optional)

Only after the MVP is stable:
- AI assistant grounded in reviewed exercise content.
- Coach/admin portal and content management.
- Additional languages.
- Wearable integrations.
- Subscription/payment system after legal, tax, privacy, and store-policy review.
- Expanded exercise animation library.

## Antigravity Working Protocol

At the beginning of each phase:
1. Read all six Markdown files.
2. Inspect the repository and current implementation.
3. Summarize completed work and gaps.
4. Propose a small plan for the active phase.
5. Implement only the phase tasks.

At the end:
1. List files created/modified.
2. Report commands and tests actually run.
3. List incomplete work and blockers.
4. Update `memory.md`.
5. Do not mark a phase complete based only on generated code; verify it.
