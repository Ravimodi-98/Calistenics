import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calendar, CheckCircle2, Circle } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { WeeklyActivitySummary } from '@/domain/models/dashboard.model';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface WeeklyActivitySectionProps {
  activity: WeeklyActivitySummary;
  onViewHistory?: () => void;
}

export const WeeklyActivitySection: React.FC<WeeklyActivitySectionProps> = ({
  activity,
}) => {
  const isReducedMotion = useReducedMotion();

  const hasAnyCompleted = activity.completedThisWeekCount > 0 || activity.recentSessions.length > 0;

  return (
    <Animated.View
      style={styles.card}
      entering={isReducedMotion ? undefined : FadeInDown.delay(340).duration(400)}
      testID="weekly-activity-section"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Calendar size={18} color={colors.primaryDeep} />
          <AppText variant="h2" color={colors.text}>
            Weekly Activity
          </AppText>
        </View>

        <View style={styles.statsBadge}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.statsText}>
            {activity.completedThisWeekCount} / {activity.plannedDaysCount} Completed
          </AppText>
        </View>
      </View>

      {/* 7-Day Visual Strip */}
      <View style={styles.daysStrip} testID="weekly-days-strip">
        {activity.days.map((day) => {
          return (
            <View
              key={day.dayKey}
              style={[
                styles.dayColumn,
                day.isToday && styles.dayColumnToday,
                day.isCompleted && styles.dayColumnCompleted,
              ]}
              testID={`day-indicator-${day.dayKey}`}
            >
              <AppText
                variant="caption"
                color={day.isToday ? colors.primaryDeep : colors.textSecondary}
                style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}
              >
                {day.dayName}
              </AppText>

              {/* Status Circle */}
              <View style={styles.iconWrapper}>
                {day.isCompleted ? (
                  <CheckCircle2 size={16} color={colors.success} />
                ) : day.isPlanned ? (
                  <Circle
                    size={14}
                    color={day.isToday ? colors.primary : colors.surfaceSecondary}
                    strokeWidth={day.isToday ? 2.5 : 1.5}
                  />
                ) : (
                  <View style={styles.restDayDot} />
                )}
              </View>

              <AppText
                variant="caption"
                color={colors.textSecondary}
                style={styles.subLabel}
              >
                {day.isPlanned ? (day.isCompleted ? 'Done' : 'Plan') : 'Rest'}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* Real History or Empty State */}
      {!hasAnyCompleted ? (
        <View style={styles.emptyStateContainer} testID="weekly-empty-state">
          <AppText variant="h3" color={colors.text} style={styles.emptyTitle}>
            Your journey starts with your first workout.
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.emptyDesc}>
            Log today's bodyweight session above to track your training consistency, recovery pacing, and strength milestones.
          </AppText>
        </View>
      ) : (
        <View style={styles.recentHistoryContainer} testID="recent-sessions-list">
          <AppText variant="caption" color={colors.textSecondary} style={styles.recentLabel}>
            RECENT COMPLETED SESSIONS
          </AppText>
          {activity.recentSessions.map((session) => (
            <View key={session.id} style={styles.sessionRow}>
              <View style={styles.sessionDot} />
              <View style={styles.sessionInfo}>
                <AppText variant="body" color={colors.text} style={styles.sessionName}>
                  {session.workout_name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {Math.round(session.duration_seconds / 60)} min •{' '}
                  {new Date(session.completed_at || session.created_at).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statsBadge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statsText: {
    fontWeight: '700',
    fontSize: 11,
  },
  daysStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: 4,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.xs,
    minWidth: 38,
  },
  dayColumnToday: {
    backgroundColor: colors.primaryLavender,
  },
  dayColumnCompleted: {
    // completed highlight
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayLabelToday: {
    fontWeight: '800',
  },
  iconWrapper: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  restDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceSecondary,
  },
  subLabel: {
    fontSize: 9,
  },
  emptyStateContainer: {
    backgroundColor: '#FAF9FE',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryLavender,
    borderRadius: radii.sm,
    padding: spacing.md,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },
  recentHistoryContainer: {
    marginTop: spacing.xxs,
  },
  recentLabel: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.xs,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontWeight: '600',
    fontSize: 13,
  },
});

