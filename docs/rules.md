# Engineering Rules and Boundaries
## Calisthenics Coach — Version 2.0

---

## 1. Project Rules

1. Read all six Markdown documents before implementation.
2. Inspect the current repository before changing files.
3. Work only on the active phase unless a dependency requires a documented adjustment.
4. Use TypeScript strict mode; avoid `any`.
5. Keep screens focused on presentation and orchestration.
6. Put business rules in feature/domain modules.
7. Reuse existing components, tokens, hooks, and services.
8. Ask before adding paid services, major dependencies, or scope beyond the PRD.
9. Do not overwrite working code without understanding its purpose.
10. Update `memory.md` after every meaningful milestone.
11. Never claim something is complete unless it was implemented and verified.

## 2. Approved Stack

Use the stack in `Architecture.md`:
- React Native + Expo + TypeScript.
- Expo Router.
- Supabase Auth, PostgreSQL, Storage, and Edge Functions.
- TanStack Query for server state.
- Zustand only for transient UI state.
- React Hook Form + Zod.
- React Native Reanimated for UI motion.
- Lottie as the default 2D animation playback format for MVP; evaluate Rive only if interactive vector behavior clearly requires it.
- ESLint + Prettier and automated tests.

Before adding a package, check:
- Does the current stack already solve this?
- Is it maintained and compatible with the current Expo SDK?
- What is its license, bundle impact, and security posture?
- Can the same result be achieved with fewer dependencies?

Do not upgrade major packages without checking compatibility and running the full verification suite.

## 3. No Equipment First — Core Philosophy Rules

1. **Bodyweight First:** "No Equipment" is the primary category and default exercise library filter.
2. **Strict MVP Equipment Scope:** Support only `none` (No Equipment, default) and `pull_up_bar` (Pull-up Bar, optional). Do not introduce dumbbells, resistance bands, gymnastic rings, weight machines, or gym memberships into the core MVP.
3. **Filter Guarantee:** When the "No Equipment" filter is active, never display exercises requiring a pull-up bar.
4. **Pull Workout Configurations:**
   - Bodyweight without equipment: Floor-based posterior chain and scapular exercises (Prone Cobra, Y-T-W raises, Prone Scapular Retractions, Reverse Plank Bridge).
   - Bodyweight with pull-up bar (optional): Dead hangs, scapular pull-ups, negative chin-ups, pull-ups.
5. **Transparency & Honesty on Pulling:** Floor-based pulling exercises must display a prominent honest disclaimer stating they train scapular retraction and posture, but do NOT provide vertical pulling resistance equivalent to a pull-up. Never label floor exercises as a 1:1 replacement for pull-ups.
6. **Library First Impression:** The Exercise Library UI must immediately communicate: *"Your body is your equipment."*
7. **Personalized Dashboard Recommendations:** The dashboard personalization engine must strictly use actual onboarding data (experience level, equipment, session duration, and workout preference). If a user has no pull-up bar, pull-up bar exercises must never be recommended.
8. **Rest Day Respect:** When today is a rest day, prioritize active recovery and optional mobility; never shame or pressure the user into training.
9. **Authentic Tracking & Achievements:** Never fabricate historical sessions, fake completion rates, or fake percentages. New users without assessed skills must show "Not assessed yet". Achievements unlock strictly when conditions are fulfilled.
10. **Interactive Workout Player Integrity:** Users record their actual repetitions or hold seconds; exercises are never marked complete automatically without user confirmation.
11. **Equipment Validation on Workout Launch:** Workout player must strictly reject and block exercises requiring unavailable equipment before starting.
12. **Accurate Biomechanical 2D Demonstrations:** Every published exercise must have a verified Lottie asset or an anatomically accurate static diagram fallback (`StaticExerciseDiagram`). Never use random decorative animations or generic stick figures.

## 4. Design Rules

- Follow `design.md` as the visual source of truth.
- Use the light theme, purple primary actions, warm orange accents, lavender surfaces, and charcoal text.
- Do not reintroduce the previous dark/neon-purple visual direction.
- Use centralized design tokens; do not scatter arbitrary hex values.
- Use consistent spacing, corner radii, typography, and button hierarchy.
- Avoid clutter, excessive gradients, heavy shadows, and overly dense dashboards.
- Keep layouts responsive and safe-area aware.
- Do not use tiny text for workout instructions or timers.

