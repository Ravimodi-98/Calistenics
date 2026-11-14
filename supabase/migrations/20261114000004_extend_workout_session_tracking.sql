-- Migration: 20261114000004_extend_workout_session_tracking.sql
-- Description: Extends workout_sessions and workout_session_exercises for set-level metrics
--              and seeds remaining Phase 5 exercises with strict equipment and category constraints.

-- 1. Extend workout_sessions
ALTER TABLE public.workout_sessions
  ADD COLUMN IF NOT EXISTS total_sets_completed INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reps_completed INTEGER NOT NULL DEFAULT 0;

-- 2. Extend workout_session_exercises
ALTER TABLE public.workout_session_exercises
  ADD COLUMN IF NOT EXISTS target_sets INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS target_reps INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS hold_seconds_completed INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- 3. Seed additional Phase 5 exercises to complete full coverage
INSERT INTO public.exercises (
  slug,
  name,
  description,
  category,
  equipment_required,
  difficulty,
  primary_muscles,
  secondary_muscles,
  instructions,
  prerequisites,
  progression_exercises,
  regressions,
  safety_notes,
  disclaimer,
  animation_asset_path,
  content_status
) VALUES
-- Push: Wide Push-up
(
  'wide-push-up',
  'Wide Push-up',
  'Chest-focused bodyweight push variation with hands set approximately 1.5x shoulder width.',
  'push',
  'none',
  'beginner',
  ARRAY['pectoralis_major', 'anterior_deltoid'],
  ARRAY['triceps_brachii', 'serratus_anterior'],
  '[
    {"step": 1, "title": "Wide Hand Placement", "cue": "Place hands 1.5x shoulder width on floor, fingers pointed slightly outward."},
    {"step": 2, "title": "Rigid Bodyline", "cue": "Brace core and glutes, keeping body in one straight line."},
    {"step": 3, "title": "Descent", "cue": "Lower chest smoothly until elbows reach 90 degrees."},
    {"step": 4, "title": "Press", "cue": "Push through palms back to lockout."}
  ]'::jsonb,
  ARRAY['standard-push-up'],
  ARRAY['diamond-push-up'],
  ARRAY['incline-push-up'],
  'Avoid excessively wide placement that strains anterior shoulder capsules.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Push: Decline Push-up
(
  'decline-push-up',
  'Decline Push-up',
  'Feet-elevated pushing variation shifting load to clavicular (upper) pectoralis and anterior deltoids.',
  'push',
  'none',
  'intermediate',
  ARRAY['upper_pectoralis', 'anterior_deltoid'],
  ARRAY['triceps_brachii', 'core'],
  '[
    {"step": 1, "title": "Elevate Feet", "cue": "Place toes on a sturdy chair, couch, or bench with hands on floor."},
    {"step": 2, "title": "Core Brace", "cue": "Maintain neutral pelvic alignment without sagging lower back."},
    {"step": 3, "title": "Descent & Press", "cue": "Lower nose and upper chest toward floor, then press up to full lockout."}
  ]'::jsonb,
  ARRAY['standard-push-up'],
  ARRAY['pike-push-up'],
  ARRAY['standard-push-up'],
  'Ensure the elevation surface is steady and does not slip.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Push: Pseudo Planche Push-up
(
  'pseudo-planche-push-up',
  'Pseudo Planche Push-up',
  'Advanced horizontal pressing variation leaning body forward to drastically overload shoulder flexion and protraction.',
  'push',
  'none',
  'advanced',
  ARRAY['anterior_deltoid', 'pectoralis_major', 'serratus_anterior'],
  ARRAY['triceps_brachii', 'biceps_tendons', 'core'],
  '[
    {"step": 1, "title": "Forward Lean Setup", "cue": "In plank position, turn fingers slightly outward and lean forward until shoulders are ahead of wrists."},
    {"step": 2, "title": "Protracted Start", "cue": "Dominate top position by fully pushing shoulder blades apart."},
    {"step": 3, "title": "Lean Descent", "cue": "Lower down while actively maintaining the forward shoulder lean."},
    {"step": 4, "title": "Press to Protraction", "cue": "Drive palms down and finish with maximal scapular protraction."}
  ]'::jsonb,
  ARRAY['diamond-push-up', 'pike-push-up'],
  ARRAY['planche-lean'],
  ARRAY['standard-push-up'],
  'Condition wrists thoroughly before attempting aggressive forward leans.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Pull: Chin-up (with pull-up bar)
