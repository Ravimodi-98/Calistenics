import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/theme';
import { AppButton, SelectionCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export default function EquipmentScreen() {
  const router = useRouter();
  const { available_equipment, toggleEquipment } = useOnboardingStore();

  const options = [
    {
      id: 'none',
      title: 'No Equipment (Default)',
      desc: 'Floor, wall, and your own bodyweight. Full training program with zero equipment.',
      badge: 'Core Philosophy',
    },
    {
      id: 'pull_up_bar',
      title: 'Pull-up Bar (Optional)',
      desc: 'Doorway, wall-mounted, or park bar for vertical hanging pull-ups and hangs.',
      badge: 'Optional',
    },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={5}
        totalSteps={8}
        title="What Equipment Do You Have?"
        subtitle="Select all items you can use. Exercise variations will adapt automatically."
      />

      <View style={styles.list}>
        {options.map((opt) => {
          const isSelected =
            opt.id === 'none'
              ? available_equipment.includes('none')
              : isEquipmentAvailable(available_equipment, opt.id);

          return (
            <SelectionCard
              key={opt.id}
              title={opt.title}
              description={opt.desc}
              badge={opt.badge}
              selected={isSelected}
              onPress={() => toggleEquipment(opt.id)}
              testID={`equipment-option-${opt.id}`}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => router.push('/(onboarding)/schedule')}
          disabled={available_equipment.length === 0}
          variant="primary"
          size="lg"
          testID="equipment-continue-button"
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
