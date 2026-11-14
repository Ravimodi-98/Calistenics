import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="skills" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
