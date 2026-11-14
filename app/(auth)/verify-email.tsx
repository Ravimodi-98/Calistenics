import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, ScreenContainer } from '@/components';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Mail, CheckCircle2 } from 'lucide-react-native';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, pendingVerificationEmail, resendVerification, refreshProfile, isLoading } = useAuthStore();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const displayEmail = pendingVerificationEmail || user?.email || 'your email address';

  const handleResend = async () => {
    setErrorMessage(null);
    setResendSuccess(false);
    try {
      await resendVerification();
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to resend verification email.');
    }
  };

  const handleCheckStatus = async () => {
    setErrorMessage(null);
    setCheckingStatus(true);
    try {
      // Re-fetch profile and session to verify confirmation state
      const profile = await refreshProfile();
      const currentUser = useAuthStore.getState().user;

      if (currentUser?.email_confirmed_at || currentUser?.confirmed_at) {
        if (profile?.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/welcome');
        }
      } else {
        setErrorMessage('Email not yet verified. Please click the link sent to your inbox.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to verify status. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Mail size={40} color={colors.primary} />
        </View>

        <AppText variant="h1" align="center" color={colors.text} style={styles.title}>
          Verify Your Email
        </AppText>
        <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
          We sent a verification link to:
        </AppText>
        <AppText variant="h3" align="center" color={colors.primaryDeep} style={styles.emailText}>
          {displayEmail}
        </AppText>
      </View>

      {resendSuccess && (
        <View style={styles.successBanner} accessibilityRole="alert">
          <CheckCircle2 size={18} color={colors.success} style={styles.bannerIcon} />
          <AppText variant="caption" style={styles.successText}>
            A fresh verification link has been sent to your inbox.
          </AppText>
        </View>
      )}

      {errorMessage && (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <AppText variant="caption" style={styles.errorText}>
            {errorMessage}
          </AppText>
        </View>
      )}

      <View style={styles.card}>
        <AppText variant="h3" color={colors.primaryDeep} style={styles.cardHeading}>
          Instructions:
        </AppText>
        <AppText variant="body" color={colors.text} style={styles.stepText}>
          1. Check your email inbox (and spam/junk folder).
        </AppText>
        <AppText variant="body" color={colors.text} style={styles.stepText}>
          2. Click the verification link from Calisthenics Coach.
        </AppText>
        <AppText variant="body" color={colors.text} style={styles.stepText}>
          3. Tap "I've Verified My Email" below to continue.
        </AppText>
      </View>

      <View style={styles.actionGroup}>
        <AppButton
          title="I've Verified My Email"
          onPress={handleCheckStatus}
          loading={checkingStatus}
          variant="primary"
          size="lg"
          testID="verify-check-status-button"
        />

        <AppButton
          title="Resend Verification Email"
          onPress={handleResend}
          loading={isLoading}
          variant="secondary"
          size="md"
          testID="verify-resend-button"
        />

        <AppButton
          title="Back to Sign In"
          onPress={() => router.replace('/(auth)/sign-in')}
          variant="ghost"
          size="sm"
          testID="verify-back-to-signin-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 22,
  },
  emailText: {
    marginTop: spacing.xxs,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successMuted,
    borderWidth: 1,
    borderColor: colors.success,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  bannerIcon: {
    marginRight: spacing.xs,
  },
  successText: {
    color: colors.success,
    fontWeight: '600',
    flex: 1,
  },
  errorBanner: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  cardHeading: {
    marginBottom: spacing.sm,
  },
  stepText: {
    marginVertical: spacing.xxs,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actionGroup: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
});