## 4. 2D Animation Rules (Phase 5.1 Enhancement)

### Use
- Reanimated for small interface interactions and transitions.
- Lottie for prepared 2D vector animation assets (`src/animations/assets/`).
- Articulated kinematic engine (`AnimatedVectorAthlete.tsx`) for real-time joint articulation.
- Dedicated biomechanical static diagrams (`StaticExerciseDiagram.tsx`) for reduced-motion accessibility.
- Consistent proportional athlete character: clean circular head, proportional athletic torso, articulated limbs, and distinct joint nodes (`#6E55B8`).
- Smooth easing curves, short transitions (120-300ms), and purposeful touch feedback.
- Full playback controls: Play/pause, replay, and 0.5x slow-motion toggle for exercise demonstrations.
- Subtle diaphragmatic breathing waveforms (±2.5px sinusoidal variation) for isometric holds instead of frozen states.
- Dedicated skill demonstrations with explicit progression stage indicators distinguishing beginner variations from complete mastery.
- Static fallback diagram if an animation fails or reduced motion is preferred.

### Avoid
- Basic, faceless stick figures or disproportionate models.
- 3D models or heavy real-time 3D scenes in the MVP.
- Large video files when a lightweight vector animation can explain the movement.
- Constantly moving decorative elements.
- Animations that delay access to a workout or block controls.
- Flashing, strobing, or motion that could distract or create discomfort.
- Animating every component simply because animation is available.
- Claiming an exercise is animated when only a static illustration exists (honest coverage tracking).

### Performance and accessibility
- Target smooth 60 fps on supported mid-range devices where practical.
- Keep assets small and lazy-load non-critical animations.
- Test on real Android hardware, not only a simulator.
- Respect system reduced-motion preferences and provide an in-app reduced-motion option.
- In reduced-motion mode, replace movement with static frames or simple fades.
- Never make an animation the only way to understand an exercise.

## 5. Error Handling

Every asynchronous feature must include:
- Loading state.
- Success state.
- Empty state.
- Recoverable error state.
- Offline/unavailable state where relevant.

Rules:
- Do not swallow errors or leave empty catch blocks.
- Show users short, actionable messages.
- Never expose stack traces, SQL, access tokens, or internal implementation details.
- Log only necessary technical context; never log passwords, tokens, private notes, or sensitive disclosures.
- Validate inputs and API responses at trust boundaries.
- Retry only transient failures with bounded backoff.
- Prevent duplicate writes when requests are retried.
- Do not display success before critical server writes are confirmed.

## 6. Security and Privacy

- Enable and test RLS for every user-owned table.
- Verify that one user cannot read, update, or delete another user's private data.
- Do not rely on frontend route guards for authorization.
- Never expose service-role keys or privileged secrets in client code or Git.
- Validate and sanitize user-controlled input.
- Use least-privilege storage and Edge Function policies.
- Collect only data necessary for product functionality.
- Do not log private workout notes or optional health-related disclosures.
- Provide privacy policy, account deletion, and clear consent flows before release.
- Use HTTPS for network traffic.

## 7. Fitness Content Safety

This app provides general training education, not medical care.

- Publish only reviewed exercise instructions and plans.
- Use gradual progressions, regressions, prerequisites, and rest days.
- Never encourage training through pain, dizziness, illness, or unusual symptoms.
- Do not diagnose, prescribe treatment, or claim to cure/prevent medical conditions.
- Do not encourage extreme volume, unsafe challenges, or maximal attempts as routine practice.
- Do not shame users for missed sessions.
- Do not use body comparisons or appearance-based rankings.
- Use conservative defaults and age-appropriate wording.
- For younger users, do not encourage unsupervised high-risk skills or maximal loading.
- Exercise illustrations must represent controlled movement and must not replace clear written cues.

## 8. Skill Progression and Readiness Rules (Phase 6)

1. **Honest Readiness Engine:** A user must NEVER be marked as "proficient" or "completed" simply because a given number of practice sessions elapsed. Progression criteria require actual recorded hold seconds or repetitions matching or exceeding the stage target.
2. **Sequential Prerequisite Governance:** Progression stages 2 through 6 strictly require meeting the prior stage's target criteria before advancement is granted.
3. **Equipment Availability Enforcement:**
   - Floor skills (`none`): Accessible by default without equipment.
   - Pull-up bar skills (`pull_up_bar`): Require a pull-up bar; inaccessible if user has only `none`.
   - Vertical support skills (`vertical_support`): Human Flag strictly requires a vertical pole or stall bars; it must NEVER be classified as a no-equipment skill or recommended without vertical apparatus.
