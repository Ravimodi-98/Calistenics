# Product Requirements Document (PRD)
## Calisthenics Coach — Version 2.0
**Status:** Product specification  
**Platform:** Android and iOS  
**Product direction:** Friendly, creative, light-mode fitness coaching with expressive 2D motion

---

## 1. Product Vision

Build a production-ready calisthenics coaching app that makes bodyweight training easier to understand, plan, practise, and track. The app should feel like a supportive personal coach: welcoming for beginners, useful for intermediate users, and structured enough to support long-term skill development.

### Core Philosophy: No Equipment First
The primary focus of Calisthenics Coach is bodyweight training for people who do not own fitness equipment. This is a fundamental product requirement, not an optional feature:
- **No Equipment is the primary exercise category** and the default exercise library filter.
- **Bodyweight exercises without equipment are prioritized** across all workout recommendations.
- **Equipment Restrictions for Core MVP:** Strictly support `none` (No Equipment, default) and `pull_up_bar` (Pull-up Bar, optional). Dumbbells, resistance bands, gymnastic rings, weight machines, or gym memberships are excluded from the core MVP system.
- **Pull Workout Transparency:** Pull workouts support two distinct configurations:
  1. *Bodyweight without equipment:* Floor-based posterior-chain, shoulder, and scapular control exercises (Prone Cobra, Y-T-W raises, Prone Scapular Retractions, Reverse Plank Bridge). Floor-based pulling exercises must clearly and transparently state that while they build scapular control and posterior strength, they do not provide the same vertical pulling resistance as hanging from a bar. They are never falsely labeled as 1:1 replacements for pull-ups.
  2. *Bodyweight with pull-up bar (optional):* Dead hangs, scapular pull-ups, negative chin-ups/pull-ups, and full pull-ups. The pull-up bar remains strictly optional.
- **Library First Impression:** The Exercise Library immediately communicates: *"Your body is your equipment."*

The visual identity is inspired by the supplied fitness-app reference: a clean light interface, lavender surfaces, purple primary actions, warm orange highlights, rounded cards, simple illustrations, and a calm editorial layout. The app must include polished, smooth 2D animations that explain movement and make navigation feel alive without distracting from training.

## 2. Problem to Solve

People learning calisthenics often do not know:
- Which movement variation is appropriate for their current ability.
- How to perform an exercise with controlled technique.
- How to organize practice, rest, and recovery.
- How to measure progress beyond appearance.
- What progression to practise next.

Calisthenics Coach provides guided plans, an exercise library, skill pathways, workout logging, and clear progress feedback.

## 3. Target Users

### Primary
- Beginners learning foundational bodyweight movements.
- Intermediate users building strength and developing skills.
- People training at home, outdoors, or in a gym.
- People with limited or varied equipment.

### Secondary (future)
- Qualified coaches who create or review plans.
- Content administrators who maintain the exercise library.

The product is not a medical, rehabilitation, or emergency service. Use conservative defaults and age-appropriate language. Do not make appearance, weight, or body measurements the main definition of progress.

## 4. Product Goals

1. Help users start a suitable, understandable training plan.
2. Teach exercise setup, movement, and technique with reviewed content and 2D demonstrations.
3. Make workout sessions simple to follow and log.
4. Show meaningful progress through training consistency and skill milestones.
5. Encourage rest, recovery, and gradual progression.
6. Deliver a polished, accessible, secure, reliable mobile app.

## 5. Core User Journey

1. User opens the app and sees a short branded intro animation.
2. User signs in or creates an account.
3. User completes onboarding: experience, goals, schedule, session duration, and equipment.
4. Dashboard presents today's session or a recovery day.
5. User opens a workout and reviews its exercises and alternatives.
6. Workout player guides the session with clear 2D exercise demonstrations, set logging, and rest timer.
7. User completes a short optional session check-in.
8. Progress and skill milestones update from saved workout data.

