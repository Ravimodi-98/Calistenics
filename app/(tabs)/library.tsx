import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState, ErrorState, EmptyState } from '@/components/feedback';
import { Exercise, ExerciseFilterOptions } from '@/domain/models/exercise.model';
import { exerciseService } from '@/features/exercises/services/exerciseService';
import { HeroPhilosophyBanner } from '@/features/exercises/components/HeroPhilosophyBanner';
import { PullDisclaimerBanner } from '@/features/exercises/components/PullDisclaimerBanner';
import { ExerciseFilterBar } from '@/features/exercises/components/ExerciseFilterBar';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';

export default function LibraryScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filter: "No Equipment" category & "No Equipment" equipment requirement
  const [filters, setFilters] = useState<ExerciseFilterOptions>({
    category: 'no_equipment',
    equipment: 'none',
    difficulty: 'all',
    searchQuery: '',
  });

  const loadExercises = useCallback(async () => {
    try {
      setError(null);
      const data = await exerciseService.getPublishedExercises();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load exercises');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadExercises();
  }, [loadExercises]);

  // Compute filtered exercises with strict No Equipment First rule
  const filteredExercises = useMemo(() => {
    return exerciseService.filterExercises(exercises, filters);
  }, [exercises, filters]);

  // Check if we should display the transparent pull disclaimer banner
  const shouldShowPullDisclaimer =
    filters.category === 'pull' ||
    filteredExercises.some((ex) => ex.category === 'pull' && ex.equipment_required === 'none');

  if (loading && !refreshing) {
    return (
      <ScreenContainer padded>
        <LoadingState message="Loading calisthenics exercises..." />
      </ScreenContainer>
    );
  }

  if (error && exercises.length === 0) {
    return (
      <ScreenContainer padded>
        <ErrorState
          title="Could Not Load Exercises"
          message={error}
          onRetry={loadExercises}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <AppText variant="h1" color={colors.text}>
                Exercise Library
              </AppText>
              <AppText variant="caption" color={colors.primaryDeep} style={styles.countBadge}>
                {filteredExercises.length} Exercises
              </AppText>
            </View>

            {/* Core Philosophy Banner: Your Body Is Your Equipment */}
            <HeroPhilosophyBanner />

            {/* Comprehensive Filter Controls */}
            <ExerciseFilterBar filters={filters} onFilterChange={setFilters} />

            {/* Pull Workout Transparent Educational Disclaimer */}
            {shouldShowPullDisclaimer && <PullDisclaimerBanner />}
          </View>
        }
        renderItem={({ item, index }) => (
          <ExerciseCard exercise={item} index={index} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Exercises Found"
            description="No exercises match your search and filter criteria. Remember, No Equipment exercises are the foundation."
            actionTitle="Reset to No Equipment"
            onAction={() =>
              setFilters({
                category: 'no_equipment',
                equipment: 'none',
                difficulty: 'all',
                searchQuery: '',
              })
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  countBadge: {
    fontWeight: '700',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
