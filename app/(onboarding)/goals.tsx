import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/theme';
import { AppButton, SelectionCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function GoalsScreen() {
  const router = useRouter();
  const { fitness_goals, toggleFitnessGoal } = useOnboardingStore();

  const options = [
    {
      id: 'build_strength',
      title: 'Build Strength',
      desc: 'Increase bodyweight pushing, vertical pulling, and core power.',
    },
    {
      id: 'improve_endurance',
      title: 'Improve Endurance',
      desc: 'Perform more repetitions with clean technique and cardiovascular stamina.',
    },
    {
      id: 'improve_flexibility',
      title: 'Improve Flexibility',
      desc: 'Enhance mobility, joint health, and active movement ranges.',
    },
    {
      id: 'master_skills',
      title: 'Master Calisthenics Skills',
      desc: 'Work systematically toward isometric holds and balance progressions.',
    },
    {
      id: 'general_fitness',
      title: 'Improve General Fitness',
      desc: 'Build consistent training habits and daily physical vitality.',
    },
    {
      id: 'movement_control',
      title: 'Develop Better Movement Control',
      desc: 'Refine body awareness, scapular control, and joint integrity.',
    },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={3}
        totalSteps={8}
        title="What Do You Want to Achieve?"
        subtitle="Select all goals that apply. Choose at least one to personalize your roadmap."
      />

      <View style={styles.list}>
        {options.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.title}
            description={opt.desc}
            selected={fitness_goals.includes(opt.id)}
            onPress={() => toggleFitnessGoal(opt.id)}
            testID={`goal-option-${opt.id}`}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => router.push('/(onboarding)/skills')}
          disabled={fitness_goals.length === 0}
          variant="primary"
          size="lg"
          testID="goals-continue-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginVertical: spacing.md,
    gap: spacing.xs,
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
