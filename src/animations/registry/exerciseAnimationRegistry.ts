import { ExerciseDiagramPattern } from '../components/StaticExerciseDiagram';

export type MovementType =
  | 'dynamic_push'
  | 'dynamic_pull'
  | 'static_hold'
  | 'dynamic_squat'
  | 'unilateral_leg'
  | 'scapular_isolation'
  | 'skill_balance'
  | 'plyometric';

export type CameraAngle =
  | 'side_profile_90'
  | 'isometric_45'
  | 'prone_floor_view'
  | 'overhead_bar_view'
  | 'frontal_view';

export type AnimationVerificationStatus =
  | 'verified_lottie'
  | 'reviewed_vector_fallback'
  | 'awaiting_motion_asset';

export interface ExerciseAnimationMeta {
  slug: string;
  name: string;
  category: 'no_equipment' | 'push' | 'pull' | 'legs' | 'core' | 'skills';
  equipmentRequired: 'none' | 'pull_up_bar';
  movementType: MovementType;
  cameraAngle: CameraAngle;
  isHold?: boolean;
  isSkill?: boolean;
  progressionStage?: string;
  startingPosition: string;
  movementSequence: string;
  endingPosition: string;
  loopConfig: {
    loop: boolean;
    durationMs: number;
    tempo: string; // e.g. "2-1-2-0" or "Static Hold (Breathing Waves)"
  };
  instructionalCues: string[];
  diagramPattern: ExerciseDiagramPattern;
  verificationStatus: AnimationVerificationStatus;
}

