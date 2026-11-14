import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export const PullDisclaimerBanner: React.FC = () => {
  return (
    <View style={styles.banner} testID="pull-disclaimer-banner">
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <AppText variant="caption" color="#FFFFFF" style={styles.iconText}>
            !
          </AppText>
        </View>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.headerTitle}>
          TRANSPARENT PULLING EDUCATION
        </AppText>
      </View>

      <AppText variant="body" color={colors.text} style={styles.bodyText}>
        <AppText variant="body" color={colors.text} style={styles.boldText}>
          Floor-based pulling exercises
        </AppText>{' '}
        (such as Prone Cobras and Y-T-W raises) strengthen your scapular retractors, rear delts, and thoracic spine without equipment.
      </AppText>

      <View style={styles.noteBox}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.noteText}>
          Honesty Note: Floor pulling does NOT reproduce the full vertical resistance of hanging bodyweight. They are an essential starting foundation, but not an exact 1:1 replacement for pull-ups. A pull-up bar remains strictly optional.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
    borderRadius: radii.button,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  boldText: {
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderRadius: radii.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  noteText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
