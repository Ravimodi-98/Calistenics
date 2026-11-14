import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export const HeroPhilosophyBanner: React.FC = () => {
  return (
    <View style={styles.container} testID="hero-philosophy-banner">
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <AppText variant="caption" color={colors.text} style={styles.badgeText}>
            CORE PHILOSOPHY
          </AppText>
        </View>
        <View style={styles.subBadge}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.subBadgeText}>
            NO EQUIPMENT FIRST
          </AppText>
        </View>
      </View>

      <AppText variant="h1" color={colors.primaryDeep} style={styles.title}>
        Your Body Is Your Equipment
      </AppText>

      <AppText variant="body" color={colors.text} style={styles.description}>
        True calisthenics mastery begins with gravity and the floor. Build foundational tension,
        scapular control, and joint resilience without purchasing gym gear.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLavender, // #E0DBF3 Lavender
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.accent, // #F3BA60 Warm orange
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  subBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  subBadgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: spacing.xxs,
  },
  description: {
    lineHeight: 20,
    color: colors.text,
  },
});
