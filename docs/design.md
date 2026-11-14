# Design System and Motion Guidelines
## Calisthenics Coach — Version 2.0
**Visual reference:** User-provided “Fitness App Color Palette” image  
**Design direction:** Clean, creative, light, friendly, premium, and energetic

---

## 1. Visual Direction

Use the supplied reference as the design foundation:
- Light, clean backgrounds.
- Purple and lavender as the main brand colors.
- Warm orange as a secondary accent.
- Charcoal text for strong readability.
- Rounded cards and simple layouts.
- Friendly illustrations and expressive but restrained 2D animation.

Do not use the previous dark/black neon interface. The new app should feel bright, approachable, and modern while still being suitable for serious training.

## 2. Color Palette

Use these reference colors as the initial design tokens:

| Token | Hex | Reference name | Usage |
|---|---|---|---|
| Background | `#F6F6F6` | Cascading White | Main screen background |
| Surface | `#FFFFFF` | White | Cards, sheets, inputs |
| Primary | `#E0DBF3` | Chinese Silver | Lavender surfaces, selected cards |
| Primary Strong | `#8B70D6` | Brand Purple (derived) | Main buttons, links, active navigation |
| Primary Deep | `#6E55B8` | Deep Purple (derived) | Pressed states and strong emphasis |
| Accent | `#F3BA60` | Crunch | Highlights, badges, challenge accents |
| Secondary Surface | `#B6B1C0` | Dreamland | Muted panels and secondary chips |
| Muted Text | `#736A6A` | Warm Haze | Secondary text |
| Text | `#202022` | Lead | Main text and headings |
| Border | `#E7E4EA` | Derived | Dividers and input borders |
| Success | `#4D9B75` | Derived | Positive status |
| Error | `#C94F55` | Derived | Error and destructive actions |

The supplied image explicitly shows `#F6F6F6`, `#E0DBF3`, `#F3BA60`, `#B6B1C0`, `#736A6A`, and `#202022`. The stronger purple, border, success, and error values are proposed supporting tokens and should be checked for contrast before release.

### Color usage rules
- Purple is the primary action and brand color.
- Lavender is for soft cards, selected states, and decorative backgrounds.
- Orange is a highlight, not a second primary button color.
- Charcoal is used for primary text.
- Warm Haze is used for secondary text only when contrast remains sufficient.
- Do not communicate state through color alone; pair with text/icons.
- Avoid large saturated color blocks that make the screen visually noisy.

## 3. Typography

Recommended font: **Inter**. Use system fallback if custom font loading fails.

| Style | Size | Weight | Usage |
|---|---:|---|---|
| Display | 32 | Bold | Main greeting or hero headline |
| H1 | 28 | Bold | Screen title |
| H2 | 22 | Semibold | Section title |
| H3 | 18 | Semibold | Card/exercise title |
| Body Large | 16 | Regular | Main content |
| Body | 14 | Regular | Supporting content |
| Caption | 12 | Medium | Metadata and labels |
| Button | 15–16 | Semibold | Actions |

Use comfortable line height and support dynamic text scaling. Avoid tiny workout instructions and timers.

## 4. Layout and Shape

Spacing scale:
- 4 px: icon/text gap.
- 8 px: compact spacing.
- 12 px: small component gaps.
- 16 px: standard card padding.
- 24 px: section spacing.
- 32 px: major separation.

Shape language:
- Cards: 18–22 px radius.
- Buttons: 14–18 px radius.
- Chips: pill shape.
- Inputs: 14 px radius.
- Use subtle shadows only where they improve hierarchy.
- Use thin, low-contrast borders for definition.

Mobile-first layout must support safe areas, keyboard insets, and small screens.

## 5. Navigation

Use a bottom tab bar:
1. **Home** — today's session and overview.
2. **Plan** — weekly schedule and training plan.
3. **Library** — exercises and skill movements.
4. **Progress** — history and milestones.
5. **Profile** — settings and preferences.

Use simple, consistent line icons. Active state uses purple and a clear label; inactive state uses muted charcoal/gray.

## 6. Screen Concepts

### Welcome / Splash
- White or very light lavender background.
- Brand mark and “Calisthenics Coach” wordmark.
- Small animated 2D character/pose illustration.
- Clear “Get Started” and “Sign In” actions.
- Keep intro animation short and skippable.

