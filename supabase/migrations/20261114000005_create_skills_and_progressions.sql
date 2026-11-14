-- =========================================================================
-- Migration: 20261114000005_create_skills_and_progressions.sql
-- Description: Creates skill_catalog, skill_progressions, and
--              skill_practice_sessions tables, and extends user_skill_progress
--              with RLS, foreign keys, and indexes for Phase 6.
-- =========================================================================

-- 1. Create skill_catalog table
CREATE TABLE IF NOT EXISTS public.skill_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'elite')),
  equipment_required TEXT NOT NULL CHECK (equipment_required IN ('none', 'pull_up_bar', 'vertical_support')),
  primary_muscles TEXT[] NOT NULL DEFAULT '{}',
  secondary_muscles TEXT[] NOT NULL DEFAULT '{}',
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  safety_notes TEXT,
  animation_asset TEXT NOT NULL,
  content_status TEXT NOT NULL DEFAULT 'published' CHECK (content_status IN ('draft', 'reviewed', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_skill_catalog_slug ON public.skill_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_skill_catalog_equipment ON public.skill_catalog(equipment_required);
CREATE INDEX IF NOT EXISTS idx_skill_catalog_status ON public.skill_catalog(content_status);

ALTER TABLE public.skill_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published skills" ON public.skill_catalog;
CREATE POLICY "Public can view published skills"
  ON public.skill_catalog
  FOR SELECT
  USING (content_status = 'published');

-- 2. Create skill_progressions table
CREATE TABLE IF NOT EXISTS public.skill_progressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skill_catalog(id) ON DELETE CASCADE,
  skill_slug TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  stage_slug TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  description TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('hold_seconds', 'repetitions')),
  target_value INTEGER NOT NULL,
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  technique_cues TEXT[] NOT NULL DEFAULT '{}',
  safety_notes TEXT,
  animation_asset TEXT NOT NULL,
  assessment_criteria TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (skill_id, stage_order),
  UNIQUE (skill_slug, stage_slug)
);