## 6. Functional Requirements

### 6.1 Authentication and Account
- Email/password registration and sign-in.
- Email verification and password reset.
- Secure session persistence and sign-out.
- Profile editing and account deletion.
- Social sign-in can be considered later.
- Never store raw passwords in application tables.

### 6.2 Onboarding
- Experience: beginner, intermediate, advanced (self-selected).
- Goals: foundational strength, push-up progression, pull-up progression, core strength, handstand foundations, planche foundations, front lever foundations, mobility, or general calisthenics.
- Weekly availability and preferred session duration.
- Equipment (Core MVP restricted): `none` (No Equipment, default) and `pull_up_bar` (Pull-up Bar, optional). No weights, bands, or gym access required.
- Optional safety/limitation acknowledgement with clear privacy explanation.
- Allow users to skip non-essential questions and edit preferences later.

### 6.3 Home Dashboard & Personalized Training (Phase 4)
- **Section A — Greeting Header:** Dynamic time-based greeting ("Good Morning / Afternoon / Evening, [First Name]"), notification icon, and profile avatar initials.
- **Section B — Motivation Hero Card:** Lavender card with 2D animated athlete, rotating motivational quotes, soft decorative background shapes, and *"Your Body Is Your Equipment"* ethos.
- **Section C — Today's Workout Card:** Deterministic personalization using onboarding data (experience level, equipment, session duration, and workout preference). Automatically detects rest days with "Today is your recovery day" and optional gentle mobility flow.
- **Section D — Skill Development:** Progress tracking for user target skills (Handstand, Planche, Front Lever, L-Sit, etc.) with honest "Not assessed yet" status for new users without fake progress percentages.
- **Section E — Weekly Activity:** 7-day schedule strip displaying planned training days vs completed workouts. Empty state for new users (*"Your journey starts with your first workout."*) without fabricated historical data.
- **Section F — Recommended Exercises:** Strict equipment-aware exercise recommendations prioritizing No Equipment bodyweight movements, with a quick navigation link to the Exercise Library.
- **Section G — Achievements:** Unlocks strictly when real conditions are met (First Workout, Weekly Target Met, Consistency Milestone, Skill Milestone). No fake badges.

### 6.4 Exercise Library
The Exercise Library embodies the core philosophy: *"Your body is your equipment."*

**Categories (in prioritized order):**
1. **No Equipment** (primary category, default filter)
2. **Push**
3. **Pull**
4. **Legs**
5. **Core**
6. **Skills**

**Equipment Options:**
- `none` (No Equipment, default)
- `pull_up_bar` (Pull-up Bar, optional)

**Filtering Rules:**
- Users can filter by Equipment (`none`, `pull_up_bar`), Difficulty (`beginner`, `intermediate`, `advanced`), and Categories (`no_equipment`, `push`, `pull`, `legs`, `core`, `skills`).
- When "No Equipment" is selected, exercises requiring a pull-up bar are strictly filtered out and never displayed.

**Pull Workout Rules & Honesty:**
- Exercises for Pull without equipment are floor/prone posterior chain movements (Prone Cobra, Y-T-W raises, Scapular Retractions).
- Each floor pulling exercise includes an honest educational disclaimer explaining that floor movements build shoulder and scapular health, but do not provide vertical pulling resistance equal to a pull-up.
- Never falsely market any floor exercise as a complete replacement for a pull-up.

Each exercise must include:
- Name, slug, category, difficulty, equipment_required, primary_muscles, secondary_muscles.
- Short description and step-by-step technique cues (setup, execution, common mistakes).
- Starting position, controlled movement instructions, breathing guidance, and safe exit/stop guidance.
- Common mistakes and appropriate regressions.
- Prerequisites and reviewed progressions.
- Safety notes and honest pulling disclaimers where applicable.
- 2D animation or illustrated movement sequence where available.
- Text alternative and captions/instructions for accessibility.
- Content review status (`draft`, `reviewed`, `published`). Draft content must never appear to users.

