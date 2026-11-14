import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import {
  AppText,
  AppButton,
  AppCard,
  SelectionCard,
  AppInput,
  ProgressBar,
  AnimatedCard,
  LoadingState,
  EmptyState,
  ErrorState,
  ScreenContainer,
} from '@/components';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';
import { ScrollView, Pressable } from 'react-native';

const DEMO_EXERCISES = [
  { slug: 'standard-push-up', name: 'Push-up' },
  { slug: 'standard-pull-up', name: 'Pull-up' },
  { slug: 'prone-cobra', name: 'Prone Cobra' },
  { slug: 'bodyweight-squat', name: 'Squat' },
  { slug: 'reverse-lunges', name: 'Lunge' },
  { slug: 'forearm-plank', name: 'Plank' },
  { slug: 'hollow-body-hold', name: 'Hollow Body' },
  { slug: 'pike-push-up', name: 'Pike Push-up' },
  { slug: 'wall-handstand-hold', name: 'Handstand (Prog)' },
  { slug: 'planche', name: 'Planche Lean' },
  { slug: 'front-lever', name: 'Tuck Front Lever' },
  { slug: 'l-sit-progression', name: 'Tuck L-Sit' },
  { slug: 'crow-pose', name: 'Crow Pose' },
  { slug: 'pistol-squat-progression', name: 'Pistol Squat' },
];

