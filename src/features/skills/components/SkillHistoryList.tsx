import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, Clock, RotateCcw, Star } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { SkillPracticeSession } from '@/domain/models/skill.model';

interface SkillHistoryListProps {
  sessions: SkillPracticeSession[];
}

export const SkillHistoryList: React.FC<SkillHistoryListProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <View style={styles.emptyContainer} testID="skill-history-empty">
        <Clock size={24} color={colors.surfaceSecondary} />
        <AppText variant="h3" color={colors.textSecondary} style={styles.emptyTitle}>
          No Practice Sessions Yet
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.emptySubtitle}>
          Select any progression stage above and log your first practice hold or reps!
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="skill-history-list">
      <View style={styles.headerRow}>
        <AppText variant="h2" color={colors.text}>
          Practice History
        </AppText>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.countBadge}>
          {sessions.length} Logged {sessions.length === 1 ? 'Session' : 'Sessions'}
        </AppText>
      </View>

      {sessions.map((session) => {
        const dateStr = new Date(session.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const hasHold = session.recorded_hold_seconds > 0;

        return (
          <View key={session.id} style={styles.sessionCard} testID={`session-item-${session.id}`}>
            <View style={styles.cardTopRow}>
              <View style={styles.dateRow}>
                <Calendar size={12} color={colors.textSecondary} />
                <AppText variant="caption" color={colors.textSecondary} style={styles.dateText}>
                  {dateStr}
                </AppText>
              </View>

              <View style={styles.metricPill}>
                <AppText variant="caption" color={colors.primaryDeep} style={styles.metricText}>
                  {hasHold ? `${session.recorded_hold_seconds}s Hold` : `${session.recorded_reps} Reps`}
                </AppText>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.statItem}>
                <RotateCcw size={12} color={colors.textSecondary} />
                <AppText variant="caption" color={colors.text}>
                  {session.completed_sets} {session.completed_sets === 1 ? 'Set' : 'Sets'}
                </AppText>
              </View>

              <View style={styles.statItem}>
                <Clock size={12} color={colors.textSecondary} />
                <AppText variant="caption" color={colors.text}>
                  {Math.round(session.duration_seconds / 60)} min
                </AppText>
              </View>

              {session.effort_rating && (
                <View style={styles.statItem}>
                  <Star size={12} color={colors.accent} fill={colors.accent} />
                  <AppText variant="caption" color={colors.text}>
                    RPE {session.effort_rating}/5
                  </AppText>
                </View>
              )}
            </View>

            {session.notes && (
              <View style={styles.notesBox}>
                <AppText variant="caption" color={colors.textSecondary} style={styles.notesText}>
                  "{session.notes}"
                </AppText>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  countBadge: {
    fontWeight: '700',
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    marginTop: spacing.xs,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
  },
  metricPill: {
    backgroundColor: '#EDE9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  metricText: {
    fontWeight: '800',
    fontSize: 11,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesBox: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  notesText: {
    fontStyle: 'italic',
    fontSize: 11,
  },
});