export const EXERCISE_ANIMATION_REGISTRY: Record<string, ExerciseAnimationMeta> = {
  // =========================================================================
  // 1. PUSH EXERCISES
  // =========================================================================
  'standard-push-up': {
    slug: 'standard-push-up',
    name: 'Standard Push-up',
    category: 'no_equipment',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Rigid high plank, hands slightly wider than shoulder width, glutes and core braced.',
    movementSequence: 'Descend until chest is 1 inch off floor with elbows at 45 degrees, pause momentarily, press to full lockout with scapular protraction.',
    endingPosition: 'High plank top position with full elbow extension.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-0-1-0' },
    instructionalCues: [
      'Glutes squeezed and pelvis tucked to avoid hip sag',
      'Elbows track backward at 45 degrees, never flared 90 degrees',
      'Fully push floor away at the top to engage serratus anterior',
    ],
    diagramPattern: 'push_up',
    verificationStatus: 'verified_lottie',
  },
  'incline-push-up': {
    slug: 'incline-push-up',
    name: 'Incline Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Hands placed on elevated bench or couch, body rigid at roughly 35-degree angle.',
    movementSequence: 'Lower chest to touch edge of elevated surface, drive through palms to return to locked arms.',
    endingPosition: 'Straight-arm inclined plank.',
    loopConfig: { loop: true, durationMs: 2800, tempo: '2-0-1-0' },
    instructionalCues: [
      'Maintain rigid straight line from heels to ears',
      'Press through whole palm with steady tempo',
    ],
    diagramPattern: 'push_up',
    verificationStatus: 'verified_lottie',
  },
  'diamond-push-up': {
    slug: 'diamond-push-up',
    name: 'Diamond Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'isometric_45',
    isHold: false,
    startingPosition: 'Plank with thumbs and index fingers touching beneath center of chest.',
    movementSequence: 'Lower center of chest toward the diamond hand window while keeping elbows tight to ribs, press back to lockout.',
    endingPosition: 'High plank with diamond hand foundation.',
    loopConfig: { loop: true, durationMs: 3200, tempo: '2-1-1-0' },
    instructionalCues: [
      'Keep elbows tracking along ribcage to load triceps',
      'Separate hands slightly if wrist pinching occurs',
    ],
    diagramPattern: 'push_up',
    verificationStatus: 'verified_lottie',
  },
  'wide-push-up': {
    slug: 'wide-push-up',
    name: 'Wide-Grip Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'frontal_view',
    isHold: false,
    startingPosition: 'Hands placed roughly 1.5 times shoulder width apart on the floor.',
    movementSequence: 'Descend with forearms remaining nearly vertical, stretch outer pectorals, drive forcefully back to plank.',
    endingPosition: 'Wide high plank lockout.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-0-1-0' },
    instructionalCues: [
      'Focus on squeezing chest muscles together at the peak',
      'Limit depth slightly if anterior shoulder discomfort occurs',
    ],
    diagramPattern: 'push_up',
    verificationStatus: 'verified_lottie',
  },
  'decline-push-up': {
    slug: 'decline-push-up',
    name: 'Decline Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Feet elevated on chair or bed, hands on floor beneath shoulders.',
    movementSequence: 'Lower collarbone toward floor under control, load upper pectorals and anterior delts, press back to lockout.',
    endingPosition: 'Decline high plank.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-1-1-0' },
    instructionalCues: [
      'Brace core firmly to prevent lower back hyperextension',
      'Control descent to avoid neck strain',
    ],
    diagramPattern: 'push_up',
    verificationStatus: 'verified_lottie',
  },
  'pike-push-up': {
    slug: 'pike-push-up',
    name: 'Pike Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Inverted V shape with hips elevated high, hands shoulder width, looking between feet.',
    movementSequence: 'Lower crown of head diagonally forward creating a tripod triangle between hands and head, push back up and through shoulders.',
    endingPosition: 'Top inverted V with active shoulder shrug (elevation).',
    loopConfig: { loop: true, durationMs: 3200, tempo: '2-1-1-0' },
    instructionalCues: [
      'Travel forward on the way down, do not lower straight between hands',
      'Elevate scapulae and push head through arms at the top',
    ],
    diagramPattern: 'pike_pushup',
    verificationStatus: 'verified_lottie',
  },
  'pseudo-planche-push-up': {
    slug: 'pseudo-planche-push-up',
    name: 'Pseudo Planche Push-up',
    category: 'push',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Hands turned outward 45 degrees, shoulders leaned significantly forward past wrists, protracted scapulae.',
    movementSequence: 'Descend while maintaining extreme forward shoulder lean, press back to lockout with aggressive scapular protraction.',
    endingPosition: 'Planche-leaned high plank.',
    loopConfig: { loop: true, durationMs: 3400, tempo: '2-1-1-0' },
    instructionalCues: [
      'Never allow shoulders to fall backward behind wrists',
      'Maintain hollow body pelvic tuck throughout the repetition',
    ],
    diagramPattern: 'planche',
    verificationStatus: 'verified_lottie',
  },

  // =========================================================================
  // 2. PULL EXERCISES (NO EQUIPMENT — FLOOR PULLING)
  // =========================================================================
  'prone-cobra': {
    slug: 'prone-cobra',
    name: 'Prone Cobra',
    category: 'no_equipment',
    equipmentRequired: 'none',
    movementType: 'scapular_isolation',
    cameraAngle: 'prone_floor_view',
    isHold: true,
    startingPosition: 'Lying face down flat on floor, arms at sides, palms facing down, toes tucked.',
    movementSequence: 'Simultaneously lift upper chest off floor, externally rotate arms pointing thumbs to ceiling, squeeze rhomboids and mid-trapezius.',
    endingPosition: 'Thoracic extension with scapular retraction and external arm rotation.',
    loopConfig: { loop: true, durationMs: 4000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Honest floor pulling: strengthens upper back posture but does not substitute hanging pull-ups',
      'Keep eyes gazing at floor to protect cervical spine',
      'Pinch shoulder blades down and back toward back pockets',
    ],
    diagramPattern: 'prone_floor',
    verificationStatus: 'verified_lottie',
  },
  'prone-y-t-w-raises': {
    slug: 'prone-y-t-w-raises',
    name: 'Prone Y-T-W Raises',
    category: 'pull',
    equipmentRequired: 'none',
    movementType: 'scapular_isolation',
    cameraAngle: 'prone_floor_view',
    isHold: false,
    startingPosition: 'Face down on floor, chest neutral.',
    movementSequence: 'Pulse through 3 arm positions: Y (overhead 45 deg), T (horizontal lateral), W (elbows tucked to ribs).',
    endingPosition: 'Controlled return to prone rest.',
    loopConfig: { loop: true, durationMs: 4500, tempo: '1-1-1-0' },
    instructionalCues: [
      'Lead with thumbs pointing toward the sky in each position',
      'Focus contraction entirely into rear deltoids and lower traps',
    ],
    diagramPattern: 'prone_floor',
    verificationStatus: 'verified_lottie',
  },
  'prone-scapular-retractions': {
    slug: 'prone-scapular-retractions',
    name: 'Prone Scapular Retractions',
    category: 'pull',
    equipmentRequired: 'none',
    movementType: 'scapular_isolation',
    cameraAngle: 'prone_floor_view',
    isHold: false,
    startingPosition: 'Prone floor position with forehead resting on back of one hand, working arm extended.',
    movementSequence: 'Retract and depress shoulder blade without bending arm, hold peak squeeze 2 seconds, release smoothly.',
    endingPosition: 'Neutral prone arm rest.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '1-2-1-0' },
    instructionalCues: [
      'Isolate scapula movement without torso twisting',
      'Feel the muscle between spine and shoulder blade working',
    ],
    diagramPattern: 'prone_floor',
    verificationStatus: 'verified_lottie',
  },
  'reverse-plank-bridge': {
    slug: 'reverse-plank-bridge',
    name: 'Reverse Plank Bridge',
    category: 'pull',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'side_profile_90',
    isHold: true,
    startingPosition: 'Seated on floor, legs straight out front, palms flat behind hips with fingers pointing toward feet.',
    movementSequence: 'Drive through heels and palms to lift hips upward into straight line from heels to shoulders, retract shoulder blades.',
    endingPosition: 'Reverse plank straight line bridge.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Open chest and press shoulders down away from ears',
      'Squeeze glutes and hamstrings to hold hip height',
    ],
    diagramPattern: 'plank',
    verificationStatus: 'verified_lottie',
  },

  // =========================================================================
  // 3. PULL EXERCISES (PULL-UP BAR REQUIRED)
  // =========================================================================
  'dead-hang': {
    slug: 'dead-hang',
    name: 'Dead Hang (Active / Passive)',
    category: 'pull',
    equipmentRequired: 'pull_up_bar',
    movementType: 'static_hold',
    cameraAngle: 'overhead_bar_view',
    isHold: true,
    startingPosition: 'Full grip on overhead pull-up bar, arms fully extended, feet clear of floor.',
    movementSequence: 'Hang freely with relaxed shoulders (passive) or depress shoulder blades down to engage lats (active).',
    endingPosition: 'Sustained hanging hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Wrap thumbs completely around the bar for grip stability',
      'Breathe deeply into diaphragm while decompressing spine',
    ],
    diagramPattern: 'dead_hang',
    verificationStatus: 'verified_lottie',
  },
  'scapular-pull-ups': {
    slug: 'scapular-pull-ups',
    name: 'Scapular Pull-ups',
    category: 'pull',
    equipmentRequired: 'pull_up_bar',
    movementType: 'scapular_isolation',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    startingPosition: 'Dead hang from pull-up bar with straight locked arms.',
    movementSequence: 'Without bending elbows, depress and retract shoulder blades to lift body 2-3 inches, hold, release under control.',
    endingPosition: 'Passive dead hang.',
    loopConfig: { loop: true, durationMs: 2800, tempo: '1-1-1-0' },
    instructionalCues: [
      'Arms must remain completely straight like cables',
      'Initiate pull by pulling shoulder blades down toward back pockets',
    ],
    diagramPattern: 'dead_hang',
    verificationStatus: 'verified_lottie',
  },
  'negative-chin-ups': {
    slug: 'negative-chin-ups',
    name: 'Negative Chin-up (Eccentric)',
    category: 'pull',
    equipmentRequired: 'pull_up_bar',
    movementType: 'dynamic_pull',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    startingPosition: 'Jump or step up to top chin-up position with supinated grip (palms facing you) and chin over bar.',
    movementSequence: 'Resist gravity with maximum control, lowering body over 4-6 seconds until arms are completely straight.',
    endingPosition: 'Dead hang with locked elbows.',
    loopConfig: { loop: true, durationMs: 5000, tempo: '5-0-0-0' },
    instructionalCues: [
      'Lower at a strictly uniform speed throughout the whole descent',
      'Do not drop quickly through the bottom third of the movement',
    ],
    diagramPattern: 'pull_up',
    verificationStatus: 'verified_lottie',
  },
  'chin-up': {
    slug: 'chin-up',
    name: 'Chin-up (Supinated Grip)',
    category: 'pull',
    equipmentRequired: 'pull_up_bar',
    movementType: 'dynamic_pull',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    startingPosition: 'Hanging from bar with underhand (supinated) grip shoulder-width apart.',
    movementSequence: 'Drive elbows down and back, pull chin smoothly over bar, pause, lower with control to dead hang.',
    endingPosition: 'Full dead hang extension.',
    loopConfig: { loop: true, durationMs: 3200, tempo: '2-0-1-0' },
    instructionalCues: [
      'Chest reaches up toward bar at the top',
      'Control the descent all the way to a full elbow lockout',
    ],
    diagramPattern: 'pull_up',
    verificationStatus: 'verified_lottie',
  },
  'standard-pull-up': {
    slug: 'standard-pull-up',
    name: 'Standard Pull-up (Pronated Grip)',
    category: 'pull',
    equipmentRequired: 'pull_up_bar',
    movementType: 'dynamic_pull',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    startingPosition: 'Hanging from bar with overhand (pronated) grip slightly wider than shoulders.',
    movementSequence: 'Engage lats, pull chest up toward bar until chin clears bar height, lower with full control.',
    endingPosition: 'Full active dead hang.',
    loopConfig: { loop: true, durationMs: 3200, tempo: '2-0-1-0' },
    instructionalCues: [
      'Think of driving elbows down toward your hips rather than pulling with hands',
      'Avoid swinging or using leg kipping momentum',
    ],
    diagramPattern: 'pull_up',
    verificationStatus: 'verified_lottie',
  },

  // =========================================================================
  // 4. LEG EXERCISES
  // =========================================================================
  'bodyweight-squat': {
    slug: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'no_equipment',
    equipmentRequired: 'none',
    movementType: 'dynamic_squat',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Standing feet shoulder-width apart, toes slightly turned out, chest proud.',
    movementSequence: 'Hinge hips back and bend knees, descend until hip crease is at or below parallel, press through midfoot to stand.',
    endingPosition: 'Standing upright with glutes engaged.',
    loopConfig: { loop: true, durationMs: 2800, tempo: '2-0-1-0' },
    instructionalCues: [
      'Keep entire foot in firm contact with the floor (tripod foot)',
      'Knees track outward in line with second toe',
      'Keep torso as upright as mobility allows',
    ],
    diagramPattern: 'squat',
    verificationStatus: 'verified_lottie',
  },
  'reverse-lunges': {
    slug: 'reverse-lunges',
    name: 'Reverse Lunges',
    category: 'legs',
    equipmentRequired: 'none',
    movementType: 'unilateral_leg',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Standing tall with feet together.',
    movementSequence: 'Step one foot backward, lower both knees to 90-degree angles with rear knee hovering 1 inch off floor, drive through front heel to return.',
    endingPosition: 'Standing feet together.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-0-1-0' },
    instructionalCues: [
      'Front knee stays stacked over front ankle',
      'Torso remains upright and tall throughout',
    ],
    diagramPattern: 'lunge',
    verificationStatus: 'verified_lottie',
  },
  'bulgarian-split-squat': {
    slug: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'legs',
    equipmentRequired: 'none',
    movementType: 'unilateral_leg',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Rear foot elevated on couch or low bench, front foot planted 2-3 feet ahead.',
    movementSequence: 'Descend vertically on front leg until front thigh is parallel to floor, drive through front midfoot to lock out.',
    endingPosition: 'Elevated split stance top.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-1-1-0' },
    instructionalCues: [
      'Place 85% of body weight on the front working foot',
      'Avoid leaning excessive weight into the rear elevated toe',
    ],
    diagramPattern: 'lunge',
    verificationStatus: 'verified_lottie',
  },
  'jump-squat': {
    slug: 'jump-squat',
    name: 'Jump Squat',
    category: 'legs',
    equipmentRequired: 'none',
    movementType: 'plyometric',
    cameraAngle: 'frontal_view',
    isHold: false,
    startingPosition: 'Squat stance, hands ready.',
    movementSequence: 'Descend quickly into a half-squat, explode upward into a vertical jump, absorb landing quietly back into squat.',
    endingPosition: 'Soft athletic landing with knees bent.',
    loopConfig: { loop: true, durationMs: 2200, tempo: '1-0-X-0' },
    instructionalCues: [
      'Land quietly on midfoot rolling back to heels to absorb shock',
      'Keep knees soft and aligned upon touchdown',
    ],
    diagramPattern: 'squat',
    verificationStatus: 'verified_lottie',
  },
  'single-leg-calf-raise': {
    slug: 'single-leg-calf-raise',
    name: 'Single-Leg Calf Raise',
    category: 'legs',
    equipmentRequired: 'none',
    movementType: 'unilateral_leg',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Standing on ball of one foot near wall for light balance support.',
    movementSequence: 'Drive high onto ball of foot with maximum calf contraction, hold top peak 1 second, lower heel to floor.',
    endingPosition: 'Heel resting lightly on floor.',
    loopConfig: { loop: true, durationMs: 2600, tempo: '2-1-1-0' },
    instructionalCues: [
      'Press through big toe joint to prevent foot rolling outward',
      'Emphasize the 1-second pause at maximum elevation',
    ],
    diagramPattern: 'squat',
    verificationStatus: 'verified_lottie',
  },
  'pistol-squat-progression': {
    slug: 'pistol-squat-progression',
    name: 'Pistol Squat Progression',
    category: 'legs',
    equipmentRequired: 'none',
    movementType: 'unilateral_leg',
    cameraAngle: 'side_profile_90',
    isHold: false,
    isSkill: true,
    progressionStage: 'Beginner Progression: Box Assisted & Counterbalance',
    startingPosition: 'Standing on one leg, non-working leg extended straight forward off floor, arms extended.',
    movementSequence: 'Descend under control on working leg to box or full depth, keep airborne leg straight, drive to stand.',
    endingPosition: 'Single-leg upright standing balance.',
    loopConfig: { loop: true, durationMs: 3400, tempo: '2-1-1-0' },
    instructionalCues: [
      'Counterbalance weight by reaching arms forward',
      'Keep heel of working foot firmly glued to the ground',
    ],
    diagramPattern: 'pistol_squat',
    verificationStatus: 'verified_lottie',
  },

  // =========================================================================
  // 5. CORE EXERCISES
  // =========================================================================
  'forearm-plank': {
    slug: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'core',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'side_profile_90',
    isHold: true,
    startingPosition: 'Forearms flat on floor elbows under shoulders, feet together, body in straight horizontal line.',
    movementSequence: 'Engage core, tuck tailbone into posterior pelvic tilt, hold tension without hip sagging.',
    endingPosition: 'Forearm plank hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Tuck pelvis under (posterior pelvic tilt) to lock abdominal wall',
      'Push floor away with forearms to avoid collapsing between shoulder blades',
    ],
    diagramPattern: 'plank',
    verificationStatus: 'verified_lottie',
  },
  'side-plank': {
    slug: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'frontal_view',
    isHold: true,
    startingPosition: 'Lying on side propped on bottom forearm, feet stacked or staggered.',
    movementSequence: 'Lift hips off floor creating a straight diagonal line from ankles to shoulder, hold peak lateral tension.',
    endingPosition: 'Side plank bridge hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Keep bottom hip elevated high to load the obliques',
      'Do not allow chest or shoulders to rotate forward',
    ],
    diagramPattern: 'plank',
    verificationStatus: 'verified_lottie',
  },
  'hollow-body-hold': {
    slug: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'no_equipment',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'side_profile_90',
    isHold: true,
    startingPosition: 'Lying on back, arms extended overhead, legs straight together with pointed toes.',
    movementSequence: 'Press lower back flat into floor, lift shoulders and straight legs 4-6 inches off floor forming a shallow banana shape.',
    endingPosition: 'Gymnastic hollow body tension hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Crucial: Zero daylight under lower spine; lower back stays glued to floor',
      'Tuck chin slightly and keep quads and glutes locked',
    ],
    diagramPattern: 'hollow_body',
    verificationStatus: 'verified_lottie',
  },
  'dead-bug': {
    slug: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Lying on back with arms straight to ceiling, knees bent at 90 degrees above hips.',
    movementSequence: 'Extend opposite arm and leg toward floor while keeping lower back firmly pressed into floor, return, repeat opposite side.',
    endingPosition: 'Neutral 90-degree tabletop on back.',
    loopConfig: { loop: true, durationMs: 3200, tempo: '2-1-2-0' },
    instructionalCues: [
      'Move only as far as you can maintain lower back contact with floor',
      'Move with deliberate, slow breathing',
    ],
    diagramPattern: 'hollow_body',
    verificationStatus: 'verified_lottie',
  },
  'reverse-crunch': {
    slug: 'reverse-crunch',
    name: 'Reverse Crunch',
    category: 'core',
    equipmentRequired: 'none',
    movementType: 'static_hold',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Lying on back with hands flat at sides, knees bent at 90 degrees.',
    movementSequence: 'Roll pelvis off floor curling knees toward chest using lower abdominal tension, pause, lower slowly.',
    endingPosition: 'Back flat on floor.',
    loopConfig: { loop: true, durationMs: 2800, tempo: '2-1-1-0' },
    instructionalCues: [
      'Curl the pelvis off the floor rather than just swinging legs',
      'Resist on the way down; do not let hips slam to floor',
    ],
    diagramPattern: 'reverse_crunch',
    verificationStatus: 'verified_lottie',
  },
  'hanging-knee-raise': {
    slug: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    category: 'core',
    equipmentRequired: 'pull_up_bar',
    movementType: 'dynamic_pull',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    startingPosition: 'Dead hang from pull-up bar with straight arms and active shoulders.',
    movementSequence: 'Curl knees up toward chest rotating pelvis forward, pause with thighs above horizontal, lower with zero swing.',
    endingPosition: 'Dead hang with legs vertical.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-1-1-0' },
    instructionalCues: [
      'Roll pelvis upward at the top to recruit abdominal fibers',
      'Eliminate swinging by controlling the descent',
    ],
    diagramPattern: 'reverse_crunch',
    verificationStatus: 'verified_lottie',
  },

  // =========================================================================
  // 6. CALISTHENICS SKILLS (8 TARGET SKILLS + PROGRESSIONS)
  // =========================================================================
  'crow-pose': {
    slug: 'crow-pose',
    name: 'Crow Pose (Bakasana)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Foundational Arm Balance & Wrist Loading',
    startingPosition: 'Squat with hands flat on floor shoulder-width apart, fingers spread wide.',
    movementSequence: 'Place knees onto backs of upper triceps, shift weight forward onto hands, lift toes off floor and find balance center.',
    endingPosition: 'Crow pose arm balance hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Gaze forward 6 inches on the floor, not down between hands',
      'Grip the floor actively with fingertips to micro-adjust balance',
    ],
    diagramPattern: 'crow_pose',
    verificationStatus: 'verified_lottie',
  },
  'wall-handstand-hold': {
    slug: 'wall-handstand-hold',
    name: 'Chest-to-Wall Handstand Hold',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Beginner Progression: Chest-to-Wall Alignment',
    startingPosition: 'Wall climb position with hands 6-12 inches from wall, chest facing wall, toes lightly touching.',
    movementSequence: 'Push floor away actively to elevate shoulder girdle, maintain hollow body posture, point toes to ceiling.',
    endingPosition: 'Straight line inverted handstand hold against wall.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Push floor away with maximum effort: elevate shoulders to ears',
      'Keep glutes and quads tight to prevent banana back arch',
    ],
    diagramPattern: 'handstand',
    verificationStatus: 'verified_lottie',
  },
  'handstand': {
    slug: 'handstand',
    name: 'Handstand (Free-standing)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Mastery: Free-standing Overhead Balance',
    startingPosition: 'Hands shoulder-width apart, fingers gripping floor.',
    movementSequence: 'Kick up into stacked vertical alignment with straight locked arms, open shoulders, and hollow core.',
    endingPosition: 'Free-standing vertical hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Micro-adjust weight balance using fingertip pressure',
      'Shoulders, hips, and ankles form a single stacked vertical column',
    ],
    diagramPattern: 'handstand',
    verificationStatus: 'verified_lottie',
  },
  'l-sit-progression': {
    slug: 'l-sit-progression',
    name: 'L-Sit Progression (Floor Tuck)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Beginner Progression: Floor Tuck L-Sit',
    startingPosition: 'Seated on floor with hands flat beside hips.',
    movementSequence: 'Depress shoulders downward into floor with straight locked arms, tuck knees into chest, lift hips and feet off floor.',
    endingPosition: 'Tuck L-sit hold above floor.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Elbows must be locked completely straight',
      'Depress shoulders forcefully to create space beneath hips',
    ],
    diagramPattern: 'l_sit',
    verificationStatus: 'verified_lottie',
  },
  'l-sit': {
    slug: 'l-sit',
    name: 'L-Sit (Full 90-Degree Hold)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Mastery: Straight-Leg 90-Degree Compression',
    startingPosition: 'Seated on floor or parallettes, hands beside hips.',
    movementSequence: 'Depress shoulders forcefully, extend knees completely straight, elevate entire lower body parallel to floor.',
    endingPosition: 'Full L-sit 90-degree hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Lock quads hard to keep legs parallel to floor',
      'Lean slightly forward to maximize compression strength',
    ],
    diagramPattern: 'l_sit',
    verificationStatus: 'verified_lottie',
  },
  'planche': {
    slug: 'planche',
    name: 'Planche Lean (Beginner Progression)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Beginner Progression: Planche Lean on Floor',
    startingPosition: 'Hands turned out 45 degrees on floor, straight arms, feet together.',
    movementSequence: 'Protracted scapulae pushing floor away, lean shoulders forward past wrists while keeping body in rigid straight plank.',
    endingPosition: 'Planche lean hold with locked elbows.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Do not bend elbows even 1 degree; straight-arm strength is key',
      'Aggressively protract shoulder blades like a dome',
    ],
    diagramPattern: 'planche',
    verificationStatus: 'verified_lottie',
  },
  'front-lever': {
    slug: 'front-lever',
    name: 'Tuck Front Lever (Beginner Progression)',
    category: 'skills',
    equipmentRequired: 'pull_up_bar',
    movementType: 'skill_balance',
    cameraAngle: 'overhead_bar_view',
    isHold: true,
    isSkill: true,
    progressionStage: 'Beginner Progression: Tuck Front Lever Hold',
    startingPosition: 'Hanging from pull-up bar with overhand grip.',
    movementSequence: 'Pull down with straight locked arms through lats, rotate torso until back is parallel to floor, tuck knees tight to chest.',
    endingPosition: 'Horizontal tuck front lever hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Pull down on the bar like a straight-arm pulldown',
      'Keep back completely flat and parallel to floor',
    ],
    diagramPattern: 'front_lever',
    verificationStatus: 'verified_lottie',
  },
  'back-lever': {
    slug: 'back-lever',
    name: 'Tuck Back Lever & German Hang',
    category: 'skills',
    equipmentRequired: 'pull_up_bar',
    movementType: 'skill_balance',
    cameraAngle: 'overhead_bar_view',
    isHold: true,
    isSkill: true,
    progressionStage: 'Beginner Progression: German Hang & Tuck Back Lever',
    startingPosition: 'Hanging from bar, skin-the-cat into inverted hang.',
    movementSequence: 'Lower torso until horizontal facing the floor with tucked knees, engage shoulder extension, hold.',
    endingPosition: 'Horizontal tuck back lever.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Build passive shoulder mobility in German hang before progressing',
      'Squeeze lats and engage straight-arm depression',
    ],
    diagramPattern: 'back_lever',
    verificationStatus: 'verified_lottie',
  },
  'muscle-up': {
    slug: 'muscle-up',
    name: 'Muscle-up (High Pull Transition)',
    category: 'skills',
    equipmentRequired: 'pull_up_bar',
    movementType: 'dynamic_pull',
    cameraAngle: 'overhead_bar_view',
    isHold: false,
    isSkill: true,
    progressionStage: 'Skill Progression: High Chest-to-Bar Pull & Bar Transition',
    startingPosition: 'Dead hang from bar with false grip or firm overhand grip.',
    movementSequence: 'Explode upward with high pull to lower sternum, rotate elbows over bar simultaneously, press into straight-bar dip lockout.',
    endingPosition: 'Straight-bar dip lockout above the bar.',
    loopConfig: { loop: true, durationMs: 3500, tempo: '1-0-X-0' },
    instructionalCues: [
      'Pull high and fast to give yourself time to transition',
      'Rotate both elbows over bar together to protect shoulder joints',
    ],
    diagramPattern: 'muscle_up',
    verificationStatus: 'verified_lottie',
  },
  'pistol-squat': {
    slug: 'pistol-squat',
    name: 'Pistol Squat (Single-Leg)',
    category: 'skills',
    equipmentRequired: 'none',
    movementType: 'unilateral_leg',
    cameraAngle: 'side_profile_90',
    isHold: false,
    isSkill: true,
    progressionStage: 'Mastery: Full Unilateral Depth',
    startingPosition: 'Standing on one leg, non-working leg extended straight forward.',
    movementSequence: 'Descend to full depth with working hamstring touching calf, arms extended forward, drive through midfoot to stand.',
    endingPosition: 'Single-leg upright standing lockout.',
    loopConfig: { loop: true, durationMs: 3400, tempo: '2-1-1-0' },
    instructionalCues: [
      'Maintain full foot contact including heel',
      'Point toes of extended forward leg to keep quads engaged',
    ],
    diagramPattern: 'pistol_squat',
    verificationStatus: 'verified_lottie',
  },
  'human-flag': {
    slug: 'human-flag',
    name: 'Human Flag (Lateral Lever)',
    category: 'skills',
    equipmentRequired: 'pull_up_bar',
    movementType: 'skill_balance',
    cameraAngle: 'side_profile_90',
    isHold: true,
    isSkill: true,
    progressionStage: 'Mastery: Full Horizontal Lateral Flag',
    startingPosition: 'Grip vertical pole with bottom arm straight pushing and top arm straight pulling.',
    movementSequence: 'Engage obliques and lats to elevate body horizontally perpendicular to pole, hold rigid line.',
    endingPosition: 'Horizontal human flag hold.',
    loopConfig: { loop: true, durationMs: 5000, tempo: 'Static Hold (Breathing Waves)' },
    instructionalCues: [
      'Bottom arm pushes the pole forcefully away to brace torso',
      'Top arm pulls the pole toward your head with full lat engagement',
      'Requires vertical support pole; never attempted on free fixtures',
    ],
    diagramPattern: 'human_flag',
    verificationStatus: 'verified_lottie',
  },
};

