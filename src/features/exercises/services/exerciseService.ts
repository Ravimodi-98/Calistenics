import { supabase } from '@/services/supabase/client';
import {
  Exercise,
  ExerciseCategory,
  ExerciseEquipment,
  ExerciseDifficulty,
  ExerciseFilterOptions,
} from '@/domain/models/exercise.model';

export class ExerciseService {
  /**
   * Fetch all published exercises from Supabase with fallback to local starter set.
   */
  async getPublishedExercises(): Promise<Exercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('content_status', 'published')
        .order('name', { ascending: true });

      if (error) {
        console.warn('ExerciseService: Supabase query returned an error, using static fallback:', error.message);
        return this.getFallbackExercises();
      }

      if (!data || data.length === 0) {
        return this.getFallbackExercises();
      }

      return data as Exercise[];
    } catch (err) {
      console.warn('ExerciseService: Network or client exception, using static fallback:', err);
      return this.getFallbackExercises();
    }
  }

  /**
   * Filter exercises adhering strictly to the "NO EQUIPMENT FIRST" philosophy.
   *
   * RULES:
   * 1. If equipment is 'none' OR category is 'no_equipment', pull_up_bar exercises are NEVER shown.
   * 2. When searching or category-filtering, equipment restrictions always take precedence.
   */
  filterExercises(exercises: Exercise[], filters: ExerciseFilterOptions): Exercise[] {
    const { category = 'no_equipment', equipment = 'none', difficulty = 'all', searchQuery = '' } = filters;

    return exercises.filter((ex) => {
      // 1. Strict Equipment Rule:
      // If equipment filter is 'none' or category is 'no_equipment', exclude any bar requirement.
      if (equipment === 'none' || category === 'no_equipment') {
        if (ex.equipment_required !== 'none') {
          return false;
        }
      } else if (equipment === 'pull_up_bar') {
        if (ex.equipment_required !== 'pull_up_bar') {
          return false;
        }
      }

      // 2. Category Filter:
      if (category !== 'all' && ex.category !== category) {
        return false;
      }

      // 3. Difficulty Filter:
      if (difficulty !== 'all' && ex.difficulty !== difficulty) {
        return false;
      }

      // 4. Search Query:
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = ex.name.toLowerCase().includes(query);
        const matchesDesc = ex.description.toLowerCase().includes(query);
        const matchesMuscles = ex.primary_muscles.some((m) => m.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesMuscles) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Static fallback starter set ensuring offline readiness and high reliability.
   */
  getFallbackExercises(): Exercise[] {
    return [
      {
        id: 'fe-001',
        slug: 'prone-cobra',
        name: 'Prone Cobra',
        description: 'A floor-based postural exercise strengthening the upper back, rear shoulders, and thoracic spine with zero equipment.',
        category: 'no_equipment',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['rhomboids', 'rear_deltoids', 'lower_trapezius'],
        secondary_muscles: ['glutes', 'erector_spinae'],
        instructions: [
          { step: 1, title: 'Setup', cue: 'Lie face down on the floor with arms at your sides, palms facing down, toes on the ground.' },
          { step: 2, title: 'Lift and Rotate', cue: 'Simultaneously lift your chest off the floor while externally rotating your arms so thumbs point to the ceiling.' },
          { step: 3, title: 'Scapular Pinch', cue: 'Squeeze your shoulder blades together and down toward your hips. Keep chin tucked, looking at the floor.' },
          { step: 4, title: 'Hold & Lower', cue: 'Hold for 3 to 5 seconds with controlled breathing, then lower slowly with control.' },
        ],
        prerequisites: [],
        progression_exercises: ['prone-y-t-w-raises', 'reverse-plank-bridge'],
        regressions: [],
        safety_notes: 'Do not hyper-extend the neck. Keep the back of your neck long by looking down.',
        disclaimer: 'Note: Floor-based pulling and posterior extension strengthens the scapular retractors and thoracic posture, but does not provide the vertical resisted load of a hanging pull-up.',
        animation_asset_path: 'assets/animations/exercise-placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'fe-002',
        slug: 'standard-push-up',
        name: 'Standard Push-up',
        description: 'The quintessential upper-body pushing movement building chest, tricep, and anterior shoulder strength.',
        category: 'push',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['pectoralis_major', 'triceps_brachii', 'anterior_deltoid'],
        secondary_muscles: ['rectus_abdominis', 'serratus_anterior'],
        instructions: [
          { step: 1, title: 'High Plank Setup', cue: 'Hands placed slightly wider than shoulder-width, fingers spread, feet together, glutes squeezed.' },
          { step: 2, title: 'Descent', cue: 'Lower your chest toward the floor in one rigid line. Elbows track back at roughly 45 degrees.' },
          { step: 3, title: 'Full Depth', cue: 'Descend until your chest lightly touches the floor or is an inch above.' },
          { step: 4, title: 'Press to Lockout', cue: 'Push through the entire palm back to top position, fully protracting shoulder blades at the top.' },
        ],
        prerequisites: ['incline-push-up'],
        progression_exercises: ['diamond-push-up', 'pike-push-up'],
        regressions: ['incline-push-up', 'knee-push-up'],
        safety_notes: 'Avoid sagging the hips or flaring elbows out perpendicular to the torso.',
        disclaimer: null,
        animation_asset_path: 'assets/animations/exercise-placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'fe-003',
        slug: 'prone-y-t-w-raises',
        name: 'Prone Y-T-W Raises',
        description: 'Comprehensive floor-based scapular retractor sequence strengthening the lower, middle trapezius and posterior deltoids without equipment.',
        category: 'pull',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['lower_trapezius', 'middle_trapezius', 'rear_deltoids'],
        secondary_muscles: ['infraspinatus', 'rhomboids'],
        instructions: [
          { step: 1, title: 'Y Position', cue: 'Lie face down, extend arms overhead at 45 degrees with thumbs up. Pulse thumbs up 10 times.' },
          { step: 2, title: 'T Position', cue: 'Move arms straight out to sides perpendicular to torso with thumbs up. Pulse up 10 times.' },
          { step: 3, title: 'W Position', cue: 'Bend elbows down to ribs (W shape). Squeeze shoulder blades together and pulse up 10 times.' },
        ],
        prerequisites: [],
        progression_exercises: ['dead-hang', 'scapular-pull-ups'],
        regressions: [],
        safety_notes: 'Keep neck relaxed and forehead resting on the floor or neutral.',
        disclaimer: 'CRITICAL NOTE: Floor-based pulling exercises isolate scapular stabilizers and posterior deltoids, which are crucial for posture and shoulder health. However, they do not provide the heavy vertical tensile resistance of hanging bodyweight. They are a valuable foundation, but not an exact 1:1 replacement for pull-ups.',
        animation_asset_path: 'assets/animations/exercise-placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'fe-004',
        slug: 'standard-pull-up',
        name: 'Standard Pull-up',
        description: 'The gold standard of upper-body vertical pulling strength and back width development.',
        category: 'pull',
        equipment_required: 'pull_up_bar',
        difficulty: 'intermediate',
        primary_muscles: ['latissimus_dorsi', 'biceps_brachii'],
        secondary_muscles: ['trapezius', 'rhomboids', 'posterior_deltoids', 'core'],
        instructions: [
          { step: 1, title: 'Full Hang', cue: 'Overhand grip slightly wider than shoulders, arms fully locked, hollow body engaged.' },
          { step: 2, title: 'Initiate', cue: 'Pull elbows down into pockets while driving chest upward toward bar.' },
          { step: 3, title: 'Top Position', cue: 'Clear chin comfortably over the bar without craning neck.' },
          { step: 4, title: 'Controlled Return', cue: 'Lower with full control back to a dead hang before initiating the next rep.' },
        ],
        prerequisites: ['negative-chin-ups', 'scapular-pull-ups'],
        progression_exercises: ['l-sit-pull-up'],
        regressions: ['negative-chin-ups'],
        safety_notes: 'Avoid kicking or kipping with knees. Maintain strict calisthenics form.',
        disclaimer: null,
        animation_asset_path: 'assets/animations/exercise-placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}

export const exerciseService = new ExerciseService();