### 6.5 Training Plans
- Curated plans based on experience, goal, equipment, and schedule.
- Warm-up, main movements, optional accessories, and cooldown.
- Sets, rep ranges, hold duration, rest periods, and tempo when appropriate.
- Rest/recovery days.
- Easier alternatives and the ability to skip or reschedule.
- Deterministic matching rules for MVP; no AI-generated plans in MVP.

### 6.6 Interactive Workout Player (Phase 5)
- **Workout Overview (`app/workout/[id].tsx`):** Displays workout name, duration, move count, sequence, and strict equipment readiness checks before starting.
- **Active Player (`app/workout/session.tsx`):**
  - Large 2D demonstration stage with Lottie playback, slow-motion (0.5x) toggle, replay, and static biomechanical diagram fallbacks.
  - Set stepper supporting both dynamic repetitions and static holds in seconds.
  - Step navigation (Previous / Next / Pause / Resume / Exit).
- **Rest Interval Timer:** Circular countdown timer with +15s / +30s extensions, skip action, and next exercise preview.
- **State Machine & Recovery:** Handles `not_started`, `in_progress`, `resting`, `paused`, `completed`, and `abandoned` with local persistence for session crash recovery.
- **Completion & History (`app/workout/summary.tsx`):** Real metrics (sets logged, actual reps/hold duration, total session time), celebratory 2D animation, and persistent Supabase database save. No fake calories or inflated stats.

### 6.6.1 2D Animation Enhancement System (Phase 5.1)
- **Verified 2D Lottie Motion Assets:** 18 dedicated vector animations (`pushup`, `pullup`, `squat`, `lunge`, `plank`, `hollow-body`, `pike-pushup`, `prone-cobra`, `dead-hang`, `reverse-crunch`, `handstand`, `planche`, `front-lever`, `back-lever`, `l-sit`, `muscle-up`, `crow-pose`, `pistol-squat`).
- **Complete Registry Integration:** 100% of published exercises (31/31) and target skills (8/8) map to verified animation assets with verified status.
- **Kinematic Articulated Engine:** Procedural SVG + Reanimated athlete engine (`AnimatedVectorAthlete.tsx`) for real-time joint articulation and seamless looping.
- **Biomechanical Static Diagrams:** 18 matching static vector diagrams (`StaticExerciseDiagram.tsx`) guaranteeing reduced-motion accessibility.
- **Dedicated Skill Progressions:** Clear visual and structural distinction between foundational beginner progressions (e.g., Chest-to-Wall Handstand, Planche Lean, Tuck Front Lever) and advanced mastery holds.
- **Dynamic Controls:** In-component speed toggle (1.0x / 0.5x), play/pause, replay, mode toggle, and tempo/progression indicator badges across workout player, library cards, and dashboard skills.

### 6.7 Skill Pathways & Progression System (Phase 6)
- **8 Canonical Calisthenics Skills:**
  1. *Handstand* (`none` - zero equipment inversion balance)
  2. *Planche* (`none` - zero equipment straight-arm horizontal pressing)
  3. *Front Lever* (`pull_up_bar` - straight-arm horizontal pulling)
  4. *Back Lever* (`pull_up_bar` - straight-arm inverted posterior hold)
  5. *L-Sit* (`none` - floor-based abdominal compression and tricep depression)
  6. *Muscle-up* (`pull_up_bar` - explosive pull-to-dip transition)
  7. *Human Flag* (`vertical_support` - strict vertical pole/stall bars requirement; strictly excluded from zero-equipment filtering)
  8. *Pistol Squat* (`none` - single-leg squat strength and mobility)