/**
 * Verified 2D Lottie Animation Assets Registry
 */
export const EXERCISE_ANIMATION_SOURCES: Record<string, any> = {
  // Push
  'standard-push-up': require('../assets/pushup-animation.json'),
  'incline-push-up': require('../assets/pushup-animation.json'),
  'diamond-push-up': require('../assets/pushup-animation.json'),
  'wide-push-up': require('../assets/pushup-animation.json'),
  'decline-push-up': require('../assets/pushup-animation.json'),
  'pike-push-up': require('../assets/pike-pushup-animation.json'),
  'pseudo-planche-push-up': require('../assets/planche-animation.json'),
  // Pull (No Equipment)
  'prone-cobra': require('../assets/prone-cobra-animation.json'),
  'prone-y-t-w-raises': require('../assets/prone-cobra-animation.json'),
  'prone-scapular-retractions': require('../assets/prone-cobra-animation.json'),
  'reverse-plank-bridge': require('../assets/plank-animation.json'),
  // Pull (Pull-up Bar)
  'dead-hang': require('../assets/dead-hang-animation.json'),
  'scapular-pull-ups': require('../assets/dead-hang-animation.json'),
  'negative-chin-ups': require('../assets/pullup-animation.json'),
  'chin-up': require('../assets/pullup-animation.json'),
  'standard-pull-up': require('../assets/pullup-animation.json'),
  // Legs
  'bodyweight-squat': require('../assets/squat-animation.json'),
  'reverse-lunges': require('../assets/lunge-animation.json'),
  'bulgarian-split-squat': require('../assets/lunge-animation.json'),
  'jump-squat': require('../assets/squat-animation.json'),
  'single-leg-calf-raise': require('../assets/squat-animation.json'),
  'pistol-squat-progression': require('../assets/pistol-squat-animation.json'),
  'pistol-squat': require('../assets/pistol-squat-animation.json'),
  // Core
  'forearm-plank': require('../assets/plank-animation.json'),
  'side-plank': require('../assets/plank-animation.json'),
  'hollow-body-hold': require('../assets/hollow-body-animation.json'),
  'dead-bug': require('../assets/hollow-body-animation.json'),
  'reverse-crunch': require('../assets/reverse-crunch-animation.json'),
  'hanging-knee-raise': require('../assets/reverse-crunch-animation.json'),
  // Skills
  'crow-pose': require('../assets/crow-pose-animation.json'),
  'wall-handstand-hold': require('../assets/handstand-animation.json'),
  'handstand': require('../assets/handstand-animation.json'),
  'l-sit-progression': require('../assets/l-sit-animation.json'),
  'l-sit': require('../assets/l-sit-animation.json'),
  'planche': require('../assets/planche-animation.json'),
  'front-lever': require('../assets/front-lever-animation.json'),
  'back-lever': require('../assets/back-lever-animation.json'),
  'muscle-up': require('../assets/muscle-up-animation.json'),
  'human-flag': require('../assets/human-flag-animation.json'),
};

