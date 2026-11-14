import { Exercise } from './exercise.model';
import { WorkoutRecommendation, WorkoutSession } from './workout.model';
import { SkillItem } from './skill.model';

export interface WeeklyActivityDay {
  dayName: string; // 'Mon', 'Tue', etc.
  dayKey: string; // 'monday', 'tuesday', etc.
  isPlanned: boolean;
  isCompleted: boolean;
  isToday: boolean;
  sessionCount: number;
}

export interface WeeklyActivitySummary {
  completedThisWeekCount: number;
  plannedDaysCount: number;
  days: WeeklyActivityDay[];
  recentSessions: WorkoutSession[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  badge: string;
}

export interface DashboardData {
  timeGreeting: string; // 'Good Morning', 'Good Afternoon', 'Good Evening'
  userFirstName: string;
  needsOnboarding: boolean;
  todayWorkout: WorkoutRecommendation;
  skills: SkillItem[];
  weeklyActivity: WeeklyActivitySummary;
  recommendedExercises: Exercise[];
  achievements: AchievementItem[];
}

