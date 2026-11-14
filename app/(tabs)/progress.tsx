import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  Flame,
  Dumbbell,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Compass,
} from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState, CardSkeleton, OfflineBanner } from '@/components/feedback';
import { useAuthStore } from '@/features/auth/store/authStore';
import { skillService } from '@/features/skills/services/skillService';
import {
  SkillCatalogItem,
  UserSkillProgressRecord,
  SkillPracticeSession,
} from '@/domain/models/skill.model';

export default function ProgressScreen() {
  const router = useRouter();
  const { user, profile } = useAuthStore();

  const [catalog, setCatalog] = useState<SkillCatalogItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgressRecord>>({});
  const [recentSessions, setRecentSessions] = useState<SkillPracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const skills = await skillService.getSkillCatalog();
      setCatalog(skills);

      if (user?.id) {
        const [userProgress, sessions] = await Promise.all([
          skillService.getAllUserSkillProgress(user.id),
          skillService.getSkillHistory(user.id),
        ]);

        const map: Record<string, UserSkillProgressRecord> = {};
        userProgress.forEach((p) => {
          map[p.skill_slug] = p;
        });
        setProgressMap(map);
        setRecentSessions(sessions.slice(0, 5));
      }
    } catch {
      // Graceful fallback to offline catalog
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (isLoading && !refreshing) {
    return (
      <ScreenContainer padded scrollable>
        <View style={styles.header}>
          <AppText variant="h1" color={colors.text}>
            Training Progress
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Loading verified skill pathways and practice history...
          </AppText>
        </View>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </ScreenContainer>
    );
  }

  // Calculate high-level stats
  const activeSkillsCount = Object.values(progressMap).filter(
    (p) => p.assessment_status !== 'not_started'
  ).length;

  const masteredSkillsCount = Object.values(progressMap).filter(
    (p) => p.assessment_status === 'completed' || p.assessment_status === 'mastered'
  ).length;

  const totalPracticeSessions = recentSessions.length;

  // Categorize catalog
  const noEquipmentSkills = catalog.filter((s) => s.equipment_required === 'none');
  const pullUpBarSkills = catalog.filter((s) => s.equipment_required === 'pull_up_bar');
  const verticalSupportSkills = catalog.filter(
    (s) => s.equipment_required === 'vertical_support'
  );

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ready_for_assessment':
        return { label: 'Ready for Assessment', bg: '#D1FAE5', text: '#065F46' };
      case 'practicing':
        return { label: 'In Training', bg: '#E0DBF3', text: colors.primaryDeep };
      case 'learning':
        return { label: 'Learning', bg: '#FEF3C7', text: '#92400E' };
      case 'completed':
        return { label: 'Mastered', bg: '#DCFCE7', text: '#166534' };
      default:
        return { label: 'Not Started', bg: '#F1F1F3', text: colors.textSecondary };
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <AppText variant="h1" color={colors.text}>
            Training Progress
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Consistent skill pathways, verified progression stages, and real movement mastery.
          </AppText>
        </View>

        {/* METRICS ROW */}
        <View style={styles.statsRow}>
          <AppCard variant="lavender" style={styles.statCard}>
            <Flame size={20} color={colors.primary} />
            <AppText variant="h2" color={colors.primaryDeep} style={styles.statValue}>
              {activeSkillsCount}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Active Skills
            </AppText>
          </AppCard>

          <AppCard variant="default" style={styles.statCard}>
            <Dumbbell size={20} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.statValue}>
              {totalPracticeSessions}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Practice Logs
            </AppText>
          </AppCard>

          <AppCard variant="accent" style={styles.statCard}>
            <Award size={20} color="#B45309" />
            <AppText variant="h2" color="#B45309" style={styles.statValue}>
              {masteredSkillsCount}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Mastered
            </AppText>
          </AppCard>
        </View>

        {/* SECTION 1: ACTIVE SKILL PATHWAYS */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Compass size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Active Skill Pathways
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Calisthenics skills progress through 6 structured stages. Tap a pathway to practice.
          </AppText>

          {catalog.map((skill) => {
            const userProgress = progressMap[skill.slug];
            const badge = getStatusBadge(userProgress?.assessment_status);
            const currentStageOrder = userProgress?.current_stage_order || 1;
            const progressPercent = Math.min(100, Math.round((currentStageOrder / 6) * 100));

            return (
              <Pressable
                key={skill.slug}
                onPress={() => router.push(`/skills/${skill.slug}` as any)}
                style={({ pressed }) => [
                  styles.skillCard,
                  pressed && styles.skillCardPressed,
                ]}
              >
                <View style={styles.skillCardHeader}>
                  <View style={styles.skillTitleGroup}>
                    <AppText variant="h3" color={colors.text}>
                      {skill.name}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                      Stage {currentStageOrder} of 6 • {skill.difficulty.toUpperCase()}
                    </AppText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <AppText variant="caption" color={badge.text} style={styles.badgeText}>
                      {badge.label}
                    </AppText>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%` },
                    ]}
                  />
                </View>

                {/* Footer metrics / CTA */}
                <View style={styles.skillCardFooter}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {userProgress?.best_hold_seconds
                      ? `Personal Best: ${userProgress.best_hold_seconds}s hold`
                      : userProgress?.best_reps
                        ? `Personal Best: ${userProgress.best_reps} reps`
                        : 'No practice sessions logged yet'}
                  </AppText>
                  <View style={styles.arrowGroup}>
                    <AppText variant="caption" color={colors.primaryDeep} style={styles.actionLabel}>
                      View Pathway
                    </AppText>
                    <ChevronRight size={14} color={colors.primaryDeep} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* SECTION 2: NO EQUIPMENT FIRST SUMMARY */}
        <View style={styles.section}>
          <AppCard variant="lavender" style={styles.equipmentCard}>
            <View style={styles.equipmentCardHeader}>
              <Sparkles size={18} color={colors.primaryDeep} />
              <AppText variant="h3" color={colors.primaryDeep}>
                No Equipment First Architecture
              </AppText>
            </View>
            <AppText variant="body" color={colors.text} style={styles.equipmentCardText}>
              Calisthenics Coach prioritizes zero-equipment strength. 4 of the 8 core skills
              (Handstand, Planche, L-Sit, and Pistol Squat) require nothing but the floor.
            </AppText>
            <View style={styles.equipmentTagsRow}>
              <View style={styles.tag}>
                <AppText variant="caption" color={colors.primaryDeep}>
                  Floor: {noEquipmentSkills.length} skills
                </AppText>
              </View>
              <View style={styles.tag}>
                <AppText variant="caption" color={colors.primaryDeep}>
                  Pull-up Bar: {pullUpBarSkills.length} skills
                </AppText>
              </View>
              <View style={[styles.tag, styles.warningTag]}>
                <AlertTriangle size={12} color="#92400E" style={styles.tagIcon} />
                <AppText variant="caption" color="#92400E">
                  Vertical Support: {verticalSupportSkills.length} skill
                </AppText>
              </View>
            </View>
          </AppCard>
        </View>

        {/* SECTION 3: RECENT PRACTICE HISTORY */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Calendar size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Recent Skill Practice
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Logged technical practice sets, hold times, and effort ratings.
          </AppText>

          {recentSessions.length === 0 ? (
            <AppCard variant="default" style={styles.emptyCard}>
              <AppText variant="h3" color={colors.text} style={styles.emptyTitle}>
                No Skill Practice Recorded Yet
              </AppText>
              <AppText variant="body" color={colors.textSecondary} style={styles.emptyText}>
                Practice a specific progression stage in Skill Practice Mode to log your hold
                times, track RPE effort, and build genuine mastery.
              </AppText>
              <AppButton
                title="Explore Skills"
                onPress={() => router.push('/(tabs)/exercises')}
                variant="primary"
                size="sm"
                fullWidth={false}
                style={styles.emptyButton}
              />
            </AppCard>
          ) : (
            recentSessions.map((session) => (
              <AppCard key={session.id} variant="default" style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View>
                    <AppText variant="h3" color={colors.text}>
                      {session.skill_slug.replace(/-/g, ' ').toUpperCase()}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                      {new Date(session.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </AppText>
                  </View>
                  {session.effort_rating && (
                    <View style={styles.rpePill}>
                      <AppText variant="caption" color={colors.primaryDeep}>
                        RPE {session.effort_rating}/5
                      </AppText>
                    </View>
                  )}
                </View>

                <View style={styles.sessionMetricsRow}>
                  <AppText variant="body" color={colors.text}>
                    {session.completed_sets} sets completed
                  </AppText>
                  {session.recorded_hold_seconds ? (
                    <AppText variant="body" color={colors.primaryDeep} style={styles.metricHighlight}>
                      {session.recorded_hold_seconds}s Best Hold
                    </AppText>
                  ) : session.recorded_reps ? (
                    <AppText variant="body" color={colors.primaryDeep} style={styles.metricHighlight}>
                      {session.recorded_reps} Reps
                    </AppText>
                  ) : null}
                </View>

                {session.notes && (
                  <AppText variant="caption" color={colors.textSecondary} style={styles.sessionNotes}>
                    "{session.notes}"
                  </AppText>
                )}
              </AppCard>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.card,
  },
  statValue: {
    marginVertical: 4,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },
  skillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  skillCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  skillCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  skillTitleGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 11,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F1F1F3',
    borderRadius: radii.full,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  skillCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  arrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionLabel: {
    fontWeight: '600',
  },
  equipmentCard: {
    padding: spacing.md,
    borderRadius: radii.card,
  },
  equipmentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  equipmentCardText: {
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  equipmentTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  warningTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FDE68A',
    backgroundColor: '#FEF3C7',
  },
  tagIcon: {
    marginRight: 4,
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: spacing.xs,
  },
  sessionCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  rpePill: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  sessionMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metricHighlight: {
    fontWeight: '700',
  },
  sessionNotes: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