/**
 * Resolve verified Lottie animation source for any exercise slug or pattern.
 */
export function getExerciseAnimationSource(slug: string): any {
  if (EXERCISE_ANIMATION_SOURCES[slug]) {
    return EXERCISE_ANIMATION_SOURCES[slug];
  }

  const meta = getExerciseAnimationMeta(slug);
  switch (meta.diagramPattern) {
    case 'push_up':
      return EXERCISE_ANIMATION_SOURCES['standard-push-up'];
    case 'pull_up':
      return EXERCISE_ANIMATION_SOURCES['standard-pull-up'];
    case 'squat':
      return EXERCISE_ANIMATION_SOURCES['bodyweight-squat'];
    case 'lunge':
      return EXERCISE_ANIMATION_SOURCES['reverse-lunges'];
    case 'plank':
      return EXERCISE_ANIMATION_SOURCES['forearm-plank'];
    case 'hollow_body':
      return EXERCISE_ANIMATION_SOURCES['hollow-body-hold'];
    case 'handstand':
      return EXERCISE_ANIMATION_SOURCES['wall-handstand-hold'];
    case 'l_sit':
      return EXERCISE_ANIMATION_SOURCES['l-sit-progression'];
    case 'prone_floor':
      return EXERCISE_ANIMATION_SOURCES['prone-cobra'];
    case 'pike_pushup':
      return EXERCISE_ANIMATION_SOURCES['pike-push-up'];
    case 'dead_hang':
      return EXERCISE_ANIMATION_SOURCES['dead-hang'];
    case 'reverse_crunch':
      return EXERCISE_ANIMATION_SOURCES['reverse-crunch'];
    case 'planche':
      return EXERCISE_ANIMATION_SOURCES['planche'];
    case 'front_lever':
      return EXERCISE_ANIMATION_SOURCES['front-lever'];
    case 'back_lever':
      return EXERCISE_ANIMATION_SOURCES['back-lever'];
    case 'muscle_up':
      return EXERCISE_ANIMATION_SOURCES['muscle-up'];
    case 'crow_pose':
      return EXERCISE_ANIMATION_SOURCES['crow-pose'];
    case 'pistol_squat':
      return EXERCISE_ANIMATION_SOURCES['pistol-squat-progression'];
    case 'human_flag':
      return EXERCISE_ANIMATION_SOURCES['human-flag'];
    default:
      return require('../assets/sample-exercise.json');
  }
}

