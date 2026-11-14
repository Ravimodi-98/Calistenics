import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, AppInput, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function PreferencesScreen() {
  const router = useRouter();
  const {
    training_location,
    coaching_style,
    workout_preference,
    training_notes,
    setTrainingPreferences,
  } = useOnboardingStore();

  const locations = [
    { id: 'home' as const, label: 'Home', desc: 'Living room or home setup' },
    { id: 'outdoors' as const, label: 'Outdoors', desc: 'Parks, bars, or open air' },
    { id: 'gym' as const, label: 'Gym', desc: 'Commercial gym or club' },
  ];

  const stylesOptions = [
    { id: 'guided' as const, label: 'Guided Coach', desc: 'Detailed cues and set-by-set timers' },
    { id: 'independent' as const, label: 'Independent', desc: 'Minimal prompts, flexible flow' },
  ];

  const focusOptions = [
    { id: 'balanced' as const, label: 'Balanced', desc: 'Optimal mix of strength & skill' },
    { id: 'strength' as const, label: 'Strength-Focused', desc: 'Maximum reps & mechanical tension' },
    { id: 'skill' as const, label: 'Skill-Focused', desc: 'Emphasis on handstands & holds' },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={7}
        totalSteps={8}
        title="Let's Personalize Your Training"
        subtitle="Fine-tune your preferred environment, coaching interaction, and focus."
      />

      {/* 1. Location */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Primary Training Location
        </AppText>
        <View style={styles.choiceGroup}>
          {locations.map((loc) => {
            const isSelected = training_location === loc.id;
            return (
              <Pressable
                key={loc.id}
                onPress={() => setTrainingPreferences({ location: loc.id })}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
                ]}
                testID={`location-option-${loc.id}`}
              >
                <AppText
                  variant="h3"
                  style={isSelected ? styles.titleSelected : styles.titleUnselected}
                >
                  {loc.label}
                </AppText>
                <AppText
                  variant="caption"
                  style={isSelected ? styles.descSelected : styles.descUnselected}
                >
                  {loc.desc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. Coaching Style */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Coaching Experience
        </AppText>
        <View style={styles.choiceGroup}>
          {stylesOptions.map((item) => {
            const isSelected = coaching_style === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTrainingPreferences({ coaching: item.id })}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
                ]}
                testID={`coaching-option-${item.id}`}
              >
                <AppText
                  variant="h3"
                  style={isSelected ? styles.titleSelected : styles.titleUnselected}
                >
                  {item.label}
                </AppText>
                <AppText
                  variant="caption"
                  style={isSelected ? styles.descSelected : styles.descUnselected}
                >
                  {item.desc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 3. Workout Focus */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Workout Preference
        </AppText>
        <View style={styles.choiceGroup}>
          {focusOptions.map((item) => {
            const isSelected = workout_preference === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTrainingPreferences({ preference: item.id })}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
                ]}
                testID={`focus-option-${item.id}`}
              >
                <AppText
                  variant="h3"
                  style={isSelected ? styles.titleSelected : styles.titleUnselected}
                >
                  {item.label}
                </AppText>
                <AppText
                  variant="caption"
                  style={isSelected ? styles.descSelected : styles.descUnselected}
                >
                  {item.desc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 4. Optional Movement Notes */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Movement Considerations (Optional)
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
          Anything we should consider when suggesting exercises? (e.g. wrist tightness, shoulder mobility limits).
        </AppText>

        <AppInput
          placeholder="e.g. Sensitive left wrist on deep push-ups"
          value={training_notes}
          onChangeText={(text) => setTrainingPreferences({ notes: text })}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
          maxLength={500}
          testID="preferences-notes-input"
        />
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Review Profile Summary"
          onPress={() => router.push('/(onboarding)/summary')}
          variant="primary"
          size="lg"
          testID="preferences-continue-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xxs,
  },
  sectionSubtitle: {
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  choiceGroup: {
    gap: spacing.xs,
  },
  optionCard: {
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1.5,
  },
  optionCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  optionCardSelected: {
    backgroundColor: colors.primaryLavender,
    borderColor: colors.primary,
  },
  titleSelected: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  titleUnselected: {
    color: colors.text,
  },
  descSelected: {
    color: colors.text,
    marginTop: spacing.xxs,
  },
  descUnselected: {
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