### Onboarding
- One question or compact group per screen.
- Large friendly 2D illustrations.
- Lavender selection cards with purple selected borders.
- Orange used for small highlights.
- Progress indicator across the top.
- Clear back, continue, and skip actions.

### Home Dashboard (Phase 4 Personalized Layout)
- **Header:** Friendly dynamic time greeting ("Good Morning / Afternoon / Evening, [Name]"), avatar with user initials, and notification bell.
- **Motivation Hero Card:** Lavender card (`#E0DBF3`) with 2D animated athlete, rotating motivational quotes, and soft circular background shapes.
- **Today's Workout:** High-contrast card with duration, move count, difficulty, and Start Workout CTA. If today is a rest day, renders a calm recovery treatment with an optional mobility suggestion.
- **Skill Development:** Horizontal scroll of target skills with 2D icons, current progression step, and honest "Not assessed yet" status.
- **Weekly Activity:** Clean 7-day schedule strip (Mon–Sun) showing planned vs completed workouts and real recent history (or friendly empty state).
- **Recommended Exercises:** Tailored exercise cards respecting equipment constraints with a "View All" link to the library.
- **Achievements:** Badge grid showing 4 honest milestone cards (First Workout, Weekly Target, Consistency Milestone, Skill Milestone).

### Training Plan
- Weekly schedule presented as clean cards or a horizontal day selector.
- Workout cards show duration, exercise count, and focus.
- Recovery day has a calm, distinct visual treatment.
- Purple indicates the active plan; orange marks optional highlights.

### Exercise Library (No Equipment First)
- Hero header communicating: *"Your body is your equipment."* with lavender background and purple typography.
- "No Equipment" is the primary category and default active view.
- Category pills: No Equipment, Push, Pull, Legs, Core, Skills.
- Equipment filter chips: No Equipment (default), Pull-up Bar Required.
- Strict filter behavior: selecting "No Equipment" never displays pull-up bar exercises.
- Floor pulling honest disclaimer card: friendly informational callout explaining that floor pulling builds scapular health and posterior strength without replacing hanging pull-up resistance.
- Lavender cards, purple selection indicators, orange highlights, 2D vector movement illustrations, and smooth Reanimated transitions.

### Exercise Detail
- Large 2D animated movement demonstration on a light/lavender stage.
- Exercise title, level, equipment, and short description.
- Clear numbered technique steps.
- Common mistakes, easier variation, prerequisites, and safety notes.
- Transparent disclaimer for floor-based pulling exercises.
- Replay/pause animation control.
- Written instructions must remain available if animation is disabled.

### Workout Player (Phase 5 Interactive Layout)
- **Overview Screen (`app/workout/[id].tsx`):** Clean card layout showing estimated duration, move count, difficulty tag, sequence order, and equipment validation warning.
- **Active Player (`app/workout/session.tsx`):**
  - Prominent 220px 2D demonstration stage with play/pause, replay, and 0.5x slow-motion toggle.
  - Overall progress bar in Brand Purple (`#8B70D6`) across the top header.
  - Set stepper supporting both dynamic repetitions and isometric holds in seconds.
  - Responsive footer with Previous, Complete Set, and Next controls.
  - Technique cues accordion and transparent floor-pulling disclaimers.
- **Rest Timer Overlay (`RestTimerOverlay.tsx`):** Circular countdown presentation on dimmed background with quick +15s / +30s time additions and next exercise preview.
- **Completion Screen (`app/workout/summary.tsx`):** Celebratory 2D vector animation, 3-metric summary grid (Minutes, Sets Logged, Total Reps / Hold Time), and completed exercise breakdown. Zero fake stats.

### Progress
- Clean charts with purple as the primary series and orange as a secondary highlight.
- Skill milestone cards.
- Calendar and weekly summary.
- Explain what each metric means.
- No appearance comparisons or pressure-based streaks.

### Profile
- Profile header with avatar.
- Simple rows for goals, equipment, reminders, settings, help, and privacy.
- Use consistent iconography and subtle dividers.

## 7. 2D Animation System

The app must include smooth, polished 2D animation, not 3D graphics.

### Animation types
1. **Exercise motion:** Vector figure/illustration demonstrates the movement in a clear loop or staged sequence.
2. **Onboarding:** Friendly 2D illustrations with small entrance or idle movement.
3. **Navigation:** Subtle screen transitions and tab feedback.
4. **Progress:** Bars/rings animate from old to new values.
5. **Micro-interactions:** Button press, card selection, timer start/pause, completion feedback.
6. **Milestones:** Small celebratory 2D motion for meaningful achievements.