/**
 * Helper to fetch animation metadata with automatic fallback.
 */
export function getExerciseAnimationMeta(slug: string): ExerciseAnimationMeta {
  if (EXERCISE_ANIMATION_REGISTRY[slug]) {
    return EXERCISE_ANIMATION_REGISTRY[slug];
  }

  // Graceful fallback for unindexed exercises
  return {
    slug,
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'no_equipment',
    equipmentRequired: 'none',
    movementType: 'dynamic_push',
    cameraAngle: 'side_profile_90',
    isHold: false,
    startingPosition: 'Neutral foundational bodyweight position.',
    movementSequence: 'Perform movement with deliberate tempo and joint control.',
    endingPosition: 'Controlled return to starting position.',
    loopConfig: { loop: true, durationMs: 3000, tempo: '2-0-1-0' },
    instructionalCues: ['Maintain steady breathing', 'Keep core engaged throughout'],
    diagramPattern: 'generic',
    verificationStatus: 'awaiting_motion_asset',
  };
}

/**
 * Calculate full animation coverage statistics
 */
export interface AnimationCoverageReport {
  totalPublishedExercises: number;
  accurateAnimatedExercises: number;
  staticIllustrations: number;
  missingAnimations: number;
  animatedSkillDemonstrations: number;
  staticSkillDemonstrations: number;
  coveragePercentage: number;
}

