import { supabase } from '@/services/supabase/client';
import { Profile } from '@/domain/models/user.model';
import { Exercise } from '@/domain/models/exercise.model';
import { WorkoutSession } from '@/domain/models/workout.model';
import { UserSkillProgress } from '@/domain/models/skill.model';
import { DashboardData } from '@/domain/models/dashboard.model';
import { exerciseService } from '@/features/exercises/services/exerciseService';
import { recommendationEngine } from './recommendationEngine';

export class DashboardService {
  /**
   * Fetches and compiles all personalized dashboard data for the authenticated user.
   */
  async getDashboardData(userId: string, profile: Profile | null): Promise<DashboardData> {
    const timeGreeting = recommendationEngine.getTimeGreeting();
    const userFirstName = recommendationEngine.getUserFirstName(profile?.full_name);

    // 1. Check if user needs onboarding
    const isComplete = recommendationEngine.hasCompleteOnboarding(profile);
    if (!isComplete || !profile) {
      return this.getFallbackOnboardingDashboard(userFirstName, timeGreeting);
    }

    // 2. Fetch published exercises (with automatic local fallback)
    const allExercises = await exerciseService.getPublishedExercises();

    // 3. Fetch user's workout sessions
    const sessions = await this.getUserWorkoutSessions(userId);

    // 4. Fetch user's skill progress
    const skillProgress = await this.getUserSkillProgress(userId);

    // 5. Generate personalized Today's Workout
    const todayWorkout = recommendationEngine.generateTodayWorkout(
      profile,
      allExercises,
      sessions
    );

    // 6. Generate Skill Overview
    const skills = recommendationEngine.generateSkillOverview(profile, skillProgress);

    // 7. Generate Weekly Activity Summary
    const weeklyActivity = recommendationEngine.generateWeeklyActivity(profile, sessions);

    // 8. Generate Recommended Exercises
    // Filter strictly by user equipment & difficulty
    const userEquipment = profile.available_equipment || ['none'];
    const candidates = recommendationEngine.filterByEquipment(allExercises, userEquipment);
    const recommendedExercises = candidates.slice(0, 6);

    // 9. Evaluate Achievements
    const achievements = recommendationEngine.calculateAchievements(
      sessions,
      weeklyActivity,
      skillProgress
    );

    return {
      timeGreeting,
      userFirstName,
      needsOnboarding: false,
      todayWorkout,
      skills,
      weeklyActivity,
      recommendedExercises,
      achievements,
    };
  }

  /**
   * Fetch workout sessions for a specific user from Supabase.
   */
  async getUserWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('DashboardService: Error fetching sessions from Supabase:', error.message);
        return [];
      }

      return (data || []) as WorkoutSession[];
    } catch (err) {
      console.warn('DashboardService: Network exception fetching sessions:', err);
      return [];
    }
  }

  /**
   * Fetch user skill progress from Supabase.
   */
  async getUserSkillProgress(userId: string): Promise<UserSkillProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_skill_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.warn('DashboardService: Error fetching skill progress:', error.message);
        return [];
      }

      return (data || []) as UserSkillProgress[];
    } catch (err) {
      console.warn('DashboardService: Network exception fetching skills:', err);
      return [];
    }
  }

  /**
   * Safe fallback for users who have not yet completed onboarding.
   */
  private getFallbackOnboardingDashboard(
    firstName: string,
    timeGreeting: string
  ): DashboardData {
    const fallbackExercises = exerciseService.getFallbackExercises();

    const mockProfile: Profile = {
      id: 'placeholder',
      full_name: firstName,
      onboarding_completed: false,
      experience_level: 'beginner',
      available_equipment: ['none'],
      training_days: ['monday', 'wednesday', 'friday'],
      session_duration_minutes: 30,
      workout_preference: 'balanced',
      fitness_goals: ['build_strength'],
      target_skills: ['handstand', 'l_sit'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const todayWorkout = recommendationEngine.generateTodayWorkout(
      mockProfile,
      fallbackExercises,
      []
    );
    const skills = recommendationEngine.generateSkillOverview(mockProfile, []);
    const weeklyActivity = recommendationEngine.generateWeeklyActivity(mockProfile, []);
    const achievements = recommendationEngine.calculateAchievements([], weeklyActivity, []);

    return {
      timeGreeting,
      userFirstName: firstName,
      needsOnboarding: true,
      todayWorkout,
      skills,
      weeklyActivity,
      recommendedExercises: fallbackExercises.slice(0, 4),
      achievements,
    };
  }
}

export const dashboardService = new DashboardService();