### Motion principles
- Smooth easing; avoid abrupt or springy motion that feels distracting.
- UI transitions should generally be short (about 180–300 ms).
- Small feedback motion should generally be about 120–220 ms.
- Exercise demonstrations should loop at a controlled pace and allow replay/pause.
- Do not animate every element at once.
- Keep text and controls stable while exercise instructions are being read.
- No flashing or strobing effects.
- Respect reduced-motion settings; use static frames or simple fades as alternatives.

### Animation technology
- Reanimated for app UI motion.
- Lottie for prepared vector animation assets (`src/animations/assets/*.json`).
- Articulated vector engine (`AnimatedVectorAthlete.tsx`) using SVG and sinusoidal joint kinematics.
- Include a static biomechanical vector diagram (`StaticExerciseDiagram.tsx`) for all 18 movement patterns for reduced-motion accessibility.
- Athlete character anatomy: Proportional vector athlete (head diameter ~26px, torso ~70-90px length, defined limb articulation, circular joint markers `#6E55B8`).
- Color palette: Brand Purple `#8B70D6` (limbs/head), Lavender `#E0DBF3` (torso core), Deep Purple `#6E55B8` (joints/grips), Accent Orange `#F3BA60` (toes/counterbalance/active cues), Surface `#B6B1C0` (apparatus & floor lines).
- Static holds feature subtle diaphragmatic breathing waveforms (±2.5px sinusoidal displacement) rather than frozen states.
- Dedicated skill demonstrations visually distinguish beginner progressions (e.g. Chest-to-Wall Handstand, Planche Lean, Tuck Front Lever) from complete mastery holds.
- Do not use heavy 3D scenes or video assets.

## 8. Component Library

Create reusable components:
- `AppButton`
- `AppText`
- `ScreenContainer`
- `AppCard`
- `SelectionCard`
- `FormInput`
- `ExerciseCard`
- `ExerciseAnimation`
- `ProgressBar`
- `StatCard`
- `TimerControl`
- `BottomTabBar`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `LoadingSkeleton` (Phase 7): Pulse-animated and reduced-motion compliant placeholder skeletons.
- `CardSkeleton` (Phase 7): Multi-line skeleton container for card and list loading states.
- `OfflineBanner` (Phase 7): Accessible warning banner with retry button for network interruptions.
- `ConfirmationDialog` (Phase 7): Accessible modal dialog for destructive or critical actions.
- `SuccessBanner` (Phase 7): Auto-dismissing positive feedback toast with live region announcement.
- `SkillPathwayTimeline` (Phase 6): 6-stage progressive roadmap with milestone pills, expandable cues, and prerequisite locks.
- `SkillEquipmentNotice` (Phase 6): Contextual equipment warning cards for pull-up bar and vertical support.
- `SkillHistoryList` (Phase 6): Chronological practice logs displaying hold duration/reps and RPE effort tags.

Each interactive component must support accessibility labels, disabled/loading states, and appropriate touch targets.

## 9. Content Voice

Use a friendly, supportive, clear coaching voice:
- “Ready for today's session?”
- “Choose the variation you can control.”
- “Rest is part of progress.”
- “You can pause or stop at any time.”

Avoid guilt, shame, body comparisons, and phrases that encourage ignoring pain.

## 10. Design QA Checklist

- Does the screen follow the light palette?
- Is the main action obvious?
- Is spacing consistent?
- Is text readable at larger system font sizes?
- Are contrast and touch targets sufficient?
- Are loading, empty, error, and offline states designed?

## 11. Security & Production Hardening UX Standards (Phase 8.2)

- **Zero Equipment Visual Transparency:** Equipment badges (`No Equipment` vs `Pull-up Bar Required`) remain prominent on cards and workout previews. Equipment unavailability is displayed with friendly guidance rather than harsh error dialogs.
- **Graceful Session Transitions:** Unauthenticated deep-link interceptions seamlessly transition users to the welcome screen without flashing content or abrupt jumps.
- **Compliant System Feedback:** Rest timer vibrations and notification alerts strictly respect user preferences configured in the Profile screen and device quiet hours.
- Can a screen reader understand controls?
- Is 2D animation smooth and purposeful?
- Is there a static/reduced-motion alternative?
- Does the interface encourage sustainable training?