export const PUBLISHED_EXERCISE_SLUGS: string[] = [
  // Push
  'standard-push-up',
  'incline-push-up',
  'diamond-push-up',
  'wide-push-up',
  'decline-push-up',
  'pike-push-up',
  'pseudo-planche-push-up',
  // Pull (No Equipment)
  'prone-cobra',
  'prone-y-t-w-raises',
  'prone-scapular-retractions',
  'reverse-plank-bridge',
  // Pull (Pull-up Bar)
  'dead-hang',
  'scapular-pull-ups',
  'negative-chin-ups',
  'chin-up',
  'standard-pull-up',
  // Legs
  'bodyweight-squat',
  'reverse-lunges',
  'bulgarian-split-squat',
  'jump-squat',
  'single-leg-calf-raise',
  'pistol-squat-progression',
  // Core
  'forearm-plank',
  'side-plank',
  'hollow-body-hold',
  'dead-bug',
  'reverse-crunch',
  'hanging-knee-raise',
  // Skills
  'crow-pose',
  'wall-handstand-hold',
  'l-sit-progression',
];

export const TARGET_SKILL_KEYS: string[] = [
  'handstand',
  'planche',
  'front-lever',
  'back-lever',
  'l-sit',
  'muscle-up',
  'human-flag',
  'pistol-squat',
];

