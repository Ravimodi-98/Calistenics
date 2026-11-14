import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { Exercise } from '@/domain/models/exercise.model';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RecommendedExercisesSectionProps {
  exercises: Exercise[];
  onViewAll?: () => void;
}

export const RecommendedExercisesSection: React.FC<RecommendedExercisesSectionProps> = ({
  exercises,
  onViewAll,
}) => {
  const isReducedMotion = useReducedMotion();

  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={styles.container}
      entering={isReducedMotion ? undefined : FadeInDown.delay(420).duration(400)}
      testID="recommended-exercises-section"
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BookOpen size={18} color={colors.primaryDeep} />
          <AppText variant="h2" color={colors.text}>
            Recommended Exercises
          </AppText>
        </View>

        {onViewAll && (
          <Pressable
            style={styles.viewAllButton}
            onPress={onViewAll}
            testID="view-all-exercises-button"
          >
            <AppText variant="caption" color={colors.primary} style={styles.viewAllText}>
              View All
            </AppText>
            <ChevronRight size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>

      <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
        Tailored to your current level and available equipment. Zero gear required by default.
      </AppText>

      <View style={styles.list}>
        {exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewAllText: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  list: {
    marginTop: spacing.xxs,
  },
});

