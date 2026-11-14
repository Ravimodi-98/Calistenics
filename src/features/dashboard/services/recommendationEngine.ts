import { Profile } from '@/domain/models/user.model';
import { Exercise, ExerciseDifficulty } from '@/domain/models/exercise.model';
import { WorkoutRecommendation, WorkoutSession } from '@/domain/models/workout.model';
import { SkillItem, UserSkillProgress } from '@/domain/models/skill.model';
import { WeeklyActivitySummary, WeeklyActivityDay, AchievementItem } from '@/domain/models/dashboard.model';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export class RecommendationEngine {
  /**
   * Generates a time-based greeting using local device time.
   */
  getTimeGreeting(now = new Date()): string {
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
      return 'Good Morning';
    }
    if (hours >= 12 && hours < 17) {
      return 'Good Afternoon';
    }
    return 'Good Evening';
  }

  /**
   * Extracts the user's first name, defaulting gracefully.
   */
  getUserFirstName(fullName?: string | null): string {
    if (!fullName || fullName.trim().length === 0) {
      return 'Athlete';
    }
    const parts = fullName.trim().split(/\s+/);
    return parts[0] || 'Athlete';
  }

  /**
   * Determines current day of week in lowercase ('monday', 'tuesday', etc.).
   */
  getCurrentDayKey(now = new Date()): string {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[now.getDay()];
  }

  /**
   * Checks if user has completed onboarding essentials.
   */
  hasCompleteOnboarding(profile: Profile | null): boolean {
    if (!profile) return false;
    return (
      profile.onboarding_completed &&
      !!profile.experience_level &&
      Array.isArray(profile.available_equipment) &&
      profile.available_equipment.length > 0 &&
      Array.isArray(profile.training_days) &&
      profile.training_days.length > 0
    );
  }

  /**
   * Filter exercises strictly according to user equipment availability.
   *
   * STRICT EQUIPMENT FIRST RULES:
   * 1. If user only has 'none', only exercises with equipment_required = 'none' are permitted.
   * 2. Pull-up bar exercises are only allowed if 'pull_up_bar' (or legacy 'pullup_bar') is in available_equipment.
   */
  filterByEquipment(exercises: Exercise[], availableEquipment: string[] = ['none']): Exercise[] {
    return exercises.filter((ex) =>
      isEquipmentAvailable(availableEquipment, ex.equipment_required)
    );
  }

  /**
   * Generates personalized Today's Workout based on actual onboarding data.
   */
  generateTodayWorkout(
    profile: Profile,
    availableExercises: Exercise[],
    _history: WorkoutSession[] = [],
    now = new Date()
  ): WorkoutRecommendation {
    const currentDayKey = this.getCurrentDayKey(now);
    const trainingDays = profile.training_days || ['monday', 'wednesday', 'friday'];
    const isRestDay = !trainingDays.includes(currentDayKey);

    // Rest Day Representation
    if (isRestDay) {
      return {
        isRestDay: true,
        title: 'Active Recovery & Mobility',
        category: 'mobility',
        difficulty: 'beginner',
        estimatedDurationMinutes: 15,
        exerciseCount: 3,
        exercises: [],
        focusNotes: 'Today is your recovery day. Allow muscle tissues to adapt and rebuild. Rest or practice light joint mobility.',
        mobilitySuggestion: {
          title: 'Gentle Joint & Scapular Flow',
          description: 'Wrist circles, cat-cow spine waves, and passive chest openers. Keep tension low and breathe deeply.',
          durationMinutes: 15,
        },
      };
    }

    // Active Training Day: Filter candidates by user equipment
    const allowedEquipment = profile.available_equipment || ['none'];
    const candidates = this.filterByEquipment(availableExercises, allowedEquipment);

    const level: ExerciseDifficulty = profile.experience_level || 'beginner';
    const duration = profile.session_duration_minutes || 30;
    const preference = profile.workout_preference || 'balanced';

    // Difficulty matching
    let suitableExercises = candidates.filter((ex) => ex.difficulty === level);
    if (suitableExercises.length < 3) {
      // Fallback to include beginner if intermediate has few
      suitableExercises = candidates.filter(
        (ex) => ex.difficulty === 'beginner' || ex.difficulty === level
      );
    }

    // Prioritize exercises that match the user's exact difficulty level first
    suitableExercises.sort((a, b) => {
      if (a.difficulty === level && b.difficulty !== level) return -1;
      if (b.difficulty === level && a.difficulty !== level) return 1;
      return 0;
    });

    // Select exercises tailored to user preference and category balance
    let selected: Exercise[] = [];
    if (preference === 'skill') {
      const skills = suitableExercises.filter((e) => e.category === 'skills');
      const core = suitableExercises.filter((e) => e.category === 'core');
      const push = suitableExercises.filter((e) => e.category === 'push' || e.category === 'no_equipment');
      selected = [...skills.slice(0, 2), ...push.slice(0, 1), ...core.slice(0, 1)];
    } else if (preference === 'strength') {
      const push = suitableExercises.filter((e) => e.category === 'push' || (e.category === 'no_equipment' && e.primary_muscles.includes('pectoralis_major')));
      const pull = suitableExercises.filter((e) => e.category === 'pull' || e.category === 'no_equipment');
      const legs = suitableExercises.filter((e) => e.category === 'legs');
      const core = suitableExercises.filter((e) => e.category === 'core');
      selected = [...push.slice(0, 1), ...pull.slice(0, 1), ...legs.slice(0, 1), ...core.slice(0, 1)];
    } else {
      // Balanced full-body calisthenics
      const push = suitableExercises.filter((e) => e.category === 'push');
      const pull = suitableExercises.filter((e) => e.category === 'pull' || e.slug === 'prone-cobra');
      const legs = suitableExercises.filter((e) => e.category === 'legs');
      const core = suitableExercises.filter((e) => e.category === 'core');
      selected = [...push.slice(0, 1), ...pull.slice(0, 1), ...legs.slice(0, 1), ...core.slice(0, 1)];
    }

    // If still empty or low, backfill from candidates
    if (selected.length === 0) {
      selected = candidates.slice(0, 4);
    }

    // Derive workout title
    let title = 'Foundational Bodyweight Strength';
    if (level === 'intermediate') {
      title = preference === 'skill' ? 'Intermediate Skill & Tension' : 'Progressive Upper & Core Strength';
    } else if (level === 'advanced') {
      title = 'Advanced Bodyweight Control';
    }

    return {
      isRestDay: false,
      title,
      category: 'no_equipment',
      difficulty: level,
      estimatedDurationMinutes: duration,
      exerciseCount: selected.length,
      exercises: selected,
      focusNotes: isEquipmentAvailable(allowedEquipment, 'pull_up_bar')
        ? 'Balanced routine utilizing zero-equipment mechanics with optional vertical pull progression.'
        : '100% equipment-free session. Focus on controlled tempo, scapular control, and peak contraction.',
    };
  }

  /**
   * Generates skill cards corresponding to the user's selected skills.
   */
  generateSkillOverview(
    profile: Profile,
    savedProgress: UserSkillProgress[] = []
  ): SkillItem[] {
    const skillDirectory: Record<string, { name: string; desc: string; muscles: string[]; initialProg: string }> = {
      handstand: {
        name: 'Handstand',
        desc: 'Straight-arm overhead balance, shoulder flexion, and core hollow posture.',
        muscles: ['shoulders', 'wrists', 'core'],
        initialProg: 'Chest-to-Wall Handstand Hold',
      },
      planche: {
        name: 'Planche',
        desc: 'Straight-arm horizontal hold demanding extreme anterior deltoid and scapular protraction.',
        muscles: ['shoulders', 'biceps', 'wrists', 'core'],
        initialProg: 'Planche Lean on Floor',
      },
      front_lever: {
        name: 'Front Lever',
        desc: 'Horizontal isometric hold requiring massive latissimus and scapular retractor power.',
        muscles: ['lats', 'upper_back', 'core', 'hip_flexors'],
        initialProg: 'Tuck Front Lever Hold',
      },
      back_lever: {
        name: 'Back Lever',
        desc: 'Inverted horizontal hold challenging shoulder extension and connective joint resilience.',
        muscles: ['biceps', 'chest', 'anterior_shoulders'],
        initialProg: 'German Hang & Skin the Cat',
      },
      muscle_up: {
        name: 'Muscle-up',
        desc: 'Dynamic transition from a high vertical pull into a deep straight bar dip.',
        muscles: ['lats', 'biceps', 'triceps', 'chest'],
        initialProg: 'High Chest-to-Bar Pull-up',
      },
      l_sit: {
        name: 'L-Sit',
        desc: 'Floor or bar compression hold demanding strict scapular depression and hip flexor strength.',
        muscles: ['core', 'hip_flexors', 'triceps'],
        initialProg: 'Floor Tuck L-Sit',
      },
      human_flag: {
        name: 'Human Flag',
        desc: 'Lateral bodyweight lever pressing with the bottom arm and pulling with the top arm.',
        muscles: ['obliques', 'shoulders', 'lats'],
        initialProg: 'Vertical Pole Supported Holds',
      },
      pistol_squat: {
        name: 'Pistol Squat',
        desc: 'Full-depth unilateral bodyweight squat requiring quad strength, ankle dorsiflexion, and balance.',
        muscles: ['quads', 'glutes', 'ankles'],
        initialProg: 'Box-Assisted Single-Leg Squat',
      },
      crow_pose: {
        name: 'Crow Pose',
        desc: 'Foundational floor arm balance loading wrists, engaging serratus, and developing hip flexion compression.',
        muscles: ['wrists', 'shoulders', 'core', 'triceps'],
        initialProg: 'Crow Pose Arm Balance',
      },
    };

    const targetSkills = profile.target_skills && profile.target_skills.length > 0
      ? profile.target_skills
      : ['handstand', 'l_sit'];

    return targetSkills.map((slug) => {
      const normalizedKey = slug.replace(/-/g, '_');
      const info = skillDirectory[slug] || skillDirectory[normalizedKey] || {
        name: slug.replace('_', ' ').toUpperCase(),
        desc: 'Bodyweight skill progression.',
        muscles: ['calisthenics'],
        initialProg: 'Fundamental Preparation',
      };

      const saved = savedProgress.find((p) => p.skill_slug === slug);

      return {
        slug,
        name: info.name,
        description: info.desc,
        targetMuscles: info.muscles,
        progression_level: saved?.progression_level || info.initialProg,
        assessment_status: saved?.assessment_status || 'not_assessed',
        illustrationAsset: `assets/illustrations/skills/${slug}.png`,
      };
    });
  }

  /**
   * Generates weekly activity metrics from real user sessions and training schedule.
   */
  generateWeeklyActivity(
    profile: Profile,
    sessions: WorkoutSession[] = [],
    now = new Date()
  ): WeeklyActivitySummary {
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const currentDayKey = this.getCurrentDayKey(now);
    const trainingDays = profile.training_days || [];

    // Filter sessions completed in current week (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const completedRecent = sessions.filter((s) => {
      if (s.status !== 'completed') return false;
      const sessionDate = new Date(s.completed_at || s.created_at);
      return sessionDate >= sevenDaysAgo;
    });

    const days: WeeklyActivityDay[] = dayKeys.map((key, index) => {
      const isPlanned = trainingDays.includes(key);
      const isToday = key === currentDayKey;

      // Count sessions for this day of week
      const sessionCount = completedRecent.filter((s) => {
        const d = new Date(s.completed_at || s.created_at);
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
        return dayIdx === index;
      }).length;

      return {
        dayKey: key,
        dayName: dayLabels[index],
        isPlanned,
        isCompleted: sessionCount > 0,
        isToday,
        sessionCount,
      };
    });

    return {
      completedThisWeekCount: completedRecent.length,
      plannedDaysCount: trainingDays.length,
      days,
      recentSessions: sessions.slice(0, 5),
    };
  }

  /**
   * Calculates unlocked achievements based exclusively on real user conditions.
   */
  calculateAchievements(
    sessions: WorkoutSession[] = [],
    weeklySummary: WeeklyActivitySummary,
    skillProgress: UserSkillProgress[] = []
  ): AchievementItem[] {
    const completedCount = sessions.filter((s) => s.status === 'completed').length;
    const hasProficientSkill = skillProgress.some(
      (s) => s.assessment_status === 'proficient' || s.assessment_status === 'mastered'
    );

    return [
      {
        id: 'ach-first-workout',
        title: 'First Step Taken',
        description: 'Complete your first bodyweight training session.',
        isUnlocked: completedCount >= 1,
        unlockedAt: completedCount >= 1 ? sessions[0]?.completed_at : null,
        badge: '1ST',
      },
      {
        id: 'ach-week-target',
        title: 'Weekly Target Met',
        description: 'Hit all scheduled workout sessions in a single week.',
        isUnlocked:
          weeklySummary.plannedDaysCount > 0 &&
          weeklySummary.completedThisWeekCount >= weeklySummary.plannedDaysCount,
        badge: '7D',
      },
      {
        id: 'ach-consistency-five',
        title: 'Strength Consistency',
        description: 'Log 5 completed workouts with proper form.',
        isUnlocked: completedCount >= 5,
        badge: '5X',
      },
      {
        id: 'ach-skill-mastery',
        title: 'Skill Milestone',
        description: 'Achieve proficient status on any target calisthenics skill.',
        isUnlocked: hasProficientSkill,
        badge: 'SKL',
      },
    ];
  }
}

export const recommendationEngine = new RecommendationEngine();
