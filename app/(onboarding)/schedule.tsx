import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, AppCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function ScheduleScreen() {
  const router = useRouter();
  const {
    training_days,
    session_duration_minutes,
    preferred_training_time,
    toggleTrainingDay,
    setSessionDuration,
    setPreferredTrainingTime,
  } = useOnboardingStore();

  const days = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' },
  ];

  const durations: (15 | 20 | 30 | 45 | 60)[] = [15, 20, 30, 45, 60];

  const times = [
    { id: 'morning' as const, label: 'Morning', desc: '6 AM – 12 PM' },
    { id: 'afternoon' as const, label: 'Afternoon', desc: '12 PM – 5 PM' },
    { id: 'evening' as const, label: 'Evening', desc: '5 PM – 10 PM' },
    { id: 'flexible' as const, label: 'Flexible', desc: 'Whenever fits best' },
  ];

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={6}
        totalSteps={8}
        title="When Do You Prefer to Train?"
        subtitle="Select your preferred training days, session duration, and ideal time of day."
      />

      {/* 1. Training Days */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Preferred Days ({training_days.length} selected)
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
          Rest is part of progress. We recommend 2 to 4 training days per week.
        </AppText>

        <View style={styles.daysRow}>
          {days.map((day) => {
            const isSelected = training_days.includes(day.id);
            return (
              <Pressable
                key={day.id}
                onPress={() => toggleTrainingDay(day.id)}
                accessibilityRole="button"
                accessibilityLabel={day.label}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.dayChip,
                  isSelected ? styles.dayChipSelected : styles.dayChipUnselected,
                ]}
                testID={`day-chip-${day.id}`}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.dayChipText,
                    isSelected ? styles.dayChipTextSelected : styles.dayChipTextUnselected,
                  ]}
                >
                  {day.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. Session Duration */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Session Duration
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
          How many minutes can you dedicate per workout?
        </AppText>

        <View style={styles.durationRow}>
          {durations.map((mins) => {
            const isSelected = session_duration_minutes === mins;
            return (
              <Pressable
                key={mins}
                onPress={() => setSessionDuration(mins)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.durationChip,
                  isSelected ? styles.durationChipSelected : styles.durationChipUnselected,
                ]}
                testID={`duration-chip-${mins}`}
              >
                <AppText
                  variant="buttonSmall"
                  style={[
                    styles.durationText,
                    isSelected ? styles.durationTextSelected : styles.durationTextUnselected,
                  ]}
                >
                  {mins} min
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 3. Preferred Time */}
      <View style={styles.section}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Time of Day
        </AppText>

        <View style={styles.timesGrid}>
          {times.map((item) => {
            const isSelected = preferred_training_time === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setPreferredTrainingTime(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.timeCard,
                  isSelected ? styles.timeCardSelected : styles.timeCardUnselected,
                ]}
                testID={`time-card-${item.id}`}
              >
                <AppText
                  variant="h3"
                  style={[
                    styles.timeTitle,
                    isSelected ? styles.timeTitleSelected : styles.timeTitleUnselected,
                  ]}
                >
                  {item.label}
                </AppText>
                <AppText
                  variant="caption"
                  style={[
                    styles.timeDesc,
                    isSelected ? styles.timeDescSelected : styles.timeDescUnselected,
                  ]}
                >
                  {item.desc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => router.push('/(onboarding)/preferences')}
          disabled={training_days.length === 0}
          variant="primary"
          size="lg"
          testID="schedule-continue-button"
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayChip: {
    flex: 1,
    height: 44,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  dayChipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  dayChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    fontWeight: '700',
  },
  dayChipTextUnselected: {
    color: colors.text,
  },
  dayChipTextSelected: {
    color: colors.textInverse,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  durationChipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  durationChipSelected: {
    backgroundColor: colors.primaryLavender,
    borderColor: colors.primary,
  },
  durationText: {
    fontWeight: '700',
  },
  durationTextUnselected: {
    color: colors.text,
  },
  durationTextSelected: {
    color: colors.primaryDeep,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1.5,
  },
  timeCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  timeCardSelected: {
    backgroundColor: colors.primaryLavender,
    borderColor: colors.primary,
  },
  timeTitle: {
    fontWeight: '700',
  },
  timeTitleUnselected: {
    color: colors.text,
  },
  timeTitleSelected: {
    color: colors.primaryDeep,
  },
  timeDesc: {
    marginTop: spacing.xxs,
  },
  timeDescUnselected: {
    color: colors.textSecondary,
  },
  timeDescSelected: {
    color: colors.text,
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
