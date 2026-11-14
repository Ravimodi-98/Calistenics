import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Award, Lock, Check } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AchievementItem } from '@/domain/models/dashboard.model';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
}) => {
  const isReducedMotion = useReducedMotion();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <Animated.View
      style={styles.card}
      entering={isReducedMotion ? undefined : FadeInDown.delay(500).duration(400)}
      testID="achievements-section"
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Award size={18} color={colors.accent} />
          <AppText variant="h2" color={colors.text}>
            Achievements
          </AppText>
        </View>

        <View style={styles.badge}>
          <AppText variant="caption" color={colors.text} style={styles.badgeText}>
            {unlockedCount} / {achievements.length} Unlocked
          </AppText>
        </View>
      </View>

      <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
        Earn badges exclusively through honest, real-world training consistency.
      </AppText>

      <View style={styles.grid}>
        {achievements.map((item) => {
          return (
            <View
              key={item.id}
              style={[styles.achievementItem, item.isUnlocked && styles.itemUnlocked]}
              testID={`achievement-${item.id}`}
            >
              {/* Badge Circle */}
              <View
                style={[
                  styles.badgeCircle,
                  item.isUnlocked ? styles.circleUnlocked : styles.circleLocked,
                ]}
              >
                {item.isUnlocked ? (
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Lock size={14} color={colors.surfaceSecondary} />
                )}
              </View>

              {/* Text Info */}
              <View style={styles.textColumn}>
                <View style={styles.itemTitleRow}>
                  <AppText
                    variant="h3"
                    color={item.isUnlocked ? colors.text : colors.textSecondary}
                    style={styles.itemTitle}
                  >
                    {item.title}
                  </AppText>
                  <View
                    style={[
                      styles.codeBadge,
                      item.isUnlocked ? styles.codeUnlocked : styles.codeLocked,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={item.isUnlocked ? colors.primaryDeep : colors.textSecondary}
                      style={styles.codeText}
                    >
                      {item.badge}
                    </AppText>
                  </View>
                </View>
                <AppText variant="caption" color={colors.textSecondary} style={styles.itemDesc}>
                  {item.description}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
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
  badge: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  grid: {
    gap: spacing.xs,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  itemUnlocked: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
  },
  badgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleUnlocked: {
    backgroundColor: colors.primary,
  },
  circleLocked: {
    backgroundColor: colors.border,
  },
  textColumn: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 13,
  },
  codeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.xs,
  },
  codeUnlocked: {
    backgroundColor: colors.primaryLavender,
  },
  codeLocked: {
    backgroundColor: colors.border,
  },
  codeText: {
    fontWeight: '800',
    fontSize: 9,
  },
  itemDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});

