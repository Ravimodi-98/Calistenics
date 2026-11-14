import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export default function PlanScreen() {
  return (
    <ScreenContainer scrollable padded>
      <View style={styles.header}>
        <AppText variant="h1" color={colors.text}>
          Training Plan
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Weekly schedule and customized progression roadmap.
        </AppText>
      </View>

      <AppCard variant="lavender" style={styles.planCard}>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.tag}>
          ACTIVE PLAN
        </AppText>
        <AppText variant="h2" color={colors.primaryDeep}>
          Foundational Bodyweight 101
        </AppText>
        <AppText variant="body" color={colors.text} style={styles.planDesc}>
          3 training days per week • 4-week cycle • Zero equipment required.
        </AppText>
      </AppCard>

      <AppCard variant="default" style={styles.card}>
        <AppText variant="h3" color={colors.text}>
          Upcoming Sessions
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.text}>
          Day 1: Push & Core (Today)
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.text}>
          Day 2: Rest & Recovery (Tomorrow)
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.text}>
          Day 3: Pull & Legs (Thursday)
        </AppText>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginVertical: spacing.md,
  },
  planCard: {
    marginBottom: spacing.md,
  },
  tag: {
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  planDesc: {
    marginTop: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
  },
  text: {
    marginTop: spacing.xs,
  },
});

