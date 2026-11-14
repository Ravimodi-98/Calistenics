import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState, ErrorState, OfflineBanner } from '@/components/feedback';
import { useDashboardQuery } from '@/features/dashboard/hooks/useDashboardQuery';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { MotivationHeroCard } from '@/features/dashboard/components/MotivationHeroCard';
import { TodayWorkoutCard } from '@/features/dashboard/components/TodayWorkoutCard';
import { SkillDevelopmentSection } from '@/features/dashboard/components/SkillDevelopmentSection';
import { WeeklyActivitySection } from '@/features/dashboard/components/WeeklyActivitySection';
import { RecommendedExercisesSection } from '@/features/dashboard/components/RecommendedExercisesSection';
import { AchievementsSection } from '@/features/dashboard/components/AchievementsSection';

export default function HomeScreen() {
  const router = useRouter();
  const { data: dashboard, isLoading, isError, error, refetch } = useDashboardQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !refreshing) {
    return (
      <ScreenContainer padded>
        <LoadingState message="Personalizing your calisthenics training..." />
      </ScreenContainer>
    );
  }

  if (isError && !dashboard) {
    return (
      <ScreenContainer padded>
        <ErrorState
          title="Could Not Load Dashboard"
          message={error?.message || 'Failed to assemble training recommendations.'}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* SECTION A — GREETING HEADER */}
        <DashboardHeader
          timeGreeting={dashboard.timeGreeting}
          userFirstName={dashboard.userFirstName}
          onNotificationPress={() => router.push('/(tabs)/profile')}
          onProfilePress={() => router.push('/(tabs)/profile')}
        />

        {/* OFFLINE INDICATOR (if refetch failed while showing cached data) */}
        {isError && (
          <OfflineBanner
            onRetry={refetch}
            isRetrying={refreshing}
          />
        )}

        {/* ONBOARDING PROMPT (if onboarding was skipped or incomplete) */}
        {dashboard.needsOnboarding && (
          <AppCard variant="accent" style={styles.onboardingPromptCard}>
            <AppText variant="h3" color="#5C3E0A" style={styles.promptTitle}>
              Personalize Your Program
            </AppText>
            <AppText variant="body" color="#5C3E0A" style={styles.promptDesc}>
              Complete your experience level, equipment, and target skills to receive accurate daily routines.
            </AppText>
            <AppButton
              title="Start Onboarding"
              onPress={() => router.push('/(onboarding)/experience')}
              variant="secondary"
              size="sm"
              fullWidth={false}
              style={styles.promptButton}
            />
          </AppCard>
        )}

        {/* SECTION B — MOTIVATION HERO CARD */}
        <MotivationHeroCard />

        {/* SECTION C — TODAY'S WORKOUT (Active or Recovery day) */}
        <TodayWorkoutCard
          workout={dashboard.todayWorkout}
          onStartWorkout={() => router.push('/workout/today')}
          onViewExercises={() => router.push('/(tabs)/library')}
        />

        {/* SECTION D — SKILL DEVELOPMENT */}
        <SkillDevelopmentSection
          skills={dashboard.skills}
          onSkillPress={(skill) => {
            const cleanSlug = skill.slug.replace(/_/g, '-');
            router.push(`/skills/${cleanSlug}`);
          }}
        />

        {/* SECTION E — WEEKLY ACTIVITY */}
        <WeeklyActivitySection activity={dashboard.weeklyActivity} />

        {/* SECTION F — RECOMMENDED EXERCISES */}
        <RecommendedExercisesSection
          exercises={dashboard.recommendedExercises}
          onViewAll={() => router.push('/(tabs)/library')}
        />

        {/* SECTION G — ACHIEVEMENTS */}
        <AchievementsSection achievements={dashboard.achievements} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  onboardingPromptCard: {
    marginBottom: spacing.md,
  },
  promptTitle: {
    marginBottom: 4,
  },
  promptDesc: {
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  promptButton: {
    alignSelf: 'flex-start',
  },
});
