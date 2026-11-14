import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/theme';
import { AppButton, SelectionCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function ExperienceScreen() {
  const router = useRouter();
  const { experience_level, setExperienceLevel } = useOnboardingStore();

  const options = [
    {
      id: 'beginner' as const,
      title: 'Beginner',
      desc: 'New to calisthenics • Learning fundamental movements • Building basic bodyweight strength.',
      badge: 'Start Here',
    },
    {
      id: 'intermediate' as const,
      title: 'Intermediate',
      desc: 'Comfortable with fundamental exercises • Training consistently • Working toward advanced movements.',
      badge: undefined,
    },
    {
      id: 'advanced' as const,
      title: 'Advanced',
      desc: 'Experienced with bodyweight training • Practising challenging progressions • Developing advanced skills.',
      badge: undefined,
    },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={2}
        totalSteps={8}
        title="What's Your Experience?"
        subtitle="Choose the level that best describes your current training background."
      />

      <View style={styles.list}>
        {options.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.title}
            description={opt.desc}
            badge={opt.badge}
            selected={experience_level === opt.id}
            onPress={() => setExperienceLevel(opt.id)}
            testID={`experience-option-${opt.id}`}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => router.push('/(onboarding)/goals')}
          variant="primary"
          size="lg"
          testID="experience-continue-button"
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