- **48 Structured Progression Stages:** Every skill features a verified 6-stage progressive pathway (Stage 1 foundational prep to Stage 6 full mastery hold/reps).
- **Progression Readiness Engine (`progressionReadinessEngine.ts`):** Evaluates prerequisites, hold/rep target criteria, and honest status transitions (`not_started` -> `learning` -> `practicing` -> `ready_for_assessment` -> `completed`). Never claims mastery without user-recorded capability.
- **Dedicated Skill Detail & Interactive Timeline (`app/skills/[id].tsx`):** Large 2D animated demonstration stage, equipment requirement warnings, safety notes, target muscles, interactive stage cards with expandable technique cues, and historical practice logs.
- **Dedicated Skill Practice Mode (`app/skills/practice.tsx`):** Active stopwatch/hold timer, set counter, hold seconds / repetition metric logger, RPE 1–5 effort rating, optional notes, and real-time Supabase persistence.
- **Strict Equipment Governance:** "No Equipment First" philosophy enforced. Floor skills require zero equipment. Pull-up bar skills require bar verification. Human Flag requires vertical support and explicitly warns users attempting without safe fixtures.

### 6.8 Progress & Mastery Tracking (Phase 6)
- **Training Progress Hub (`app/(tabs)/progress.tsx`):**
  - High-level metric summary: Active Skills In Training, Total Practice Logs, and Mastered Skills.
  - Active Skill Pathways with real-time progression percentage bars, current stage badges, personal best metrics, and direct links to skill details.
  - No Equipment First overview clarifying zero-equipment capability.
  - Detailed practice session logs with date, completed sets, best hold/reps, RPE rating, and notes.
- Users can log authentic technical practice and see honest feedback without shame or false praise.

### 6.9 Smart Notifications (Phase 7 Implemented)
- **Daily Workout Reminders:** Gentle, supportive prompts delivered on scheduled training days at custom user-configured times.
- **Skill Practice Reminders:** Mid-week nudges for active skill hold progression stages.
- **Rest & Recovery Reminders:** Encouraging messages on off-days emphasizing tendon conditioning, mobility, and sleep.
- **Workout Completion Notifications:** Immediate celebrations upon completing routines with set and duration counts.
- **Weekly Progress Summaries:** Sunday evening reviews highlighting training consistency.
- **Strict Anti-Spam Governance:** Zero duplicate scheduling via pre-schedule cancellation sweeps; custom quiet hours; respect for device timezone and OS permission denials.
- **Persistence:** Notification preferences synchronized to Supabase `public.notification_preferences` and cached in AsyncStorage.

### 6.10 AI Coach (later phase)
- Explain approved exercise-library content.
- Help find reviewed alternatives.
- Summarize training history with user permission.
- Never diagnose, prescribe treatment, or recommend training through pain.
- Never invent technique or medical claims.
- Run only through a trusted server-side gateway with validation and safety rules.

### 6.11 Comprehensive Profile, Settings & Accessibility (Phase 7 Implemented)
- **Personal Information:** View and edit full name, email status, and profile avatar.
- **Training Preferences:** Dynamic controls to edit experience level (`beginner`, `intermediate`, `advanced`), weekly training days, and available equipment (`none` vs `pull_up_bar`) with instant database persistence.
- **Accessibility Governance:**
  - Screen reader audit: semantic roles (`header`, `button`, `radio`, `switch`, `alert`), labels, and hints on all interactive elements.
  - Reduced Motion modes: 3-way toggle (`system`, `always_reduce`, `always_motion`) replacing animations with biomechanical alignment diagrams (`StaticExerciseDiagram`).
  - Dynamic font scaling: `allowFontScaling={true}` and `maxFontSizeMultiplier={2.0}` on `AppText`.
  - Minimum touch targets: 44px+ guideline enforced across all buttons, segmented controls, and day pickers.
  - Form validation: accessible live region (`accessibilityLiveRegion="polite"`) and `aria-invalid` on `AppInput`.