CREATE INDEX IF NOT EXISTS idx_skill_progressions_skill_id ON public.skill_progressions(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_progressions_order ON public.skill_progressions(skill_slug, stage_order);

ALTER TABLE public.skill_progressions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view skill progressions" ON public.skill_progressions;
CREATE POLICY "Public can view skill progressions"
  ON public.skill_progressions
  FOR SELECT
  USING (true);

-- 3. Extend user_skill_progress table
ALTER TABLE public.user_skill_progress
  ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES public.skill_catalog(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_stage_id UUID REFERENCES public.skill_progressions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_stage_order INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS best_hold_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_reps INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_practiced_at TIMESTAMPTZ;

-- 4. Create skill_practice_sessions table
CREATE TABLE IF NOT EXISTS public.skill_practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skill_catalog(id) ON DELETE SET NULL,
  skill_slug TEXT NOT NULL,
  progression_id UUID REFERENCES public.skill_progressions(id) ON DELETE SET NULL,
  stage_slug TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  completed_sets INTEGER NOT NULL DEFAULT 0,
  recorded_hold_seconds INTEGER NOT NULL DEFAULT 0,
  recorded_reps INTEGER NOT NULL DEFAULT 0,
  effort_rating INTEGER CHECK (effort_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_skill_practice_user_id ON public.skill_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_practice_skill_slug ON public.skill_practice_sessions(skill_slug);
CREATE INDEX IF NOT EXISTS idx_skill_practice_created_at ON public.skill_practice_sessions(created_at DESC);

ALTER TABLE public.skill_practice_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own skill practice sessions" ON public.skill_practice_sessions;
CREATE POLICY "Users can manage their own skill practice sessions"
  ON public.skill_practice_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Seed the 8 canonical Calisthenics Skills
INSERT INTO public.skill_catalog (
  slug,
  name,
  description,
  difficulty,
  equipment_required,
  primary_muscles,
  secondary_muscles,
  prerequisites,
  safety_notes,
  animation_asset,
  content_status
) VALUES
(
  'handstand',
  'Handstand',
  'Master straight-arm overhead balance, active scapular elevation, and core hollow-body alignment.',
  'intermediate',
  'none',
  ARRAY['anterior_deltoid', 'trapezius', 'serratus_anterior'],
  ARRAY['forearms', 'rectus_abdominis', 'glutes'],
  ARRAY['30s Pike Hold', '20 Standard Push-ups'],
  'Always bail out with a pirouette side cartwheel or roll. Never arch spine into an uncontrolled banana back.',
  'handstand-animation.json',
  'published'
),
(
  'planche',
  'Planche',
  'The premier straight-arm pushing feat demanding extreme anterior deltoid torque and scapular protraction.',
  'advanced',
  'none',
  ARRAY['anterior_deltoid', 'pectoralis_major', 'serratus_anterior', 'biceps_brachii'],
  ARRAY['core', 'wrists', 'glutes', 'quadriceps'],
  ARRAY['45s Plank', '15 Dip Lockouts', 'Pseudo Planche Push-ups'],
  'Biceps tendon connective tissue adapts slower than muscle. Progress slowly and respect joint conditioning.',
  'planche-animation.json',
  'published'
),
(
  'front-lever',
  'Front Lever',
  'A horizontal isometric hold requiring massive latissimus dorsi, core compression, and scapular retractor power.',
  'advanced',
  'pull_up_bar',
  ARRAY['latissimus_dorsi', 'rhomboids', 'posterior_deltoid', 'core'],
  ARRAY['biceps_brachii', 'triceps_long_head', 'forearms'],
  ARRAY['10 Strict Pull-ups', '30s Active Dead Hang', 'Hollow Body Hold'],
  'Keep elbows locked completely straight. Bending elbows turns the movement into a bent-arm row.',
  'front-lever-animation.json',
  'published'
),
(
  'back-lever',
  'Back Lever',
  'An inverted horizontal bodyweight lever testing shoulder extension flexibility and connective joint resilience.',
  'intermediate',
  'pull_up_bar',
  ARRAY['pectoralis_major', 'biceps_brachii', 'anterior_deltoid', 'core'],
  ARRAY['latissimus_dorsi', 'glutes', 'erector_spinae'],
  ARRAY['30s German Hang', '10 Pull-ups'],
  'Build tendon resilience in the German Hang before loading horizontal leverage to protect the distal biceps tendon.',
  'back-lever-animation.json',
  'published'
),
(
  'l-sit',
  'L-Sit',
  'Fundamental calisthenics compression hold demanding intense scapular depression and hip flexor endurance.',
  'beginner',
  'none',
  ARRAY['rectus_abdominis', 'hip_flexors', 'triceps_brachii'],
  ARRAY['serratus_anterior', 'quadriceps', 'forearms'],
  ARRAY['30s Forearm Plank', '15 Seated Leg Raises'],
  'Lock elbows completely straight and actively push the floor away down through the palms.',
  'l-sit-animation.json',
  'published'
),
(
  'muscle-up',
  'Muscle-up',
  'The definitive transition movement connecting a powerful vertical pull-up into a straight-bar dip.',
  'advanced',
  'pull_up_bar',
  ARRAY['latissimus_dorsi', 'triceps_brachii', 'pectoralis_major'],
  ARRAY['biceps_brachii', 'forearms', 'core'],
  ARRAY['12 Strict Pull-ups', '15 Deep Bar Dips'],
  'Both elbows must rotate over the bar simultaneously. Never perform chicken-wing (one arm at a time) transitions.',
  'muscle-up-animation.json',
  'published'
),
(
  'human-flag',
  'Human Flag',
  'Spectacular lateral lever holding the body completely horizontal using a vertical pole or stall bars.',
  'elite',
  'vertical_support',
  ARRAY['obliques', 'latissimus_dorsi', 'deltoids'],
  ARRAY['trapezius', 'forearms', 'intercostals'],
  ARRAY['15 Pull-ups', 'Side Plank 60s', 'Handstand 30s'],
  'Requires dedicated vertical pole or stall bars with solid structural anchoring. Bottom arm must lock straight.',
  'human-flag-animation.json',
  'published'
),
(
  'pistol-squat',
  'Pistol Squat',
  'The quintessential single-leg squat demanding extreme quad strength, ankle dorsiflexion, and balance.',
  'intermediate',
  'none',
  ARRAY['quadriceps', 'gluteus_maximus', 'hip_flexors'],
  ARRAY['calves', 'hamstrings', 'core'],
  ARRAY['20 Deep Bodyweight Squats', '30s Single-Leg Balance'],
  'Keep the working heel glued to the floor. Do not let the knee collapse inward (valgus collapse).',
  'pistol-squat-animation.json',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  prerequisites = EXCLUDED.prerequisites,
  safety_notes = EXCLUDED.safety_notes,
  animation_asset = EXCLUDED.animation_asset;

-- 6. Seed Progression Stages for all 8 Skills
-- 6.1 Handstand Stages
DO $$
DECLARE
  v_handstand_id UUID;
  v_planche_id UUID;
  v_front_lever_id UUID;
  v_back_lever_id UUID;
  v_l_sit_id UUID;
  v_muscle_up_id UUID;
  v_flag_id UUID;
  v_pistol_id UUID;
BEGIN
  SELECT id INTO v_handstand_id FROM public.skill_catalog WHERE slug = 'handstand';
  SELECT id INTO v_planche_id FROM public.skill_catalog WHERE slug = 'planche';
  SELECT id INTO v_front_lever_id FROM public.skill_catalog WHERE slug = 'front-lever';
  SELECT id INTO v_back_lever_id FROM public.skill_catalog WHERE slug = 'back-lever';
  SELECT id INTO v_l_sit_id FROM public.skill_catalog WHERE slug = 'l-sit';
  SELECT id INTO v_muscle_up_id FROM public.skill_catalog WHERE slug = 'muscle-up';
  SELECT id INTO v_flag_id FROM public.skill_catalog WHERE slug = 'human-flag';
  SELECT id INTO v_pistol_id FROM public.skill_catalog WHERE slug = 'pistol-squat';

  -- HANDSTAND PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_handstand_id, 'handstand', 1, 'handstand-wrist-prep', 'Wrist Preparation', 'Condition wrists in flexion, extension, and circular loading.', 'hold_seconds', 30, ARRAY[]::TEXT[], ARRAY['Spread fingers wide', 'Shift weight forward gently'], 'Never bounce forcefully into joint end-range', 'handstand-animation.json', 'Perform 3 sets of 30s pain-free forward wrist leaning.'),
  (v_handstand_id, 'handstand', 2, 'handstand-pike-hold', 'Pike Hold', 'Elevate hips over shoulders on floor or low box to load overhead pressing pattern.', 'hold_seconds', 30, ARRAY['Wrist Preparation']::TEXT[], ARRAY['Look between feet', 'Push floor away aggressively'], 'Step down if shoulders fatigue', 'pike-pushup-animation.json', 'Accumulate 3 sets of 30s elevated pike hold with active shoulder shrug.'),
  (v_handstand_id, 'handstand', 3, 'handstand-back-to-wall', 'Wall-Supported Handstand', 'Kick up with back to wall to acclimate to full inversion.', 'hold_seconds', 30, ARRAY['Pike Hold']::TEXT[], ARRAY['Keep arms locked like pillars', 'Glutes tight'], 'Bail by lowering feet down one at a time', 'handstand-animation.json', 'Complete 30s hold with locked arms without back arching.'),
  (v_handstand_id, 'handstand', 4, 'handstand-chest-to-wall', 'Chest-to-Wall Handstand', 'Wall-climb up facing the wall to enforce strict hollow alignment.', 'hold_seconds', 45, ARRAY['Wall-Supported Handstand']::TEXT[], ARRAY['Nose and toes only touching wall', 'Shoulders to ears'], 'Maintain core hollow tension', 'handstand-animation.json', 'Strict 45s chest-to-wall hold with zero spinal arching.'),
  (v_handstand_id, 'handstand', 5, 'handstand-balance-taps', 'Controlled Balance Practice', 'Pull toes off wall using fingertip pressure to find balance float.', 'hold_seconds', 20, ARRAY['Chest-to-Wall Handstand']::TEXT[], ARRAY['Grip floor like climbing a rock', 'Slightly bend fingers at knuckles'], 'Step down before complete exhaustion', 'handstand-animation.json', 'Achieve 5 controlled 5-second balance floats off the wall.'),
  (v_handstand_id, 'handstand', 6, 'handstand-freestanding', 'Freestanding Handstand', 'Kick up into open space with independent balance micro-adjustments.', 'hold_seconds', 15, ARRAY['Controlled Balance Practice']::TEXT[], ARRAY['Shoulders open over wrists', 'Toes pointed to ceiling'], 'Cartwheel bail when balance is lost forward', 'handstand-animation.json', 'Consistent 15s freestanding hold across 3 separate attempts.');

  -- PLANCHE PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_planche_id, 'planche', 1, 'planche-wrist-prep', 'Wrist Preparation', 'Condition wrists for extreme forward angle loading.', 'hold_seconds', 30, ARRAY[]::TEXT[], ARRAY['Turn hands out 45 degrees', 'Gently pulse forward'], 'Do not rush tendon adaptation', 'planche-animation.json', '30s forward lean on hands with zero wrist pain.'),
  (v_planche_id, 'planche', 2, 'planche-lean', 'Planche Lean', 'Straight-arm plank with shoulders leaning ahead of wrists.', 'hold_seconds', 30, ARRAY['Wrist Preparation']::TEXT[], ARRAY['Protract scapulae like a dome', 'Arms locked 100% straight'], 'Do not allow elbows to bend', 'planche-animation.json', '30s hold with shoulders 2+ inches past wrists and locked elbows.'),
  (v_planche_id, 'planche', 3, 'planche-frog-stand', 'Frog Stand', 'Balance on bent arms with knees resting on outer elbows.', 'hold_seconds', 30, ARRAY['Planche Lean']::TEXT[], ARRAY['Shift weight into hands', 'Lift toes off ground'], 'Place cushion in front if afraid of tipping', 'crow-pose-animation.json', '30s stable balance without feet touching ground.'),
  (v_planche_id, 'planche', 4, 'planche-tuck', 'Tuck Planche', 'Lift body horizontally with knees tucked to chest and straight arms.', 'hold_seconds', 15, ARRAY['Frog Stand', 'Planche Lean']::TEXT[], ARRAY['Straight locked arms', 'Dome the upper back'], 'Stop immediately if biceps tendon pinches', 'planche-animation.json', '15s hold with hips level with shoulders and straight arms.'),
  (v_planche_id, 'planche', 5, 'planche-advanced-tuck', 'Advanced Tuck Planche', 'Open hip angle to 90 degrees with flat horizontal back.', 'hold_seconds', 12, ARRAY['Tuck Planche']::TEXT[], ARRAY['Flatten lower back', 'Keep shoulders forward of wrists'], 'High tendon load', 'planche-animation.json', '12s clean advanced tuck hold with horizontal spine.'),
  (v_planche_id, 'planche', 6, 'planche-straddle', 'Straddle Planche', 'Extend legs wide horizontally with body locked parallel to floor.', 'hold_seconds', 10, ARRAY['Advanced Tuck Planche']::TEXT[], ARRAY['Squeeze glutes', 'Depress and protract shoulders'], 'Elite skill level', 'planche-animation.json', '10s straddle planche with horizontal line.');

  -- FRONT LEVER PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_front_lever_id, 'front-lever', 1, 'front-lever-scapular-prep', 'Scapular Preparation', 'Straight-arm hanging depression and retraction pulses.', 'repetitions', 10, ARRAY[]::TEXT[], ARRAY['Pull shoulder blades down to back pockets', 'Zero elbow bend'], 'Keep neck neutral', 'dead-hang-animation.json', '3 sets of 10 smooth scapular retractions on bar.'),
  (v_front_lever_id, 'front-lever', 2, 'front-lever-tuck', 'Tuck Front Lever', 'Horizontal hold with knees tucked tightly to chest.', 'hold_seconds', 20, ARRAY['Scapular Preparation']::TEXT[], ARRAY['Pull down on bar like straight-arm pulldown', 'Back flat to floor'], 'Do not drop suddenly', 'front-lever-animation.json', '20s horizontal hold with flat back.'),
  (v_front_lever_id, 'front-lever', 3, 'front-lever-advanced-tuck', 'Advanced Tuck Front Lever', 'Open hip angle to 90 degrees with horizontal spine.', 'hold_seconds', 15, ARRAY['Tuck Front Lever']::TEXT[], ARRAY['Knees away from chest', 'Engage glutes to hold hip height'], 'Maintain straight elbows', 'front-lever-animation.json', '15s hold with 90-degree hip angle and horizontal back.'),
  (v_front_lever_id, 'front-lever', 4, 'front-lever-one-leg', 'One-Leg Front Lever', 'Extend one leg straight while keeping the other tucked.', 'hold_seconds', 12, ARRAY['Advanced Tuck Front Lever']::TEXT[], ARRAY['Point extended toe', 'Alternate legs between sets'], 'Avoid hip rotation', 'front-lever-animation.json', '12s hold per leg with straight horizontal alignment.'),
  (v_front_lever_id, 'front-lever', 5, 'front-lever-straddle', 'Straddle Front Lever', 'Extend both legs wide in straddle to shorten lever arm.', 'hold_seconds', 10, ARRAY['One-Leg Front Lever']::TEXT[], ARRAY['Spread legs as wide as possible', 'Lock quads and glutes'], 'Keep chest elevated', 'front-lever-animation.json', '10s horizontal straddle hold.'),
  (v_front_lever_id, 'front-lever', 6, 'front-lever-full', 'Full Front Lever', 'Full straight-leg horizontal isometric hold.', 'hold_seconds', 8, ARRAY['Straddle Front Lever']::TEXT[], ARRAY['Ankles, hips, and shoulders in one straight line', 'Drive bar toward hips'], 'Maximum pulling tension', 'front-lever-animation.json', '8s strict full front lever hold.');

  -- BACK LEVER PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_back_lever_id, 'back-lever', 1, 'back-lever-shoulder-prep', 'Shoulder Preparation', 'Passive and active shoulder extension stretching and hangs.', 'hold_seconds', 30, ARRAY[]::TEXT[], ARRAY['Slowly rotate shoulders', 'Breathe deeply'], 'Never force shoulder extension if sharp pain occurs', 'dead-hang-animation.json', '30s pain-free shoulder extension hold.'),
  (v_back_lever_id, 'back-lever', 2, 'back-lever-german-hang', 'German Hang Preparation', 'Skin the cat through bar and hang in deep shoulder extension.', 'hold_seconds', 20, ARRAY['Shoulder Preparation']::TEXT[], ARRAY['Lower under full control', 'Feet off floor'], 'Step down carefully', 'back-lever-animation.json', '20s comfortable German Hang hold.'),
  (v_back_lever_id, 'back-lever', 3, 'back-lever-tuck', 'Tuck Back Lever', 'Horizontal hold facing floor with knees tucked to chest.', 'hold_seconds', 20, ARRAY['German Hang Preparation']::TEXT[], ARRAY['Pull up from German Hang to horizontal', 'Back parallel to ground'], 'Maintain active tension', 'back-lever-animation.json', '20s horizontal tuck back lever hold.'),
  (v_back_lever_id, 'back-lever', 4, 'back-lever-advanced-tuck', 'Advanced Tuck Back Lever', 'Open hips to 90 degrees with horizontal bodyline.', 'hold_seconds', 15, ARRAY['Tuck Back Lever']::TEXT[], ARRAY['Push chest forward', 'Flatten lower back'], 'Engage lats and chest', 'back-lever-animation.json', '15s hold with horizontal back.'),
  (v_back_lever_id, 'back-lever', 5, 'back-lever-straddle', 'Straddle Back Lever', 'Straddle legs wide to decrease leverage resistance.', 'hold_seconds', 10, ARRAY['Advanced Tuck Back Lever']::TEXT[], ARRAY['Spread legs wide', 'Point toes'], 'Avoid hyper-extending neck', 'back-lever-animation.json', '10s straddle back lever hold.'),
  (v_back_lever_id, 'back-lever', 6, 'back-lever-full', 'Full Back Lever', 'Complete horizontal straight-body suspension hold.', 'hold_seconds', 8, ARRAY['Straddle Back Lever']::TEXT[], ARRAY['Straight line from head to heels', 'Protracted shoulders'], 'Full joint extension', 'back-lever-animation.json', '8s full horizontal back lever hold.');

  -- L-SIT PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_l_sit_id, 'l-sit', 1, 'l-sit-seated-compression', 'Seated Compression', 'Floor seated forward fold leg lifts to develop hip flexor compression.', 'repetitions', 15, ARRAY[]::TEXT[], ARRAY['Hands by knees', 'Lift straight legs off floor'], 'Keep back straight as possible', 'l-sit-animation.json', '3 sets of 15 clean compression pulses.'),
  (v_l_sit_id, 'l-sit', 2, 'l-sit-tuck-support', 'Tuck Support', 'Depress floor with palms, lift hips and tucked knees clear of ground.', 'hold_seconds', 20, ARRAY['Seated Compression']::TEXT[], ARRAY['Lock elbows 100% straight', 'Depress shoulders down'], 'Avoid resting weight on wrists improperly', 'l-sit-animation.json', '20s clean floor tuck support hold.'),
  (v_l_sit_id, 'l-sit', 3, 'l-sit-one-leg', 'One-Leg Extension', 'Extend one leg straight parallel to floor while keeping one tucked.', 'hold_seconds', 15, ARRAY['Tuck Support']::TEXT[], ARRAY['Quad locked tight on extended leg', 'Alternate legs'], 'Keep hips elevated', 'l-sit-animation.json', '15s hold per leg without feet touching floor.'),
  (v_l_sit_id, 'l-sit', 4, 'l-sit-full', 'Full L-Sit', 'Both legs straight and parallel to floor at 90 degrees.', 'hold_seconds', 10, ARRAY['One-Leg Extension']::TEXT[], ARRAY['Push floor away', 'Toes pointed forward'], 'Do not let hips sag', 'l-sit-animation.json', '10s full L-sit hold with parallel legs.'),
  (v_l_sit_id, 'l-sit', 5, 'l-sit-extended', 'Extended Hold', 'Sustained strict 20-second L-sit hold with locked knees.', 'hold_seconds', 20, ARRAY['Full L-Sit']::TEXT[], ARRAY['Consistent breathing', 'Quad lock'], 'Avoid cramping', 'l-sit-animation.json', '20s continuous hold with clean form.'),
  (v_l_sit_id, 'l-sit', 6, 'l-sit-v-sit', 'V-Sit Progression', 'Compress body until legs elevate past 45 degrees into V shape.', 'hold_seconds', 10, ARRAY['Extended Hold']::TEXT[], ARRAY['Lean torso slightly back', 'Pull legs toward chest'], 'Advanced compression', 'l-sit-animation.json', '10s V-sit hold with toes above hip height.');

  -- MUSCLE-UP PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_muscle_up_id, 'muscle-up', 1, 'muscle-up-pull-strength', 'Pulling Strength Preparation', 'Explosive high chest-to-bar pull-ups.', 'repetitions', 8, ARRAY[]::TEXT[], ARRAY['Pull bar to sternum', 'Drive elbows backward'], 'Avoid swinging', 'pullup-animation.json', '3 sets of 8 chest-to-bar pull-ups.'),
  (v_muscle_up_id, 'muscle-up', 2, 'muscle-up-high-pull', 'High Pull-up Progression', 'Pull explosively to belly-button height with false grip.', 'repetitions', 5, ARRAY['Pulling Strength Preparation']::TEXT[], ARRAY['Wrap thumbs over bar or false grip', 'Fast concentric drive'], 'Do not kip with knees', 'muscle-up-animation.json', '5 consecutive pulls clearing sternum over bar.'),
  (v_muscle_up_id, 'muscle-up', 3, 'muscle-up-transition', 'Transition Technique', 'Low bar or box assisted rapid elbow turnover over bar.', 'repetitions', 5, ARRAY['High Pull-up Progression']::TEXT[], ARRAY['Roll both elbows simultaneously over bar', 'Lean chest over bar'], 'Never chicken-wing (one elbow first)', 'muscle-up-animation.json', '5 smooth simultaneous elbow turnovers.'),
  (v_muscle_up_id, 'muscle-up', 4, 'muscle-up-straight-bar-dip', 'Straight-Bar Dip Preparation', 'Deep dips on a single straight bar down to lower ribs.', 'repetitions', 8, ARRAY['Transition Technique']::TEXT[], ARRAY['Lower chest to touch bar', 'Lockout completely at top'], 'Lean forward to balance', 'muscle-up-animation.json', '3 sets of 8 deep straight-bar dips.'),
  (v_muscle_up_id, 'muscle-up', 5, 'muscle-up-assisted', 'Assisted Muscle-up', 'Jumping or light band-assisted full muscle-up execution.', 'repetitions', 3, ARRAY['Straight-Bar Dip Preparation']::TEXT[], ARRAY['Pull, roll, and press in one fluid motion'], 'Control the descent', 'muscle-up-animation.json', '3 clean assisted reps with simultaneous turnover.'),
  (v_muscle_up_id, 'muscle-up', 6, 'muscle-up-full', 'Full Strict Muscle-up', 'Unassisted strict muscle-up from dead hang to bar dip lockout.', 'repetitions', 3, ARRAY['Assisted Muscle-up']::TEXT[], ARRAY['Dead hang start', 'Explosive pull to hips', 'Dip lockout'], 'Zero chicken-winging', 'muscle-up-animation.json', '3 consecutive strict muscle-ups without kipping.');

  -- HUMAN FLAG PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_flag_id, 'human-flag', 1, 'human-flag-grip-prep', 'Equipment & Grip Preparation', 'Dual vertical pole grip (bottom arm push, top arm pull) isometric hold.', 'hold_seconds', 30, ARRAY[]::TEXT[], ARRAY['Bottom hand points down', 'Top hand points up'], 'Verify pole stability before loading', 'human-flag-animation.json', '30s pain-free vertical grip support hold.'),
  (v_flag_id, 'human-flag', 2, 'human-flag-vertical-support', 'Vertical Support Holds', 'Align body vertically along pole with arms locked.', 'hold_seconds', 20, ARRAY['Equipment & Grip Preparation']::TEXT[], ARRAY['Bottom elbow locked straight', 'Top arm pulling toward head'], 'Do not bend bottom elbow', 'human-flag-animation.json', '20s vertical flag hold with rigid arms.'),
  (v_flag_id, 'human-flag', 3, 'human-flag-assisted', 'Assisted Flag Progression', 'Diagonal flag hold with low elevation or foot support.', 'hold_seconds', 15, ARRAY['Vertical Support Holds']::TEXT[], ARRAY['Press floor away through bottom palm', 'Obliques braced'], 'Control the dismount', 'human-flag-animation.json', '15s diagonal hold at 45 degrees.'),
  (v_flag_id, 'human-flag', 4, 'human-flag-tuck', 'Tuck Flag', 'Knees tucked into chest, body held horizontally perpendicular to pole.', 'hold_seconds', 10, ARRAY['Assisted Flag Progression']::TEXT[], ARRAY['Both arms rigid', 'Torso parallel to floor'], 'High oblique shear forces', 'human-flag-animation.json', '10s horizontal tuck flag hold.'),
  (v_flag_id, 'human-flag', 5, 'human-flag-straddle', 'Straddle Flag', 'Extend legs in wide straddle horizontally to decrease lever.', 'hold_seconds', 8, ARRAY['Tuck Flag']::TEXT[], ARRAY['Spread legs wide', 'Squeeze bottom glute'], 'Keep shoulders stacked', 'human-flag-animation.json', '8s horizontal straddle flag hold.'),
  (v_flag_id, 'human-flag', 6, 'human-flag-full', 'Full Human Flag', 'Full straight-leg horizontal lever perpendicular to pole.', 'hold_seconds', 5, ARRAY['Straddle Flag']::TEXT[], ARRAY['Complete horizontal line', 'Feet together, toes pointed'], 'Mastery level lateral lever', 'human-flag-animation.json', '5s strict horizontal human flag hold.');

  -- PISTOL SQUAT PROGRESSIONS
  INSERT INTO public.skill_progressions (skill_id, skill_slug, stage_order, stage_slug, stage_name, description, target_type, target_value, prerequisites, technique_cues, safety_notes, animation_asset, assessment_criteria) VALUES
  (v_pistol_id, 'pistol-squat', 1, 'pistol-squat-supported', 'Supported Single-Leg Squat', 'Single-leg squat holding doorframe or chair for balance assist.', 'repetitions', 8, ARRAY[]::TEXT[], ARRAY['Working heel glued to floor', 'Descend to parallel'], 'Do not let knee collapse inward', 'pistol-squat-animation.json', '8 clean reps per leg with light touch assist.'),
  (v_pistol_id, 'pistol-squat', 2, 'pistol-squat-box-assisted', 'Box-Assisted Progression', 'Descend on one leg to knee-height bench or chair, pause, stand.', 'repetitions', 6, ARRAY['Supported Single-Leg Squat']::TEXT[], ARRAY['Sit back under control', 'No bouncing off bench'], 'Keep chest proud', 'pistol-squat-animation.json', '6 controlled reps per leg to chair height.'),
  (v_pistol_id, 'pistol-squat', 3, 'pistol-squat-counterbalance', 'Counterbalanced Squat', 'Perform unassisted pistol squat holding a 5lb object out front.', 'repetitions', 6, ARRAY['Box-Assisted Progression']::TEXT[], ARRAY['Reach weight forward to counter hips', 'Full ankle flexion'], 'Ensure ankle dorsiflexion is warm', 'pistol-squat-animation.json', '6 full depth reps with counterbalance.'),
  (v_pistol_id, 'pistol-squat', 4, 'pistol-squat-controlled', 'Controlled Pistol Squat', 'Full depth unassisted pistol squat with 3-second eccentric tempo.', 'repetitions', 5, ARRAY['Counterbalanced Squat']::TEXT[], ARRAY['3-second descent', 'Explode out of the bottom'], 'Never collapse into ankle', 'pistol-squat-animation.json', '5 slow tempo reps per leg.'),
  (v_pistol_id, 'pistol-squat', 5, 'pistol-squat-full', 'Full Pistol Squat', 'Classic full unilateral bodyweight squat to complete lockout.', 'repetitions', 5, ARRAY['Controlled Pistol Squat']::TEXT[], ARRAY['Hamstring touches calf', 'Airborne leg parallel to floor'], 'Keep foot planted', 'pistol-squat-animation.json', '5 consecutive strict unassisted reps per leg.'),
  (v_pistol_id, 'pistol-squat', 6, 'pistol-squat-advanced', 'Advanced Pistol Squat', 'Elevated surface or hands-behind-back advanced pistol mastery.', 'repetitions', 8, ARRAY['Full Pistol Squat']::TEXT[], ARRAY['Total balance control', 'Effortless continuous reps'], 'Elite unilateral stability', 'pistol-squat-animation.json', '8 unbroken clean reps per leg.');

END $$;