(
  'chin-up',
  'Chin-up',
  'Underhand vertical pulling movement loading biceps brachii and latissimus dorsi.',
  'pull',
  'pull_up_bar',
  'intermediate',
  ARRAY['biceps_brachii', 'latissimus_dorsi'],
  ARRAY['brachialis', 'lower_trapezius'],
  '[
    {"step": 1, "title": "Supinated Grip", "cue": "Grip bar shoulder-width with palms facing toward your face."},
    {"step": 2, "title": "Dead Hang Initiation", "cue": "Start from full hang, depress scapula and drive elbows down toward ribs."},
    {"step": 3, "title": "Chin Over Bar", "cue": "Pull chest high until chin clearly passes bar level."},
    {"step": 4, "title": "Controlled Descent", "cue": "Lower down over 2-3 seconds back to dead hang."}
  ]'::jsonb,
  ARRAY['negative-chin-ups'],
  ARRAY['standard-pull-up'],
  ARRAY['negative-chin-ups'],
  'Avoid kicking knees or hyperextending lumbar spine.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Legs: Bulgarian Split Squat
(
  'bulgarian-split-squat',
  'Bulgarian Split Squat',
  'Unilateral quad and glute strength builder with rear foot elevated on couch or bench.',
  'legs',
  'none',
  'intermediate',
  ARRAY['quadriceps', 'gluteus_maximus'],
  ARRAY['adductor_magnus', 'hamstrings'],
  '[
    {"step": 1, "title": "Rear Foot Elevation", "cue": "Place top of rear foot on an elevated surface behind you, front foot forward."},
    {"step": 2, "title": "Vertical Descent", "cue": "Lower back knee toward floor while keeping torso tall."},
    {"step": 3, "title": "Drive Up", "cue": "Press through front midfoot and heel to return to top position."}
  ]'::jsonb,
  ARRAY['reverse-lunges'],
  ARRAY['pistol-squat-progression'],
  ARRAY['reverse-lunges'],
  'Keep front knee tracking in line with second toe.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Legs: Jump Squat
(
  'jump-squat',
  'Bodyweight Jump Squat',
  'Explosive plyometric bodyweight movement developing lower-body rate of force development.',
  'legs',
  'none',
  'intermediate',
  ARRAY['quadriceps', 'gluteus_maximus', 'calves'],
  ARRAY['hamstrings', 'core'],
  '[
    {"step": 1, "title": "Squat Descent", "cue": "Lower into parallel squat with chest upright."},
    {"step": 2, "title": "Explosive Drive", "cue": "Rapidly extend hips, knees, and ankles to launch straight upward."},
    {"step": 3, "title": "Soft Landing", "cue": "Absorb landing softly through toes to midfoot into the next rep."}
  ]'::jsonb,
  ARRAY['bodyweight-squat'],
  ARRAY['bulgarian-split-squat'],
  ARRAY['bodyweight-squat'],
  'Always land softly with bent knees to protect knee joints.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Legs: Pistol Squat Progression
(
  'pistol-squat-progression',
  'Pistol Squat Progression (Box / Assisted)',
  'Premier single-leg calisthenics skill testing unilateral quad power, hip flexor compression, and ankle mobility.',
  'legs',
  'none',
  'advanced',
  ARRAY['quadriceps', 'gluteus_maximus', 'hip_flexors'],
  ARRAY['calves', 'core'],
  '[
    {"step": 1, "title": "Single-Leg Balance", "cue": "Stand on one leg, extend other leg straight out in front."},
    {"step": 2, "title": "Controlled Squat", "cue": "Sit back and down into standing leg, reaching arms forward for counter-balance."},
    {"step": 3, "title": "Depth", "cue": "Descend until hamstring touches calf, or sit to a sturdy low box."},
    {"step": 4, "title": "Drive to Stand", "cue": "Push floor away through whole foot to stand back tall."}
  ]'::jsonb,
  ARRAY['bulgarian-split-squat'],
  ARRAY['full-pistol-squat'],
  ARRAY['box-pistol-squat'],
  'Do not let standing heel elevate off ground. Work ankle dorsiflexion if heel lifts.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Core: Side Plank