- **Reusable Feedback Components:** `LoadingSkeleton`, `CardSkeleton`, `OfflineBanner`, `ConfirmationDialog`, and `SuccessBanner`.
- **Session Recovery:** Automatic recovery of in-progress sessions upon app reload or interruption.
- **Account & Privacy:** PostgreSQL RLS explanation, sign out with confirmation dialog, and data sovereignty notice.

## 7. Motion and Animation Requirements

The app must use smooth, purposeful **2D animations**:
- Vector exercise demonstrations showing start, movement, and end positions.
- Animated onboarding illustrations.
- Subtle card entrances and screen transitions.
- Progress rings/bars that animate when values change.
- Friendly micro-interactions for selection, completion, and timer states.
- Small celebratory animations for meaningful milestones, never for unsafe volume.

Animation must be performant on mid-range Android devices. Use vector/Lottie/Rive assets where suitable; do not use heavy 3D scenes. Include a reduced-motion setting and respect the operating-system reduced-motion preference. Animations must never obscure controls, exercise cues, or safety information.

## 8. Non-Functional Requirements

- TypeScript strict mode and reusable feature modules.
- Secure authentication and backend-enforced authorization.
- Row Level Security for user-owned records.
- Clear loading, empty, offline, and error states.
- Fast launch and responsive navigation.
- Accessible text scaling, screen-reader labels, contrast, captions, and touch targets.
- Privacy-conscious analytics and error monitoring.
- Automated tests and CI checks before release.

## 9. MVP Scope

### Include
- Authentication.
- Onboarding/profile.
- Light-theme design system.
- Dashboard and weekly schedule.
- Exercise library with reviewed instructions and a starter set of 2D animations.
- Curated plans.
- Workout player, rest timer, and logging.
- Basic progress history and skill milestones.
- Settings, privacy, safety, and accessibility basics.

### Exclude until later
- Public social feed and leaderboards.
- Coach marketplace or direct messaging.
- Subscription/payments.
- AI-generated plans.
- Wearables.
- Calorie tracking or complex nutrition features.
- Medical diagnosis or rehabilitation.

## 10. Success Metrics

- Onboarding completion.
- First suitable workout started and completed.
- Workout log save success.
- Crash-free sessions.
- Exercise instruction usefulness feedback.
- Users finding a suitable regression/alternative.
- Retention that does not depend on excessive training frequency.
- Safety reports and content corrections resolved.

## 11. MVP Acceptance Criteria

- Users can register, verify, sign in, sign out, and reset passwords.
- Onboarding preferences persist and can be edited.
- Dashboard shows the correct session or recovery state.
- Exercise details show complete reviewed instructions and available 2D media.
- Workout can be started, paused, resumed, completed, or safely stopped.
- Workout history persists after app restart.
- Users cannot access another user's private records.
- Core screens include loading, empty, error, and offline states.
- Animations are smooth, replayable where relevant, and respect reduced-motion settings.
- Privacy, safety, and support information is accessible.

## 12. Security & Production Hardening (Phase 8.2)

- **Equipment Identifier Normalization:** Canonical `pull_up_bar` (and `none`) standardized across onboarding, exercise library, dashboard, and skills. Centralized `isEquipmentAvailable` utility ensures backwards-compatibility for legacy profile records.
- **Route Guard Hardening:** All protected screens (`(tabs)`, `/workout/*`, `/skills/*`) enforce authentication and onboarding completion against direct deep links.
- **Production Android Packaging:** Configured `versionCode: 1`, explicit runtime permissions (`RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `POST_NOTIFICATIONS`), and Google Play compliance avoiding restricted exact alarm permissions.
- **Database RLS Completeness:** Full CRUD Row-Level Security on user data tables including explicit `DELETE` policy on `notification_preferences`.
- **Dependency Hygiene:** Upgraded Zod to eliminate high-severity vulnerability GHSA-mrhx-c7xc-m3w5 with 0 critical and 0 high advisories remaining.
