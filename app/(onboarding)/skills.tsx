import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/theme';
import { AppButton, SelectionCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function SkillsScreen() {
  const router = useRouter();
  const { target_skills, toggleTargetSkill } = useOnboardingStore();

  const skillOptions = [
    {
      id: 'handstand',
      title: 'Handstand',
      desc: 'Shoulder stability, wrist preparation, and balance on your hands.',
    },
    {
      id: 'planche',
      title: 'Planche',
      desc: 'Straight-arm pushing mastery and full-body horizontal tension.',
    },
    {
      id: 'front_lever',
      title: 'Front Lever',
      desc: 'Horizontal straight-arm pulling power and lat engagement.',
    },
    {
      id: 'back_lever',
      title: 'Back Lever',
      desc: 'Shoulder extension flexibility and posterior chain alignment.',
    },
    {
      id: 'muscle_up',
      title: 'Muscle-up',
      desc: 'Explosive vertical pull transitioning into a clean bar or ring dip.',
    },
    {
      id: 'l_sit',
      title: 'L-sit',
      desc: 'Foundational core compression, triceps depression, and hip flexor strength.',
    },
    {
      id: 'human_flag',
      title: 'Human Flag',
      desc: 'Side core strength and opposing push/pull lateral hold.',
    },
    {
      id: 'pistol_squat',
      title: 'Pistol Squat',
      desc: 'Single-leg strength, balance, and ankle dorsiflexion mobility.',
    },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={4}
        totalSteps={8}
        title="Which Skills Interest You?"
        subtitle="Select the movements you want to learn. We will guide you through verified prerequisites."
      />

      <View style={styles.list}>
        {skillOptions.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.title}
            description={opt.desc}
            selected={target_skills.includes(opt.id)}
            onPress={() => toggleTargetSkill(opt.id)}
            testID={`skill-option-${opt.id}`}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => router.push('/(onboarding)/equipment')}
          variant="primary"
          size="lg"
          testID="skills-continue-button"
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