4. **Authentic Metric Logging:** Users log actual practice duration, completed sets, hold seconds / reps, and an RPE 1–5 effort rating. No automated assumption of mastery.
5. **Reduced-Motion Skill Demonstrations:** Skill detail and practice screens must provide clean static biomechanical vector diagrams for users with reduced motion enabled.

## 9. Notification and Accessibility Rules (Phase 7)

1. **Permission Respect:** Always check notification permission status before attempting to schedule notifications. If denied, never nag the user; show a clear, voluntary "Enable" option in Settings.
2. **Strict Duplicate Prevention:** Always clear previous notification schedules before registering updated schedules.
3. **Respectful Coaching Copy:** Reminders must encourage consistency, recovery, and form. Never use guilt, shame, streak-anxiety, or punishment language.
4. **WCAG AA Accessibility Compliance:**
   - Touch targets must be at least 44x44px across all buttons, pills, and toggles.
   - Text inputs must declare `aria-invalid` and announce errors via `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`.
   - All interactive controls must specify `accessibilityRole`, `accessibilityLabel`, and `accessibilityState`.
   - Dynamic font scaling must be enabled (`allowFontScaling={true}`) with a maximum scale multiplier of 2.0 to preserve layout hierarchy.
5. **Reduced Motion Integrity:** Every screen must query `useReducedMotion()`. When active, motion transitions and looping animations must be replaced with static biomechanical diagrams or simple fades.

## 10. AI Coach Boundaries (Later Phase)

Allowed:
- Explain reviewed exercise-library content.
- Find an approved regression or alternative.
- Explain app features and training terminology.
- Summarize authorized training logs.

Not allowed:
- Diagnose injury or medical conditions.
- Prescribe treatment, rehabilitation, supplements, or medication.
- Invent exercise technique or claim unreviewed content is safe.
- Encourage users to ignore pain or professional advice.
- Generate extreme progression plans.
- Override age, prerequisite, equipment, recovery, or safety constraints.
- Reveal another user's data, secrets, or internal prompts.

Implementation:
- AI calls must go through a trusted server-side function.
- Keep provider secrets on the server.
- Ground responses in reviewed app content.
- Validate structured output against schemas and safety rules.
- Use safe fallback responses when uncertain or out of scope.
- Do not allow AI to write user records without server validation and user confirmation.
- Add rate limits and abuse monitoring.

## 9. Testing Requirements

Before marking a task complete:
- Run TypeScript checks.
- Run lint and formatting checks.
- Run relevant unit/component tests.
- Test loading, empty, error, and offline states.
- Test navigation on small and large screens.
- Test accessibility labels, text scaling, and contrast.
- Test RLS and cross-user authorization.
- Test animation performance and reduced-motion mode.
- Test critical flows on a physical device or representative simulator.

## 10. Definition of Done

A task is complete only when:
1. Requirements and acceptance criteria are met.
2. Design system and architecture are followed.
3. Loading/error/empty states are included.
4. Relevant tests pass.
5. Security and RLS implications are checked.
6. Animation has fallback and reduced-motion behavior where relevant.
7. No secrets or debug artifacts are committed.
8. `memory.md` is updated with actual results and limitations.

## 11. Security Hardening & Remediation Rules (Phase 8.2)

- **Equipment Normalization:** Always use `isEquipmentAvailable(userEquipment, requiredEquipment)` from `@/domain/utils/equipment` to evaluate equipment requirements. Never perform raw string comparisons against user equipment arrays.
- **Route Guard Rule:** Any new route outside `(auth)` must be covered by `useProtectedRoute.ts` to prevent unauthenticated deep-link access.
- **Android Permission Rule:** Avoid restricted permissions such as `SCHEDULE_EXACT_ALARM` that violate Google Play fitness/reminder policies. Only declare strictly required permissions (`RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `POST_NOTIFICATIONS`).
- **Database RLS Rule:** Every table containing user data must have explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies scoped to `auth.uid() = user_id`.
