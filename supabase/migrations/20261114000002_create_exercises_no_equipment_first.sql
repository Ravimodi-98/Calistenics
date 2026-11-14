-- Migration: 20261114000002_create_exercises_no_equipment_first.sql
-- Description: Creates the exercises table and seeds foundational exercises adhering to the
--              NO EQUIPMENT FIRST core philosophy, with strict category & equipment restrictions.

-- 1. Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('no_equipment', 'push', 'pull', 'legs', 'core', 'skills')),
  equipment_required TEXT NOT NULL DEFAULT 'none' CHECK (equipment_required IN ('none', 'pull_up_bar')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  primary_muscles TEXT[] NOT NULL DEFAULT '{}',
  secondary_muscles TEXT[] NOT NULL DEFAULT '{}',
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  progression_exercises TEXT[] NOT NULL DEFAULT '{}',
  regressions TEXT[] NOT NULL DEFAULT '{}',
  safety_notes TEXT,
  disclaimer TEXT,
  animation_asset_path TEXT NOT NULL DEFAULT 'assets/animations/exercise-placeholder.json',
  animation_format TEXT NOT NULL DEFAULT 'lottie_json',
  content_status TEXT NOT NULL DEFAULT 'published' CHECK (content_status IN ('draft', 'reviewed', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast category, equipment, and difficulty filtering
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment_required);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_content_status ON public.exercises(content_status);

-- 3. Row Level Security: Published exercises are publicly readable
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published exercises are readable by everyone" ON public.exercises;
CREATE POLICY "Published exercises are readable by everyone"
  ON public.exercises
  FOR SELECT
  USING (content_status = 'published');

-- 4. Seed exercises demonstrating "No Equipment First" philosophy
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
-- 1. NO EQUIPMENT CATEGORY (Primary)
(
  'prone-cobra',
  'Prone Cobra',
  'A floor-based postural exercise strengthening the upper back, rear shoulders, and thoracic spine with zero equipment.',
  'no_equipment',
  'none',
  'beginner',
  ARRAY['rhomboids', 'rear_deltoids', 'lower_trapezius'],
  ARRAY['glutes', 'erector_spinae'],
  '[
    {"step": 1, "title": "Setup", "cue": "Lie face down on the floor with arms at your sides, palms facing down, toes on the ground."},
    {"step": 2, "title": "Lift and Rotate", "cue": "Simultaneously lift your chest off the floor while externally rotating your arms so thumbs point to the ceiling."},
    {"step": 3, "title": "Scapular Pinch", "cue": "Squeeze your shoulder blades together and down toward your hips. Keep chin tucked, looking at the floor."},
    {"step": 4, "title": "Hold & Lower", "cue": "Hold for 3 to 5 seconds with controlled breathing, then lower slowly with control."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['prone-y-t-w-raises', 'reverse-plank-bridge'],
  ARRAY[]::TEXT[],
  'Do not hyper-extend the neck. Keep the back of your neck long by looking down.',
  'Note: Floor-based pulling and posterior extension strengthens the scapular retractors and thoracic posture, but does not provide the vertical resisted load of a hanging pull-up.',
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'standard-push-up',
  'Standard Push-up',
  'The quintessential upper-body pushing movement building chest, tricep, and anterior shoulder strength.',
  'no_equipment',
  'none',
  'beginner',
  ARRAY['pectoralis_major', 'triceps_brachii', 'anterior_deltoid'],
  ARRAY['rectus_abdominis', 'serratus_anterior'],
  '[
    {"step": 1, "title": "High Plank Setup", "cue": "Hands placed slightly wider than shoulder-width, fingers spread, feet together, glutes squeezed."},
    {"step": 2, "title": "Descent", "cue": "Lower your chest toward the floor in one rigid line. Elbows track back at roughly 45 degrees."},
    {"step": 3, "title": "Full Depth", "cue": "Descend until your chest lightly touches the floor or is an inch above."},
    {"step": 4, "title": "Press to Lockout", "cue": "Push through the entire palm back to top position, fully protracting shoulder blades at the top."}
  ]'::jsonb,
  ARRAY['incline-push-up'],
  ARRAY['diamond-push-up', 'pike-push-up'],
  ARRAY['incline-push-up', 'knee-push-up'],
  'Avoid sagging the hips or flaring elbows out perpendicular to the torso.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'bodyweight-squat',
  'Bodyweight Squat',
  'Foundational lower body compound movement that builds quad, glute, and hip endurance.',
  'no_equipment',
  'none',
  'beginner',
  ARRAY['quadriceps', 'gluteus_maximus'],
  ARRAY['hamstrings', 'adductors', 'calves'],
  '[
    {"step": 1, "title": "Stance", "cue": "Stand with feet shoulder-width apart, toes turned slightly outward."},
    {"step": 2, "title": "Hinge and Sit", "cue": "Push hips back and bend knees, keeping knees tracking over toes."},
    {"step": 3, "title": "Depth", "cue": "Descend until thighs are at least parallel to the floor, torso upright."},
    {"step": 4, "title": "Ascent", "cue": "Drive through the midfoot to return to full standing position, squeezing glutes at the top."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['reverse-lunges', 'bulgarian-split-squats'],
  ARRAY['box-squat'],
  'Keep your heels flat on the floor throughout the entire movement.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'hollow-body-hold',
  'Hollow Body Hold',
  'Gymnastics core foundation creating anti-extension strength and pelvic control essential for all calisthenics skills.',
  'no_equipment',
  'none',
  'intermediate',
  ARRAY['rectus_abdominis', 'transverse_abdominis'],
  ARRAY['hip_flexors', 'quadriceps'],
  '[
    {"step": 1, "title": "Setup", "cue": "Lie on back with arms extended overhead and legs straight together."},
    {"step": 2, "title": "Posterior Pelvic Tilt", "cue": "Press your lower back firmly into the floor so there is zero space beneath your lumbar spine."},
    {"step": 3, "title": "Lift Extremities", "cue": "Lift shoulders, head, and legs 6 to 12 inches off the ground forming a shallow banana shape."},
    {"step": 4, "title": "Hold", "cue": "Breathe into your belly while keeping the lower back glued to the floor."}
  ]'::jsonb,
  ARRAY['dead-bug'],
  ARRAY['l-sit-progression'],
  ARRAY['tucked-hollow-hold', 'dead-bug'],
  'If your lower back arches off the floor at any time, immediately regress to a tucked knee position.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),

-- 2. PUSH CATEGORY
(
  'incline-push-up',
  'Incline Push-up',
  'Gentle beginner push variation reducing bodyweight percentage against a sturdy raised surface or wall.',
  'push',
  'none',
  'beginner',
  ARRAY['pectoralis_major', 'anterior_deltoid'],
  ARRAY['triceps_brachii'],
  '[
    {"step": 1, "title": "Setup", "cue": "Place hands on an elevated surface (couch, bench, or sturdy table) shoulder-width apart."},
    {"step": 2, "title": "Descent", "cue": "Lower your chest with a rigid core until it touches the edge."},
    {"step": 3, "title": "Press", "cue": "Push back firmly to straight arms with full control."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['standard-push-up'],
  ARRAY['wall-push-up'],
  'Ensure the support surface is stable and cannot slip.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'diamond-push-up',
  'Diamond Push-up',
  'Close-grip bodyweight pressing variation placing intense mechanical load on the triceps.',
  'push',
  'none',
  'intermediate',
  ARRAY['triceps_brachii', 'inner_pectoralis'],
  ARRAY['anterior_deltoid', 'core'],
  '[
    {"step": 1, "title": "Hand Placement", "cue": "Place thumbs and index fingers together under center of chest forming a diamond shape."},
    {"step": 2, "title": "Control Descent", "cue": "Lower chest toward hands while keeping elbows tucked close to sides."},
    {"step": 3, "title": "Press Lockout", "cue": "Drive palms down into floor to complete the press."}
  ]'::jsonb,
  ARRAY['standard-push-up'],
  ARRAY['pike-push-up'],
  ARRAY['incline-diamond-push-up'],
  'If wrist discomfort occurs, separate hands slightly into a close parallel grip.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'pike-push-up',
  'Pike Push-up',
  'Vertical pushing progression that shifts load directly to the anterior deltoids and upper trapezius.',
  'push',
  'none',
  'intermediate',
  ARRAY['anterior_deltoid', 'lateral_deltoid', 'triceps_brachii'],
  ARRAY['upper_trapezius', 'serratus_anterior'],
  '[
    {"step": 1, "title": "Pike Setup", "cue": "From push-up position, walk feet toward hands, lifting hips high into an inverted V-shape."},
    {"step": 2, "title": "Tripod Descent", "cue": "Lower head forward between and in front of hands, creating a tripod shape with elbows tracked 45 degrees."},
    {"step": 3, "title": "Press Backward", "cue": "Push through palms diagonally back to the peak pike position, finishing with active shoulders."}
  ]'::jsonb,
  ARRAY['standard-push-up'],
  ARRAY['elevated-pike-push-up', 'wall-handstand-push-up'],
  ARRAY['standard-push-up'],
  'Do not lower head directly between hands; always travel forward to form a tripod.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),

-- 3. PULL CATEGORY (Floor No-Equipment vs Optional Pull-up Bar)
(
  'prone-y-t-w-raises',
  'Prone Y-T-W Raises',
  'Comprehensive floor-based scapular retractor sequence strengthening the lower, middle trapezius and posterior deltoids without equipment.',
  'pull',
  'none',
  'beginner',
  ARRAY['lower_trapezius', 'middle_trapezius', 'rear_deltoids'],
  ARRAY['infraspinatus', 'rhomboids'],
  '[
    {"step": 1, "title": "Y Position", "cue": "Lie face down, extend arms overhead at 45 degrees (Y shape) with thumbs up. Pulse thumbs up 10 times."},
    {"step": 2, "title": "T Position", "cue": "Move arms straight out to sides perpendicular to torso (T shape) with thumbs up. Pulse up 10 times."},
    {"step": 3, "title": "W Position", "cue": "Bend elbows down to ribs (W shape). Squeeze shoulder blades together and pulse up 10 times."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['dead-hang', 'scapular-pull-ups'],
  ARRAY[]::TEXT[],
  'Keep neck relaxed and forehead resting on the floor or neutral.',
  'CRITICAL NOTE: Floor-based pulling exercises isolate scapular stabilizers and posterior deltoids, which are crucial for posture and shoulder health. However, they do not provide the heavy vertical tensile resistance of hanging bodyweight. They are a valuable foundation, but not an exact 1:1 replacement for pull-ups.',
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'prone-scapular-retractions',
  'Prone Scapular Retractions',
  'Strict floor retraction drill training conscious scapular depression and retraction.',
  'pull',
  'none',
  'beginner',
  ARRAY['rhomboids', 'middle_trapezius'],
  ARRAY['latissimus_dorsi', 'rear_deltoids'],
  '[
    {"step": 1, "title": "Setup", "cue": "Lie flat on stomach with hands behind head or hovering beside ears."},
    {"step": 2, "title": "Retraction", "cue": "Draw shoulder blades together as tightly as possible without arching lower back."},
    {"step": 3, "title": "Hold & Release", "cue": "Hold maximum contraction for 2 seconds, then slowly let shoulder blades spread."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['prone-y-t-w-raises'],
  ARRAY[]::TEXT[],
  'Isolate upper back movement; do not lift feet or arch lower spine excessively.',
  'CRITICAL NOTE: Floor scapular retractions develop neuromuscular control for pulling mechanics. They do not substitute for resisted bodyweight hangs or pull-ups.',
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'reverse-plank-bridge',
  'Reverse Plank Bridge',
  'Bodyweight posterior chain hold emphasizing shoulder extension, glute lockout, and hamstring activation.',
  'pull',
  'none',
  'beginner',
  ARRAY['glutes', 'hamstrings', 'rear_deltoids'],
  ARRAY['scapular_depressors', 'erector_spinae'],
  '[
    {"step": 1, "title": "Setup", "cue": "Sit with legs extended, hands placed behind hips with fingers pointing forward."},
    {"step": 2, "title": "Bridge Up", "cue": "Drive hips upward until your body forms a straight diagonal line from heels to shoulders."},
    {"step": 3, "title": "Open Chest", "cue": "Depress shoulders away from ears and pull chest open. Hold for prescribed duration."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['prone-cobra'],
  ARRAY['tabletop-bridge'],
  'Do not allow shoulders to shrug up into neck.',
  'Note: This exercise trains posterior chain extension. Complements pulling balance without providing hanging vertical load.',
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'dead-hang',
  'Dead Hang',
  'Passive and active hanging from a bar to develop grip strength, decompress the spine, and condition shoulder joints.',
  'pull',
  'pull_up_bar',
  'beginner',
  ARRAY['forearms', 'latissimus_dorsi'],
  ARRAY['scapular_stabilizers', 'rotator_cuff'],
  '[
    {"step": 1, "title": "Grip", "cue": "Grip the overhead bar with an overhand grip slightly wider than shoulders."},
    {"step": 2, "title": "Hang", "cue": "Hang freely with feet off the floor. Keep core gently engaged to avoid excessive swinging."},
    {"step": 3, "title": "Active Transition", "cue": "Alternate between relaxed passive hangs and slight active scapular depressions."}
  ]'::jsonb,
  ARRAY['prone-y-t-w-raises'],
  ARRAY['scapular-pull-ups', 'negative-chin-ups'],
  ARRAY['feet-assisted-hang'],
  'If grip fatigues, step down safely rather than dropping unexpectedly.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'scapular-pull-ups',
  'Scapular Pull-ups',
  'The gateway movement to vertical pulling: initiates the pull using only scapular depression and retraction.',
  'pull',
  'pull_up_bar',
  'beginner',
  ARRAY['lower_trapezius', 'latissimus_dorsi'],
  ARRAY['rhomboids', 'pectoralis_minor'],
  '[
    {"step": 1, "title": "Start in Hang", "cue": "Hang from pull-up bar with straight arms and overhand grip."},
    {"step": 2, "title": "Depress and Retract", "cue": "Without bending elbows, pull your shoulder blades down and back, lifting chest slightly."},
    {"step": 3, "title": "Hold & Reset", "cue": "Hold the top active position for 1 second, then control descent back to passive hang."}
  ]'::jsonb,
  ARRAY['dead-hang'],
  ARRAY['negative-chin-ups', 'standard-pull-up'],
  ARRAY['band-assisted-scap-pull'],
  'Keep arms completely straight; this is purely a shoulder blade movement.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'negative-chin-ups',
  'Negative Chin-ups',
  'Eccentric pulling overload that bridges the strength gap toward achieving a first full pull-up.',
  'pull',
  'pull_up_bar',
  'beginner',
  ARRAY['biceps_brachii', 'latissimus_dorsi'],
  ARRAY['upper_back', 'brachialis'],
  '[
    {"step": 1, "title": "Step to Top", "cue": "Use a box or jump to get chin above bar with an underhand (supinated) grip."},
    {"step": 2, "title": "Lock In", "cue": "Hold top position for a momentary pause, engaging lats and biceps."},
    {"step": 3, "title": "Slow Descent", "cue": "Lower down over 3 to 5 smooth seconds with uniform tempo down to a dead hang."}
  ]'::jsonb,
  ARRAY['scapular-pull-ups'],
  ARRAY['standard-pull-up'],
  ARRAY['feet-assisted-pull-up'],
  'Do not drop during the bottom half of the range; fight gravity all the way down.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'standard-pull-up',
  'Standard Pull-up',
  'The gold standard of upper-body vertical pulling strength and back width development.',
  'pull',
  'pull_up_bar',
  'intermediate',
  ARRAY['latissimus_dorsi', 'biceps_brachii'],
  ARRAY['trapezius', 'rhomboids', 'posterior_deltoids', 'core'],
  '[
    {"step": 1, "title": "Full Hang", "cue": "Overhand grip slightly wider than shoulders, arms fully locked, hollow body engaged."},
    {"step": 2, "title": "Initiate", "cue": "Pull elbows down into pockets while driving chest upward toward bar."},
    {"step": 3, "title": "Top Position", "cue": "Clear chin comfortably over the bar without craning neck."},
    {"step": 4, "title": "Controlled Return", "cue": "Lower with full control back to a dead hang before initiating the next rep."}
  ]'::jsonb,
  ARRAY['negative-chin-ups', 'scapular-pull-ups'],
  ARRAY['l-sit-pull-up', 'chest-to-bar-pull-up'],
  ARRAY['negative-chin-ups'],
  'Avoid kicking or kipping with knees. Maintain strict calisthenics form.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),

-- 4. LEGS CATEGORY
(
  'reverse-lunges',
  'Reverse Lunges',
  'Unilateral leg strengthening movement improving hip stability, balance, and knee alignment.',
  'legs',
  'none',
  'beginner',
  ARRAY['quadriceps', 'gluteus_maximus'],
  ARRAY['hamstrings', 'calves', 'core'],
  '[
    {"step": 1, "title": "Standing Setup", "cue": "Stand tall with feet hip-width apart and hands on hips or clasped in front."},
    {"step": 2, "title": "Step Back", "cue": "Step one leg backward, dropping the back knee until it gently hovers an inch above floor."},
    {"step": 3, "title": "Front Knee Check", "cue": "Ensure front knee tracks over midfoot at roughly a 90-degree angle."},
    {"step": 4, "title": "Drive Up", "cue": "Push through front heel to step back to starting position."}
  ]'::jsonb,
  ARRAY['bodyweight-squat'],
  ARRAY['bulgarian-split-squat', 'pistol-squat'],
  ARRAY['bodyweight-squat'],
  'Avoid slamming back knee into hard flooring.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'single-leg-calf-raise',
  'Single-Leg Calf Raise',
  'Isolated ankle stabilizer and calf strengthening exercise using floor or a door threshold.',
  'legs',
  'none',
  'beginner',
  ARRAY['gastrocnemius', 'soleus'],
  ARRAY['tibialis_posterior', 'foot_intrinsics'],
  '[
    {"step": 1, "title": "Balance Setup", "cue": "Stand on one foot with fingertips against a wall for balance."},
    {"step": 2, "title": "Drive to Toes", "cue": "Raise heel as high as possible onto the ball of your big toe."},
    {"step": 3, "title": "Peak Squeeze", "cue": "Hold top contraction for 1 second, then lower down over 2 seconds."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['two-leg-calf-raise'],
  'Do not bounce on the bottom; perform each repetition with deliberate control.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),

-- 5. CORE CATEGORY
(
  'dead-bug',
  'Dead Bug',
  'Gentle anti-extension coordination drill teaching anterior core bracing while moving limbs.',
  'core',
  'none',
  'beginner',
  ARRAY['transverse_abdominis', 'internal_obliques'],
  ARRAY['hip_flexors'],
  '[
    {"step": 1, "title": "Setup", "cue": "Lie on back with arms pointing to ceiling and knees bent at 90 degrees above hips."},
    {"step": 2, "title": "Lumbar Anchor", "cue": "Press lower back firmly into the floor so there is zero gap."},
    {"step": 3, "title": "Contralateral Extension", "cue": "Simultaneously lower right arm overhead and left heel toward floor without lower back moving."},
    {"step": 4, "title": "Return", "cue": "Return to start and switch to opposite limbs."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['hollow-body-hold'],
  ARRAY[]::TEXT[],
  'If lower back arches off floor, reduce limb reach range.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'forearm-plank',
  'Forearm Plank',
  'Static core pillar strength builder emphasizing shoulder protraction and neutral spine stability.',
  'core',
  'none',
  'beginner',
  ARRAY['rectus_abdominis', 'transverse_abdominis'],
  ARRAY['serratus_anterior', 'glutes'],
  '[
    {"step": 1, "title": "Elbows Under Shoulders", "cue": "Rest on forearms with elbows directly under shoulders, forearms parallel."},
    {"step": 2, "title": "Pencil Line", "cue": "Form a straight line from heels to ears. Squeeze glutes and thighs firmly."},
    {"step": 3, "title": "Active Push", "cue": "Push floor away through forearms to prevent sagging between shoulder blades."}
  ]'::jsonb,
  ARRAY[]::TEXT[],
  ARRAY['hollow-body-hold', 'side-plank'],
  ARRAY['knee-plank'],
  'Do not let lumbar spine sag; tilt pelvis slightly posteriorly.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),

-- 6. SKILLS CATEGORY
(
  'crow-pose',
  'Crow Pose (Bakasana)',
  'Fundamental arm balance building wrist strength, shoulder stability, and body awareness.',
  'skills',
  'none',
  'intermediate',
  ARRAY['anterior_deltoid', 'wrist_flexors'],
  ARRAY['rectus_abdominis', 'triceps_brachii'],
  '[
    {"step": 1, "title": "Squat Setup", "cue": "Squat down with feet close, hands flat on floor shoulder-width apart, fingers spread."},
    {"step": 2, "title": "Knee Placement", "cue": "Place knees high onto the backs of your triceps near armpits."},
    {"step": 3, "title": "Shift Weight", "cue": "Lean forward slowly, gazing forward (not down), until feet become weightless."},
    {"step": 4, "title": "Lift and Balance", "cue": "Float feet off floor, bringing big toes together and pressing floor away."}
  ]'::jsonb,
  ARRAY['standard-push-up', 'forearm-plank'],
  ARRAY['wall-handstand-hold'],
  ARRAY['crow-pose-toe-tap'],
  'Place a pillow or folded mat in front of your head while learning for safety.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'wall-handstand-hold',
  'Chest-to-Wall Handstand Hold',
  'The safest and most mechanically honest handstand training posture for straight-line alignment.',
  'skills',
  'none',
  'intermediate',
  ARRAY['anterior_deltoid', 'upper_trapezius', 'serratus_anterior'],
  ARRAY['core', 'wrists', 'glutes'],
  '[
    {"step": 1, "title": "Wall Climb", "cue": "From push-up position with feet touching wall, walk feet up wall while walking hands toward wall."},
    {"step": 2, "title": "Straight Alignment", "cue": "Bring hands within 6 to 12 inches of wall. Only toes and nose touch or hover near wall."},
    {"step": 3, "title": "Active Elevation", "cue": "Shrug shoulders upward toward ears. Lock ribs down, squeeze glutes and point toes."},
    {"step": 4, "title": "Safe Bailout", "cue": "Walk hands forward down the wall, or pirouette cartwheel out safely."}
  ]'::jsonb,
  ARRAY['pike-push-up', 'forearm-plank'],
  ARRAY['freestanding-handstand'],
  ARRAY['box-handstand-hold'],
  'Always ensure you have room to pirouette/cartwheel out if you lose balance.',
  NULL,
  'assets/animations/exercise-placeholder.json',
  'published'
),
(
  'l-sit-progression',
  'L-Sit Progression (Floor / Tucked)',
  'Iconic calisthenics isometric hold demanding extreme tricep depression, core compression, and hip flexor strength.',
  'skills',
  'none',
  'intermediate',
  ARRAY['rectus_abdominis', 'iliopsoas', 'triceps_brachii'],
  ARRAY['scapular_depressors', 'quadriceps'],
  '[
    {"step": 1, "title": "Seated Position", "cue": "Sit on floor with legs extended, palms placed flat beside hips."},
    {"step": 2, "title": "Depress & Compress", "cue": "Push hands into floor with straight locked arms, driving shoulders downward."},
    {"step": 3, "title": "Tuck Lift", "cue": "Tuck knees tightly into chest and lift hips and feet completely off floor."},
    {"step": 4, "title": "Hold", "cue": "Hold for 5 to 10 seconds. Extend one leg as strength progresses."}
  ]'::jsonb,
  ARRAY['hollow-body-hold', 'forearm-plank'],
  ARRAY['full-l-sit', 'v-sit'],
  ARRAY['tuck-sit-feet-supported'],
  'Keep elbows locked straight. Do not shrug shoulders up.',
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