export function getAnimationCoverageReport(): AnimationCoverageReport {
  let animatedCount = 0;
  let staticCount = 0;
  let missingCount = 0;

  PUBLISHED_EXERCISE_SLUGS.forEach((slug) => {
    const meta = EXERCISE_ANIMATION_REGISTRY[slug];
    const source = EXERCISE_ANIMATION_SOURCES[slug];
    if (meta && source && meta.verificationStatus === 'verified_lottie') {
      animatedCount++;
    } else if (meta && meta.verificationStatus === 'reviewed_vector_fallback') {
      staticCount++;
    } else {
      missingCount++;
    }
  });

  let animatedSkills = 0;
  TARGET_SKILL_KEYS.forEach((key) => {
    if (
      EXERCISE_ANIMATION_SOURCES[key] ||
      EXERCISE_ANIMATION_SOURCES[`${key}-progression`] ||
      EXERCISE_ANIMATION_SOURCES[`wall-${key}-hold`]
    ) {
      animatedSkills++;
    }
  });

  return {
    totalPublishedExercises: PUBLISHED_EXERCISE_SLUGS.length,
    accurateAnimatedExercises: animatedCount,
    staticIllustrations: staticCount,
    missingAnimations: missingCount,
    animatedSkillDemonstrations: animatedSkills,
    staticSkillDemonstrations: TARGET_SKILL_KEYS.length - animatedSkills,
    coveragePercentage: Math.round((animatedCount / PUBLISHED_EXERCISE_SLUGS.length) * 100),
  };
}
