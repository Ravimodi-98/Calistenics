import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState, ErrorState, CardSkeleton } from '@/components/feedback';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';
import {
  SkillCatalogItem,
  SkillProgressionStage,
  UserSkillProgressRecord,
  SkillPracticeSession,
} from '@/domain/models/skill.model';
import { skillService } from '@/features/skills/services/skillService';
import { progressionReadinessEngine } from '@/features/skills/services/progressionReadinessEngine';
import { SkillPathwayTimeline } from '@/features/skills/components/SkillPathwayTimeline';
import { SkillEquipmentNotice } from '@/features/skills/components/SkillEquipmentNotice';
import { SkillHistoryList } from '@/features/skills/components/SkillHistoryList';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuthStore();

  const [skill, setSkill] = useState<SkillCatalogItem | null>(null);
  const [pathway, setPathway] = useState<SkillProgressionStage[]>([]);
  const [userProgress, setUserProgress] = useState<UserSkillProgressRecord | null>(null);
  const [history, setHistory] = useState<SkillPracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skillSlug = (id || 'handstand').replace(/_/g, '-');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [skillData, pathwayData, progressData, historyData] = await Promise.all([
        skillService.getSkillBySlug(skillSlug),
        skillService.getSkillPathway(skillSlug),
        user ? skillService.getUserSkillProgress(user.id, skillSlug) : Promise.resolve(null),
        user ? skillService.getSkillHistory(user.id, skillSlug) : Promise.resolve([]),
      ]);

      if (!skillData) {
        setError('Skill not found in catalog.');
        return;
      }

      setSkill(skillData);
      setPathway(pathwayData);
      setUserProgress(progressData);
      setHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load skill details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [skillSlug, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleSelectStage = (stage: SkillProgressionStage) => {
    // Navigate to dedicated skill practice screen
    router.push({
      pathname: '/skills/practice',
      params: {
        skillSlug: skill?.slug || skillSlug,
        stageSlug: stage.stage_slug,
      },
    });
  };

  if (loading && !refreshing) {
    return (
      <ScreenContainer padded scrollable>
        <CardSkeleton />
        <CardSkeleton />
      </ScreenContainer>
    );
  }

  if (error || !skill) {
    return (
      <ScreenContainer padded>
        <ErrorState
          title="Skill Not Available"
          message={error || 'Unable to display skill pathway.'}
          onRetry={loadData}
        />
      </ScreenContainer>
    );
  }

  // Check equipment availability against user's profile
  const userEquipment = profile?.available_equipment || ['none'];
  const equipmentCheck = progressionReadinessEngine.isEquipmentAvailable(
    skill.equipment_required,
    userEquipment
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="skill-back-button"
          >
            <ChevronLeft size={22} color={colors.text} />
          </Pressable>
          <AppText variant="h3" color={colors.text} style={styles.navTitle}>
            Skill Pathway
          </AppText>
          <View style={styles.navPlaceholder} />
        </View>

        {/* 2D Vector Animation Demonstration Stage */}
        <View style={styles.animationStage} testID="skill-animation-stage">
          <ExerciseAnimation
            slug={skill.slug}
            exerciseName={skill.name}
            isSkill={true}
            progressionStage="Dedicated Skill Pathway Animation"
            height={230}
            autoPlay={true}
            loop={true}
          />
        </View>

        {/* Skill Title & Badges */}
        <View style={styles.infoSection}>
          <View style={styles.badgeRow}>
            <View style={styles.difficultyBadge}>
              <AppText variant="caption" color={colors.primaryDeep} style={styles.badgeText}>
                {skill.difficulty.toUpperCase()}
              </AppText>
            </View>
            <View style={styles.equipmentBadge}>
              <AppText variant="caption" color={colors.textSecondary} style={styles.badgeText}>
                {skill.equipment_required.replace(/_/g, ' ').toUpperCase()}
              </AppText>
            </View>
          </View>

          <AppText variant="h1" color={colors.text} style={styles.skillTitle}>
            {skill.name}
          </AppText>

          <AppText variant="body" color={colors.textSecondary} style={styles.description}>
            {skill.description}
          </AppText>

          {/* Equipment Check & Philosophy Notice */}
          <SkillEquipmentNotice
            equipmentRequired={skill.equipment_required}
            isAvailable={equipmentCheck.allowed}
            unavailabilityReason={equipmentCheck.reason}
          />

          {/* Safety Notes Box */}
          {skill.safety_notes && (
            <View style={styles.safetyBox}>
              <ShieldAlert size={16} color="#8A5812" />
              <View style={styles.safetyTextColumn}>
                <AppText variant="caption" color="#8A5812" style={styles.safetyTitle}>
                  SAFETY & CONNECTIVE TISSUE ADAPTATION
                </AppText>
                <AppText variant="caption" color={colors.text} style={styles.safetyDesc}>
                  {skill.safety_notes}
                </AppText>
              </View>
            </View>
          )}

          {/* Target Muscles */}
          <View style={styles.musclesRow}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.musclesLabel}>
              TARGETS:
            </AppText>
            {skill.primary_muscles.map((muscle) => (
              <View key={muscle} style={styles.muscleChip}>
                <AppText variant="caption" color={colors.primaryDeep} style={styles.muscleChipText}>
                  {muscle.replace(/_/g, ' ')}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Progression Pathway Timeline */}
        <View style={styles.timelineSection}>
          <SkillPathwayTimeline
            pathway={pathway}
            userProgress={userProgress}
            practiceSessions={history}
            onSelectStage={handleSelectStage}
          />
        </View>

        {/* Practice History Section */}
        <View style={styles.historySection}>
          <SkillHistoryList sessions={history} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navTitle: {
    fontWeight: '700',
  },
  navPlaceholder: {
    width: 36,
  },
  animationStage: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoSection: {
    paddingHorizontal: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  difficultyBadge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  equipmentBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
  },
  skillTitle: {
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#FDF7EE',
    padding: spacing.sm,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#F3DBB3',
  },
  safetyTextColumn: {
    flex: 1,
  },
  safetyTitle: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  safetyDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  musclesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  musclesLabel: {
    fontWeight: '800',
    fontSize: 10,
  },
  muscleChip: {
    backgroundColor: '#EDE9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  muscleChipText: {
    fontWeight: '600',
    fontSize: 11,
  },
  timelineSection: {
    paddingHorizontal: spacing.md,
  },
  historySection: {
    paddingHorizontal: spacing.md,
  },
});

