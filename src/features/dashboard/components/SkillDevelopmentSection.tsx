import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Target, ChevronRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { SkillItem } from '@/domain/models/skill.model';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';

interface SkillDevelopmentSectionProps {
  skills: SkillItem[];
  onSkillPress?: (skill: SkillItem) => void;
}

export const SkillDevelopmentSection: React.FC<SkillDevelopmentSectionProps> = ({
  skills,
  onSkillPress,
}) => {
  const isReducedMotion = useReducedMotion();

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={styles.container}
      entering={isReducedMotion ? undefined : FadeInDown.delay(260).duration(400)}
      testID="skill-development-section"
    >
      <View style={styles.sectionHeader}>
        <View style={styles.titleWithIcon}>
          <Target size={18} color={colors.primaryDeep} />
          <AppText variant="h2" color={colors.text}>
            Target Skills
          </AppText>
        </View>
        <AppText variant="caption" color={colors.textSecondary}>
          {skills.length} Pathways
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {skills.map((skill, index) => {
          const isNotAssessed = skill.assessment_status === 'not_assessed';

          return (
            <Pressable
              key={skill.slug}
              style={styles.skillCard}
              onPress={() => onSkillPress?.(skill)}
              testID={`skill-card-${skill.slug}`}
            >
              {/* Top Row: Icon circle + Status pill */}
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <AppText variant="button" color={colors.primaryDeep} style={styles.iconText}>
                    {skill.name.slice(0, 2).toUpperCase()}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    isNotAssessed ? styles.statusNotAssessed : styles.statusActive,
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isNotAssessed ? colors.textSecondary : colors.primaryDeep}
                    style={styles.statusText}
                  >
                    {isNotAssessed ? 'Not Assessed Yet' : skill.assessment_status.replace('_', ' ')}
                  </AppText>
                </View>
              </View>

              {/* Skill Name & Description */}
              <AppText variant="h3" color={colors.text} style={styles.skillName}>
                {skill.name}
              </AppText>
              <AppText
                variant="caption"
                color={colors.textSecondary}
                numberOfLines={2}
                style={styles.skillDesc}
              >
                {skill.description}
              </AppText>

              {/* 2D Skill Progression Animation */}
              <View style={styles.skillAnimationBox}>
                <ExerciseAnimation
                  slug={skill.slug.replace(/_/g, '-')}
                  exerciseName={skill.name}
                  height={110}
                  autoPlay={true}
                  loop={true}
                />
              </View>

              {/* Current Progression Box */}
              <View style={styles.progressionBox}>
                <AppText variant="caption" color={colors.textSecondary} style={styles.progressionLabel}>
                  CURRENT STEP
                </AppText>
                <AppText
                  variant="body"
                  color={colors.primaryDeep}
                  numberOfLines={1}
                  style={styles.progressionTitle}
                >
                  {skill.progression_level}
                </AppText>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <AppText variant="caption" color={colors.primary} style={styles.footerActionText}>
                  View Details
                </AppText>
                <ChevronRight size={14} color={colors.primary} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scrollList: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  skillCard: {
    width: 230,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillAnimationBox: {
    marginVertical: spacing.xs,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontWeight: '800',
    fontSize: 12,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusNotAssessed: {
    backgroundColor: colors.background,
  },
  statusActive: {
    backgroundColor: colors.primaryLavender,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  skillName: {
    marginBottom: 4,
  },
  skillDesc: {
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  progressionBox: {
    backgroundColor: colors.background,
    padding: spacing.xs,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  progressionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  progressionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  footerActionText: {
    fontWeight: '700',
  },
});