export default function AnimationDemoScreen() {
  const router = useRouter();
  const [selectedExerciseSlug, setSelectedExerciseSlug] = useState('standard-push-up');
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [selectedDemoCard, setSelectedDemoCard] = useState(true);
  const [demoInput, setDemoInput] = useState('');
  const [demoProgress, setDemoProgress] = useState(0.65);

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.section}>
        <AppText variant="h1" color={colors.text}>
          2D Motion & Theme Showcase
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Phase 0 exit criteria verification: Light theme palette, responsive design tokens, Reanimated UI micro-interactions, and 2D vector animation with fallback.
        </AppText>
      </View>

      {/* 2D Vector Animation Demo */}
      <AppCard variant="lavender" style={styles.card}>
        <View style={styles.rowBetween}>
          <AppText variant="h3" color={colors.primaryDeep}>
            2D Vector Movement Loop
          </AppText>
          <View style={styles.toggleRow}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.toggleLabel}>
              Force Static Fallback:
            </AppText>
            <Switch
              value={simulateReducedMotion}
              onValueChange={setSimulateReducedMotion}
              thumbColor={simulateReducedMotion ? colors.primary : colors.surface}
              trackColor={{ false: colors.border, true: colors.primaryLavender }}
            />
          </View>
        </View>

        {/* Horizontal Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {DEMO_EXERCISES.map((ex) => {
            const isSelected = ex.slug === selectedExerciseSlug;
            return (
              <Pressable
                key={ex.slug}
                onPress={() => setSelectedExerciseSlug(ex.slug)}
                style={[styles.demoPill, isSelected && styles.activeDemoPill]}
              >
                <AppText
                  variant="caption"
                  color={isSelected ? '#FFFFFF' : colors.primaryDeep}
                  style={styles.demoPillText}
                >
                  {ex.name}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.animationContainer}>
          {simulateReducedMotion ? (
            <View style={styles.forcedFallback}>
              <View style={styles.staticFigure}>
                <View style={styles.staticHead} />
                <View style={styles.staticTorso} />
                <View style={styles.staticGround} />
              </View>
              <AppText variant="caption" color={colors.textSecondary} style={styles.fallbackText}>
                Reduced Motion Mode Active — Static Diagram Fallback
              </AppText>
            </View>
          ) : (
            <ExerciseAnimation
              slug={selectedExerciseSlug}
              fallbackText="Calisthenics Form Demonstration"
              height={220}
            />
          )}
        </View>

        <AppText variant="body" color={colors.text} style={styles.demoNote}>
          Demonstrates controlled rep loop with play/pause and replay controls, respecting user motion preferences.
        </AppText>
      </AppCard>

      {/* Reanimated AnimatedCard Demo */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Reanimated AnimatedCard
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
          Features smooth entrance animation and spring touch feedback.
        </AppText>
        <AnimatedCard
          variant="lavender"
          onPress={() => setSelectedDemoCard((v) => !v)}
          style={styles.animatedCard}
        >
          <AppText variant="h3" color={colors.primaryDeep}>
            Interactive Animated Card (Tap Me)
          </AppText>
          <AppText variant="body" color={colors.text} style={styles.cardBody}>
            Smooth spring scale on press, entrance fade, safe-area aware.
          </AppText>
        </AnimatedCard>
      </View>

      {/* ProgressBar Demo */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Animated ProgressBar
        </AppText>
        <ProgressBar
          progress={demoProgress}
          label="Weekly Workout Completion"
          showPercent
          color={colors.primary}
        />
        <View style={styles.progressButtons}>
          <AppButton
            title="Set 25%"
            onPress={() => setDemoProgress(0.25)}
            variant="outline"
            size="sm"
            fullWidth={false}
          />
          <AppButton
            title="Set 65%"
            onPress={() => setDemoProgress(0.65)}
            variant="outline"
            size="sm"
            fullWidth={false}
          />
          <AppButton
            title="Set 100%"
            onPress={() => setDemoProgress(1.0)}
            variant="outline"
            size="sm"
            fullWidth={false}
          />
        </View>
      </View>

      {/* Palette Verification */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Design System Color Tokens
        </AppText>
        <View style={styles.colorGrid}>
          {[
            { name: 'Cascading White', hex: colors.background, text: colors.text, border: true },
            { name: 'Chinese Silver (Lavender)', hex: colors.primaryLavender, text: colors.primaryDeep },
            { name: 'Brand Purple', hex: colors.primary, text: colors.textInverse },
            { name: 'Deep Purple', hex: colors.primaryDeep, text: colors.textInverse },
            { name: 'Crunch (Warm Orange)', hex: colors.accent, text: '#5C3E0A' },
            { name: 'Dreamland (Muted)', hex: colors.surfaceSecondary, text: colors.textInverse },
            { name: 'Warm Haze', hex: colors.textSecondary, text: colors.textInverse },
            { name: 'Lead (Charcoal)', hex: colors.text, text: colors.textInverse },
          ].map((c) => (
            <View
              key={c.name}
              style={[
                styles.colorBox,
                { backgroundColor: c.hex },
                c.border && styles.boxBorder,
              ]}
            >
              <AppText variant="caption" style={{ color: c.text, fontWeight: '700' }}>
                {c.name}
              </AppText>
              <AppText variant="caption" style={{ color: c.text, opacity: 0.9 }}>
                {c.hex}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Button Hierarchy */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Button Hierarchy
        </AppText>
        <View style={styles.buttonStack}>
          <AppButton
            title="Primary Action (Brand Purple)"
            onPress={() => {}}
            variant="primary"
          />
          <AppButton
            title="Secondary Action (Lavender)"
            onPress={() => {}}
            variant="secondary"
          />
          <AppButton
            title="Outline Button"
            onPress={() => {}}
            variant="outline"
          />
          <AppButton
            title="Destructive Button"
            onPress={() => {}}
            variant="destructive"
          />
        </View>
      </View>

      {/* Selection Card */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Interactive Selection Card
        </AppText>
        <SelectionCard
          title="Push-Up Progression"
          description="Click to toggle selection state."
          selected={selectedDemoCard}
          onPress={() => setSelectedDemoCard((v) => !v)}
          badge="Interactive"
        />
      </View>

      {/* AppInput */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          AppInput (14px Radius)
        </AppText>
        <AppInput
          label="Test Input"
          placeholder="Type here..."
          value={demoInput}
          onChangeText={setDemoInput}
          helperText="Standard 14px radius input with focus highlight"
        />
      </View>

      {/* Feedback States */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text}>
          Feedback Components
        </AppText>
        <AppCard variant="default" style={styles.card}>
          <LoadingState fullScreen={false} message="Loading exercise demonstration..." />
        </AppCard>
        <AppCard variant="default" style={styles.card}>
          <EmptyState
            title="No Workouts Saved"
            description="Your completed sessions will appear here."
            actionTitle="Start a Workout"
            onAction={() => router.push('/(tabs)')}
          />
        </AppCard>
        <AppCard variant="default" style={styles.card}>
          <ErrorState
            title="Network Disconnected"
            message="Offline mode active. Workouts are saved locally."
            onRetry={() => {}}
          />
        </AppCard>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Back to App"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  sectionSubtitle: {
    marginTop: spacing.xxs,
    marginBottom: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
  },
  animatedCard: {
    marginVertical: spacing.xs,
  },
  cardBody: {
    marginTop: spacing.xs,
  },
  progressButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginRight: spacing.xs,
  },
  animationContainer: {
    marginVertical: spacing.sm,
  },
  forcedFallback: {
    height: 220,
    backgroundColor: colors.primaryLavender,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4CCF0',
    padding: spacing.md,
  },
  staticFigure: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  staticHead: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  staticTorso: {
    width: 22,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FAF8FD',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.xs,
  },
  staticGround: {
    width: 100,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  fallbackText: {
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  demoNote: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  pillsScroll: {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  demoPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  activeDemoPill: {
    backgroundColor: colors.primaryDeep,
    borderColor: colors.primaryDeep,
  },
  demoPillText: {
    fontWeight: '700',
    fontSize: 11,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  colorBox: {
    width: '48%',
    padding: spacing.sm,
    borderRadius: radii.input,
    minHeight: 64,
    justifyContent: 'center',
  },
  boxBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonStack: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  footer: {
    marginVertical: spacing.xl,
  },
});