(
  'side-plank',
  'Side Plank',
  'Lateral isometric core hold targeting the obliques, quadratus lumborum, and gluteus medius.',
  'core',
  'none',
  'beginner',
  ARRAY['obliques', 'transverse_abdominis'],
  ARRAY['gluteus_medius', 'shoulder_stabilizers'],
  '[
    {"step": 1, "title": "Side Alignment", "cue": "Lie on side with forearm flat on ground and elbow under shoulder. Stack feet."},
    {"step": 2, "title": "Lift Hips", "cue": "Bridge hips upward so body forms a straight line from ankles to neck."},
    {"step": 3, "title": "Hold & Breathe", "cue": "Keep top hip pushed forward and hold for prescribed time."}
  ]'::jsonb,
  ARRAY['forearm-plank'],
  ARRAY['hollow-body-hold'],
  ARRAY['knee-side-plank'],
  'Do not allow hips to rotate backward or drop toward floor.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Core: Reverse Crunch
(
  'reverse-crunch',
  'Floor Reverse Crunch',
  'Lower-abdominal curl focusing on posterior pelvic tilt without lumbar hyperextension.',
  'core',
  'none',
  'beginner',
  ARRAY['rectus_abdominis'],
  ARRAY['obliques'],
  '[
    {"step": 1, "title": "Back Flat Setup", "cue": "Lie on back with arms at sides, palms down, knees bent at 90 degrees."},
    {"step": 2, "title": "Pelvic Curl", "cue": "Use lower abs to curl pelvis upward off floor toward ribs."},
    {"step": 3, "title": "Slow Descent", "cue": "Control descent vertebra by vertebra without swinging legs."}
  ]'::jsonb,
  ARRAY['dead-bug'],
  ARRAY['hollow-body-hold'],
  ARRAY['dead-bug'],
  'Initiate movement from abs, not by swinging legs or pushing through neck.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
-- Core: Hanging Knee Raise (requires pull_up_bar)
(
  'hanging-knee-raise',
  'Hanging Knee Raise',
  'Hanging core flexion movement building grip, active lat engagement, and abdominal compression.',
  'core',
  'pull_up_bar',
  'intermediate',
  ARRAY['rectus_abdominis', 'iliopsoas'],
  ARRAY['forearms', 'latissimus_dorsi'],
  '[
    {"step": 1, "title": "Active Hang", "cue": "Hang from pull-up bar with overhand grip and engaged scapula."},
    {"step": 2, "title": "Knee Tuck", "cue": "Raise knees smoothly up to chest, tilting pelvis upward at the peak."},
    {"step": 3, "title": "Controlled Lower", "cue": "Lower legs without swinging into excessive momentum."}
  ]'::jsonb,
  ARRAY['dead-hang', 'hollow-body-hold'],
  ARRAY['hanging-leg-raise', 'toes-to-bar'],
  ARRAY['lying-leg-raise'],
  'Avoid swinging back and forth. Perform each rep strictly.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  equipment_required = EXCLUDED.equipment_required,
  difficulty = EXCLUDED.difficulty,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  instructions = EXCLUDED.instructions,
  prerequisites = EXCLUDED.prerequisites,
  progression_exercises = EXCLUDED.progression_exercises,
  regressions = EXCLUDED.regressions,
  safety_notes = EXCLUDED.safety_notes,
  disclaimer = EXCLUDED.disclaimer,
  animation_asset_path = EXCLUDED.animation_asset_path,
  content_status = EXCLUDED.content_status,
  updated_at = timezone('utc'::text, now());

