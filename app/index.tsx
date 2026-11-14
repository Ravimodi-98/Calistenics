import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { supabase } from '@/services/supabase/client';

export default function IndexScreen() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setCheckingAuth(false);
        if (session) {
          router.replace('/(tabs)');
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  return (
    <ScreenContainer scrollable={false} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <AppText variant="caption" style={styles.badgeText}>
            Calisthenics Coach 2.0
          </AppText>
        </View>

        <AppText variant="display" align="center" style={styles.title}>
          Master Your Bodyweight
        </AppText>

        <AppText variant="bodyLarge" align="center" style={styles.subtitle}>
          Structured progressions, clear 2D movement demonstrations, and supportive daily coaching.
        </AppText>

        <View style={styles.actionGroup}>
          <AppButton
            title="Explore App (Tabs Shell)"
            onPress={() => router.push('/(tabs)')}
            variant="primary"
            size="lg"
            style={styles.button}
          />

          <AppButton
            title="View 2D Animation & Theme Demo"
            onPress={() => router.push('/animation-demo')}
            variant="secondary"
            size="lg"
            style={styles.button}
          />

          <AppButton
            title="Sign In / Register"
            onPress={() => router.push('/(auth)/welcome')}
            variant="outline"
            size="md"
            style={styles.button}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  badge: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeText: {
    color: '#8A5D10',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  actionGroup: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    marginVertical: spacing.xxs,
  },
});

